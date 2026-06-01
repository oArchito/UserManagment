import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jwt_secret_key_12345', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, department } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // First registered user is Admin (optional, for bootstrap convenience, but let's stick to standard User role as default)
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'Admin' : 'User';

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      department: department || 'General',
      role,
      status: 'Active'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        department: user.department,
        profileImage: user.profileImage,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'User account is inactive. Please contact admin.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        department: user.department,
        profileImage: user.profileImage,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (stateless, client clears token, but server can give confirmation)
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  res.json({ message: 'Successfully logged out' });
};

// @desc    Forgot password - generate reset token & email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email address' });
    }

    // Create reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and set expiry
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    // For convenience of local browser testing, we can point to client URL if we know it (usually localhost:5173 for Vite)
    const clientUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${clientUrl}`;

    console.log('\n=============================================');
    console.log('PASSWORD RESET LINK SENT TO CONSOLE FOR TESTING:');
    console.log(clientUrl);
    console.log('=============================================\n');

    // Attempt to send email if configured
    let emailSent = false;
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: `"${process.env.FROM_NAME || 'User Management System'}" <${process.env.FROM_EMAIL || 'noreply@admin.com'}>`,
          to: user.email,
          subject: 'Password Reset Request',
          text: message
        });
        emailSent = true;
      } catch (err) {
        console.error('SMTP Mail send failed:', err.message);
      }
    }

    res.json({
      message: 'Password reset link sent to email (and logged in server console).',
      // In development mode, return it in response for instant access without console logs
      resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
      resetUrl: process.env.NODE_ENV !== 'production' ? clientUrl : undefined
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    next(error);
  }
};
