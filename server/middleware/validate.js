import validator from 'validator';

export const validateRegister = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const errors = {};

  if (!firstName || validator.isEmpty(firstName.trim())) {
    errors.firstName = 'First name is required';
  }

  if (!lastName || validator.isEmpty(lastName.trim())) {
    errors.lastName = 'Last name is required';
  }

  if (!email || !validator.isEmail(email)) {
    errors.email = 'Please provide a valid email';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || !validator.isEmail(email)) {
    errors.email = 'Please provide a valid email';
  }

  if (!password || validator.isEmpty(password)) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateUserUpsert = (req, res, next) => {
  const { firstName, lastName, email, role, status } = req.body;
  const errors = {};

  if (!firstName || validator.isEmpty(firstName.trim())) {
    errors.firstName = 'First name is required';
  }

  if (!lastName || validator.isEmpty(lastName.trim())) {
    errors.lastName = 'Last name is required';
  }

  if (!email || !validator.isEmail(email)) {
    errors.email = 'Please provide a valid email';
  }

  if (role && !['Admin', 'Manager', 'User'].includes(role)) {
    errors.role = 'Invalid role selected';
  }

  if (status && !['Active', 'Inactive'].includes(status)) {
    errors.status = 'Invalid status selected';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
