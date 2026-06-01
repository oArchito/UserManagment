import User from '../models/User.js';

// @desc    Get all users with search, filtering, sorting, and pagination
// @route   GET /api/users
// @access  Private/Admin,Manager
export const getUsers = async (req, res, next) => {
  try {
    const { 
      search, 
      role, 
      department, 
      status, 
      sort = '-createdAt', 
      page = 1, 
      limit = 10 
    } = req.query;

    const query = {};

    // Search by name (firstName/lastName) or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (role) query.role = role;
    if (department) query.department = department;
    if (status) query.status = status;

    // Execute pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Total count
    const total = await User.countDocuments(query);

    // Get users
    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.json({
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user details
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Role restrictions:
    // Admin & Manager can view anyone.
    // User can only view themselves.
    if (req.user.role === 'User' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: You can only view your own profile' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, role, department, profileImage, status } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: password || 'Welcome123', // Default temporary password if not provided
      phone,
      role: role || 'User',
      department: department || 'General',
      profileImage: profileImage || '',
      status: status || 'Active'
    });

    const userResponse = await User.findById(user._id).select('-password');
    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const userToEdit = await User.findById(targetUserId);

    if (!userToEdit) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Role Permission Checks:
    // 1. User can only update their own profile.
    // 2. Manager can view and update assigned users (users in their same department, or general).
    //    Managers cannot edit other managers or Admins, or edit users of another department.
    // 3. Admin can edit any user.
    if (req.user.role === 'User') {
      if (req.user._id.toString() !== targetUserId) {
        return res.status(403).json({ message: 'Access denied: You can only update your own profile' });
      }
      
      // Standard users can't change their role, department, or status
      req.body.role = undefined;
      req.body.department = undefined;
      req.body.status = undefined;
    } else if (req.user.role === 'Manager') {
      // Manager checks:
      if (userToEdit.role === 'Admin') {
        return res.status(403).json({ message: 'Access denied: Managers cannot edit Admin users' });
      }

      // Check if user belongs to manager's department
      if (userToEdit.department !== req.user.department && req.user._id.toString() !== targetUserId) {
        return res.status(403).json({ 
          message: `Access denied: You can only edit users within your department (${req.user.department})` 
        });
      }

      // Managers cannot change users' roles, status, or department to something else
      // They can only update basic fields (firstName, lastName, email, phone, profileImage)
      req.body.role = undefined;
      req.body.status = undefined;
      req.body.department = undefined; // Don't let managers move users out of their department
    }

    // Capture fields
    const { firstName, lastName, email, phone, role, department, profileImage, status, password } = req.body;

    if (email && email !== userToEdit.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      userToEdit.email = email;
    }

    if (firstName) userToEdit.firstName = firstName;
    if (lastName) userToEdit.lastName = lastName;
    if (phone !== undefined) userToEdit.phone = phone;
    if (profileImage !== undefined) userToEdit.profileImage = profileImage;

    // Admin-only fields (or self-update ignores this)
    if (req.user.role === 'Admin') {
      if (role) userToEdit.role = role;
      if (department) userToEdit.department = department;
      if (status) userToEdit.status = status;
    }

    // Password updates
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      userToEdit.password = password; // Trigger save hook encryption
    }

    await userToEdit.save();

    const updatedUser = await User.findById(targetUserId).select('-password');
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics (Admin/Manager only)
// @route   GET /api/users/stats
// @access  Private/Admin,Manager
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const inactiveUsers = await User.countDocuments({ status: 'Inactive' });

    // Aggregate by department
    const departmentStats = await User.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Aggregate by role
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Recent registrations (limit to 5)
    const recentRegistrations = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      departmentStats: departmentStats.map(stat => ({
        name: stat._id || 'Unassigned',
        value: stat.count
      })),
      roleStats: roleStats.map(stat => ({
        name: stat._id,
        value: stat.count
      })),
      recentRegistrations
    });
  } catch (error) {
    next(error);
  }
};
