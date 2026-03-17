import * as Yup from 'yup';

export const registerSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  phoneNo: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional(),
  address: Yup.string().optional(),
  City: Yup.string().optional(),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const otpSchema = Yup.object({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, 'OTP must be 6 digits')
    .required('OTP is required'),
});

export const updateProfileSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  phoneNo: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional(),
  address: Yup.string().optional(),
  City: Yup.string().optional(),
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'New password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm new password is required'),
});