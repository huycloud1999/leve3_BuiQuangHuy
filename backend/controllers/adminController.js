import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  userBasicInfoSchema,
  userAuthInfoSchema,
  weatherLocationValidationSchema,
  weatherInfoValidationSchema,
} from "../validators/userValidator.js";
import UserBasicInfoModel from "../models/UserBasicInfo.js";
import WeatherInfoSchemaModel from "../models/WeatherInfo.js";
import UserAuthInfoModel from "../models/UserAuthInfo.js";
import LocationSchemaModel from "../models/Location.js";
import {
  resClientData,
  hashingPassword,
  comparePassword,
  generateJwt,
  decodeToken,
} from "../utils/index.js";
import jwt from "jsonwebtoken";
dotenv.config(); // Load biến môi trường từ file .env

// Tiếp tục với phần mã của bạn
const { SECRET_CODE } = process.env;

const getQuality = (value, thresholds) => {
  if (value <= thresholds.low) {
    return "Low";
  } else if (value <= thresholds.moderate) {
    return "Moderate";
  } else {
    return "High";
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Nếu người dùng có vai trò là admin, tiếp tục thực hiện lấy danh sách người dùng
    const userInfo = await UserBasicInfoModel.find({}).populate(
      "authId",
      "-password"
    );
    return resClientData(res, 200, userInfo);
  } catch (error) {
    return resClientData(res, 500, null, "Error retrieving users");
  }
};
//add location
export const addLocation = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;

    // Kiểm tra dữ liệu đầu vào bằng Yup schema
    try {
      await weatherLocationValidationSchema.validate({
        name,
        latitude,
        longitude,
      });
    } catch (error) {
      return resClientData(res, 400, null, error.message);
    }

    // Kiểm tra xem địa điểm đã tồn tại chưa
    const existingLocation = await LocationSchemaModel.findOne({ name });
    if (existingLocation) {
      return resClientData(res, 400, null, "Location already exists!!");
    }

    // Tạo thông tin location mới
    const newLocation = new LocationSchemaModel({
      name,
      latitude,
      longitude,
    });

    await newLocation.save();

    return resClientData(res, 201, newLocation, "Add Location successfully");
  } catch (error) {
    return resClientData(res, 500, null, error, message);
  }
};
//add weather info
export const addWeatherInfo = async (req, res) => {
  try {
    const {
      locationId,
      date,
      weather_desc,
      temperature,
      humidity,
      windSpeed,
      visibility,
      air,
      uvIndex,
      rateRainy,
    } = req.body;
    try {
      await weatherInfoValidationSchema.validate({
        locationId,
        date,
        weather_desc,
        temperature,
        humidity,
        windSpeed,
        visibility,
        air,
        uvIndex,
        rateRainy,
      });
    } catch (error) {
      return resClientData(res, 400, null, error.message);
    }

    const location = await LocationSchemaModel.findById(locationId);
    if (!location) {
      return res.status(400).json({ message: "Location not found" });
    }
    const newWeatherInfo = new WeatherInfoSchemaModel({
      locationId,
      date,
      weather_desc,
      temperature,
      humidity,
      windSpeed,
      visibility,
      air,
      uvIndex,
      rateRainy,
    });

    const thresholds = {
      humidity: { low: 30, moderate: 60 },
      windSpeed: { low: 10, moderate: 20 },
      visibility: { low: 5, moderate: 10 },
      air: { low: 50, moderate: 100 },
      uvIndex: { low: 2, moderate: 5 },
      rateRainy: { low: 0.5, moderate: 1 },
    };

    // Xác định chất lượng dựa trên ngưỡng
    const humidityQuality = getQuality(humidity, thresholds.humidity);
    const windSpeedQuality = getQuality(windSpeed, thresholds.windSpeed);
    const visibilityQuality = getQuality(visibility, thresholds.visibility);
    const airQuality = getQuality(air, thresholds.air);
    const uvIndexQuality = getQuality(uvIndex, thresholds.uvIndex);
    const rateRainyQuality = getQuality(rateRainy, thresholds.rateRainy);

    // Tiến hành thêm thông tin thời tiết mới
    const newWeatherInfoAll = new WeatherInfoSchemaModel({
      locationId,
      date,
      weather_desc,
      temperature,
      humidity,
      humidityQuality,
      windSpeed,
      windSpeedQuality,
      visibility,
      visibilityQuality,
      air,
      airQuality,
      uvIndex,
      uvIndexQuality,
      rateRainy,
      rateRainyQuality,
    });

    await newWeatherInfoAll.save();
    return resClientData(
      res,
      201,
      newWeatherInfo,
      "Add weather data successfully"
    );
  } catch (error) {
    return resClientData(res, 500, null, error.message);
  }
};
//getLoction
export const getAllLocation = async (req, res) => {
  try {
    const LocationData = await LocationSchemaModel.find({});
    if (!LocationData) throw new Error("Data empty");

    resClientData(res, 201, LocationData, "Lấy data thành công");
  } catch (error) {
    return resClientData(res, 500, null, error.message);
  }
};
//getLocationDataWeather
export const getWeatherData = async (req, res) => {
  try {
    const { locationId } = req.query; // Sử dụng req.query để lấy locationId từ query parameters
    const weatherData = await WeatherInfoSchemaModel.find({ locationId });

    if (weatherData.length === 0) {
      return resClientData(
        res,
        404,
        null,
        "Không có dữ liệu thời tiết cho vị trí này"
      );
    }

    return resClientData(res, 200, weatherData, "Lấy dữ liệu thành công");
  } catch (error) {
    return resClientData(res, 500, null, error.message);
  }
};
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body; // Dữ liệu được gửi từ frontend

    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await UserBasicInfoModel.findOne({
      authId: userId
    }).populate("authId");
    const existingUserAuth = await UserAuthInfoModel.findOne({
      _id: userId,
    });
    console.log(existingUserAuth)
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cập nhật thông tin người dùng
    if (updatedUser.firstname) {
      existingUser.firstname = updatedUser.firstname;
    }
    if (updatedUser.surname) {
      existingUser.surname = updatedUser.surname;
    }
    if (updatedUser.dateOfBirth) {
      existingUser.dateOfBirth = updatedUser.dateOfBirth;
    }
    if (updatedUser.phoneNumber) {
      existingUser.phoneNumber = updatedUser.phoneNumber;
    }
    if (updatedUser.username) {
      existingUser.username = updatedUser.username;
    }
    if (updatedUser.gender) {
      existingUser.gender = updatedUser.gender;
    }
    if (updatedUser.role) {
      existingUserAuth.role = updatedUser.role;
    }

    const savedUser = await existingUser.save();
    const savedauth =await existingUserAuth.save();
    resClientData(res, 201, savedUser, "Cập nhật thành công");
  } catch (error) {
    return resClientData(res, 500, null, error.message);
  }
};

