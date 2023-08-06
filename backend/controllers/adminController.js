import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import {
  userBasicInfoSchema,
  userAuthInfoSchema,
} from "../validators/userValidator.js";
import UserBasicInfoModel from "../models/UserBasicInfo.js";
import UserAuthInfoModel from "../models/UserAuthInfo.js";
import {   resClientData,
  hashingPassword,
  comparePassword,generateJwt,decodeToken} from "../utils/index.js";
import jwt from 'jsonwebtoken';
dotenv.config(); // Load biến môi trường từ file .env

// Tiếp tục với phần mã của bạn
const {SECRET_CODE}=process.env

export const getAllUsers = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) throw new Error('Unauthorized');
    
        const getToken = token.split(' ')[1];
        const verify = decodeToken(getToken);
        if (!verify) throw new Error('Verification failed!');
        console.log(verify.role)
      if (verify.role !== 'ADMIN') return resClientData(res, 500, null, 'Bạn không có quyền hạn');

      // Nếu người dùng có vai trò là admin, tiếp tục thực hiện lấy danh sách người dùng
      const userInfo = await UserBasicInfoModel.find({}).populate('authId', '-password');
      return resClientData(res, 200, userInfo);
    } catch (error) {
      return resClientData(res, 500, null, 'Error retrieving users');
    }
  };