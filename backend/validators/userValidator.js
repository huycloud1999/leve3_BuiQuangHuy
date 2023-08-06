// validators/userValidator.js
import * as yup from 'yup';

// Validate schema for UserBasicInfoModel
export const userBasicInfoSchema = yup.object().shape({
  firstname: yup.string(),
  surname: yup.string(),
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required'),
  dateOfBirth: yup.date(),
  phoneNumber: yup.string(),
  gender: yup.string()
});

// Validate schema for UserAuthInfoModel
export const userAuthInfoSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});
