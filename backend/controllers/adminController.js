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
    const { name, latitude, longitude, code } = req.body;

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
      code,
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

    const existingWeatherData = await WeatherInfoSchemaModel.findOne({
      locationId,
      date,
    });
    if (existingWeatherData) {
      return resClientData(
        res,
        400,
        null,
        "Dữ liệu thời tiết cho ngày và địa điểm này đã tồn tại"
      );
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
export const updateWeatherData = async (req, res) => {
  try {
    const data = req.body;
    // Kiểm tra xem dữ liệu thời tiết cần cập nhật có tồn tại hay không
    const existingWeatherData = await WeatherInfoSchemaModel.findById(data.id);
    if (!existingWeatherData) {
      return resClientData(
        res,
        404,
        null,
        "Không tìm thấy dữ liệu thời tiết cần cập nhật"
      );
    }

    // Tiến hành cập nhật dữ liệu thời tiết
    try {
      await weatherInfoValidationSchema.validate({
        locationId: existingWeatherData.locationId,
        date: existingWeatherData.date,
        weather_desc: data.weather_desc || existingWeatherData.weather_desc,
        temperature: data.temperature || existingWeatherData.temperature,
        humidity: data.humidity || existingWeatherData.humidity,
        windSpeed: data.windSpeed || existingWeatherData.windSpeed,
        visibility: data.visibility || existingWeatherData.visibility,
        air: data.air || existingWeatherData.air,
        uvIndex: data.uvIndex || existingWeatherData.uvIndex,
        rateRainy: data.rateRainy || existingWeatherData.rateRainy,
      });
    } catch (error) {
      return resClientData(res, 400, null, error.message);
    }

    // Xác định chất lượng dựa trên ngưỡng (tương tự như hàm addWeatherInfo)
    const thresholds = {
      humidity: { low: 30, moderate: 60 },
      windSpeed: { low: 10, moderate: 20 },
      visibility: { low: 5, moderate: 10 },
      air: { low: 50, moderate: 100 },
      uvIndex: { low: 2, moderate: 5 },
      rateRainy: { low: 0.5, moderate: 1 },
    };
    const humidityQuality = getQuality(
      data.humidity || existingWeatherData.humidity,
      thresholds.humidity
    );
    const windSpeedQuality = getQuality(
      data.windSpeed || existingWeatherData.windSpeed,
      thresholds.windSpeed
    );
    const visibilityQuality = getQuality(
      data.visibility || existingWeatherData.visibility,
      thresholds.visibility
    );
    const airQuality = getQuality(
      data.air || existingWeatherData.air,
      thresholds.air
    );
    const uvIndexQuality = getQuality(
      data.uvIndex || existingWeatherData.uvIndex,
      thresholds.uvIndex
    );
    const rateRainyQuality = getQuality(
      data.rateRainy || existingWeatherData.rateRainy,
      thresholds.rateRainy
    );

    // Cập nhật dữ liệu thời tiết
    existingWeatherData.weather_desc =
      data.weather_desc || existingWeatherData.weather_desc;
    existingWeatherData.temperature =
      data.temperature || existingWeatherData.temperature;
    existingWeatherData.humidity =
      data.humidity || existingWeatherData.humidity;
    existingWeatherData.humidityQuality = humidityQuality;
    existingWeatherData.windSpeed =
      data.windSpeed || existingWeatherData.windSpeed;
    existingWeatherData.windSpeedQuality = windSpeedQuality;
    existingWeatherData.visibility =
      data.visibility || existingWeatherData.visibility;
    existingWeatherData.visibilityQuality = visibilityQuality;
    existingWeatherData.air = data.air || existingWeatherData.air;
    existingWeatherData.airQuality = airQuality;
    existingWeatherData.uvIndex = data.uvIndex || existingWeatherData.uvIndex;
    existingWeatherData.uvIndexQuality = uvIndexQuality;
    existingWeatherData.rateRainy =
      data.rateRainy || existingWeatherData.rateRainy;
    existingWeatherData.rateRainyQuality = rateRainyQuality;

    // Lưu dữ liệu sau khi cập nhật
    await existingWeatherData.save();

    return resClientData(
      res,
      200,
      existingWeatherData,
      "Cập nhật dữ liệu thời tiết thành công"
    );
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
      authId: userId,
    }).populate("authId");
    const existingUserAuth = await UserAuthInfoModel.findOne({
      _id: userId,
    });
    console.log(existingUserAuth);
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
    const savedauth = await existingUserAuth.save();
    resClientData(res, 201, savedUser, "Cập nhật thành công");
  } catch (error) {
    return resClientData(res, 500, null, error.message);
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await UserBasicInfoModel.findOne({
      authId: userId,
    }).populate("authId");

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Xóa người dùng khỏi cơ sở dữ liệu
    await UserBasicInfoModel.findByIdAndDelete(existingUser._id);
    await UserAuthInfoModel.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting user" });
  }
};
export const deleteLocation = async (req, res) => {
  try {
    const locationId = req.params.id; // Lấy locationId từ request parameters

    // Kiểm tra xem location có tồn tại không
    const location = await LocationSchemaModel.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Xóa location
    await LocationSchemaModel.findByIdAndDelete(locationId);

    return res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while deleting location" });
  }
};
export const updateLocation = async (req, res) => {
  try {
    const locationId = req.params.id; // Lấy locationId từ request parameters
    const { name, latitude, longitude, code } = req.body; // Lấy thông tin cập nhật từ request body

    // Kiểm tra xem location có tồn tại không
    const existingLocation = await LocationSchemaModel.findById(locationId);
    if (!existingLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Cập nhật thông tin location
    existingLocation.name = name;
    existingLocation.latitude = latitude;
    existingLocation.longitude = longitude;
    existingLocation.code = code;

    await existingLocation.save();

    return res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while updating location" });
  }
};
export const deleteWeatherdata = async (req, res) => {
  try {
    const locationId = req.params.id; // Lấy locationId từ request parameters

    // Kiểm tra xem location có tồn tại không
    const location = await WeatherInfoSchemaModel.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Xóa location
    await WeatherInfoSchemaModel.findByIdAndDelete(locationId);

    return res
      .status(200)
      .json({ message: "WeatherData deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while deleting location" });
  }
};
