// validators/userValidator.js
import * as yup from "yup";

// Validate schema for UserBasicInfoModel
export const userBasicInfoSchema = yup.object().shape({
  firstname: yup.string(),
  surname: yup.string(),
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup.string().required("Username is required"),
  dateOfBirth: yup.date(),
  phoneNumber: yup.string(),
  gender: yup.string(),
});

// Validate schema for UserAuthInfoModel
export const userAuthInfoSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});
export const weatherLocationValidationSchema = yup.object().shape({
  name: yup.string().required("Name location is required"),
  latitude: yup.string().required("Latitude is required"),
  longitude: yup.string().required("Longitude is required"),
});

export const weatherInfoValidationSchema = yup.object().shape({
  date: yup.date().required("Date is required"),
  weather_desc: yup.string().required("Weather description is required"),
  temperature: yup.number().required("Temperature is required"),
  humidity: yup.number().required("Humidity is required"),
  windSpeed: yup.number().required("Wind speed is required"),
  visibility: yup.number().required("Visibility is required"),
  air: yup.number().required("Air quality is required"),
  uvIndex: yup.number().required("UV index is required"),
  rateRainy: yup.number().required("Rain rate is required"),
});
