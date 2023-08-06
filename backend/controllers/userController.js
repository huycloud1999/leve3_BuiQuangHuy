// controllers/userController.js
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import {
  userBasicInfoSchema,
  userAuthInfoSchema,
} from "../validators/userValidator.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import UserBasicInfoModel from "../models/UserBasicInfo.js";
import UserAuthInfoModel from "../models/UserAuthInfo.js";
import {   resClientData,
  hashingPassword,
  comparePassword,generateJwt,decodeToken} from "../utils/index.js";
import jwt from 'jsonwebtoken';
import multer from "multer";

dotenv.config(); // Load biến môi trường từ file .env

// Tiếp tục với phần mã của bạn
const {SECRET_CODE,CLOUD_NAME,API_KEY,API_SECRET}=process.env
cloudinary.v2.config({
  cloud_name:CLOUD_NAME ,
  api_key: API_KEY,
  api_secret: API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "avatar", // Thư mục trên Cloudinary để lưu trữ ảnh (tuỳ chọn)
    allowed_formats: ["jpg", "jpeg", "png"], // Các định dạng cho phép (tuỳ chọn)
    // ... Các thiết lập khác (nếu cần)
  },
});
const upload = multer({ storage: storage }).single("data");

export const signUp = async (req, res) => {
  try {
    const {
      firstname,
      surname,
      email,
      username,
      password,
      day,
      month,
      year,
      gender,
      role
    } = req.body;
    console.log(req.body);
    // Validate dữ liệu trước khi xử lý đăng ký thông tin người dùng cơ bản
    try {
      await userBasicInfoSchema.validate(
        {
          firstname,
          surname,
          email,
          username,
          dateOfBirth: new Date(year, month - 1, day),
          gender,
        }
      );
    } catch (error) {
      return resClientData(res, 400, null, error.message);
    }

    // Kiểm tra xem username và email đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await UserAuthInfoModel.findOne({email});
    if (existingUser) {
      return resClientData(res, 400, null, "Email already exists!!");
    }

    // Tiếp tục xử lý đăng ký nếu dữ liệu hợp lệ
    // Mã hóa mật khẩu
    const { hashedPassword, salt } = hashingPassword(password);

    // Tạo thông tin xác thực người dùng
    const userAuthInfo = new UserAuthInfoModel({
      email,
      password: hashedPassword,
      salt,
      role,
    });

    // Lưu thông tin xác thực người dùng vào cơ sở dữ liệu
    const savedUserAuthInfo = await userAuthInfo.save();

    // Tạo thông tin người dùng cơ bản và gán authId từ thông tin xác thực người dùng
    const userBasicInfo = new UserBasicInfoModel({
      firstname,
      surname,
      username,
      dateOfBirth: new Date(year, month - 1, day),
      gender,
      authId: savedUserAuthInfo._id,
    });

    // Lưu thông tin người dùng cơ bản vào cơ sở dữ liệu
    const savedUserBasicInfo = await userBasicInfo.save();

    // Trả về thông báo thành công
    return resClientData(res, 201, userAuthInfo, "User registered successfully");
  } catch (error) {
    return resClientData(res, 500, null, "Error registering user");
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate dữ liệu trước khi xử lý đăng nhập thông tin xác thực người dùng
    try {
      await userAuthInfoSchema.validate(
        {
          email,
          password
        }
      );
    } catch (error) {
      return resClientData(res, 400, null, error.message);
    }

    // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
    const user = await UserAuthInfoModel.findOne({ email });
    
    if (!user) {
      return resClientData(res, 400, null, 'Invalid username or password');
    }

    // Kiểm tra mật khẩu
    const isPasswordCorrect = comparePassword(password, user.salt,user.password);
    if (!isPasswordCorrect) {
      return resClientData(res, 400, null, 'Invalid username or password');
    }

    // Tạo token JWT với SECRET_CODE từ biến môi trường
    const token = generateJwt({
      _id: user._id,
      role: user.role,
      email: user.email
  })
  resClientData(res, 200, { token }, "Login successfully");
  } catch (error) {
    return resClientData(res, 500, null, 'Error logging in');
  }
};
export const UserInfo = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new Error('Unauthorized');

    const getToken = token.split(' ')[1];
    const verify = decodeToken(getToken);
    if (!verify) throw new Error('Verification failed!');
    const { userId } = verify;
    console.log(userId)
    // Tìm thông tin người dùng dựa trên userId
    const userInfo = await UserBasicInfoModel.findOne({ authId: verify._id }).populate('authId', '-password');
    if (!userInfo) throw new Error('User profile not found');

    // Trả về thông tin hồ sơ của người dùng (không bao gồm mật khẩu)
    return resClientData(res, 200, userInfo);
  } catch (error) {
    return resClientData(res, 403, null, error.message);
  }
};
export const UserInfoUpdate = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new Error('Unauthorized');

    const getToken = token.split(' ')[1];
    const verify = decodeToken(getToken);
    if (!verify) throw new Error('Verification failed!');
    const { _id } = verify;
    const {
      firstname,
      surname,
      dateOfBirth,
      phoneNumber,
      gender,
      username,
      email
    } = req.body;

    // Kiểm tra xem người dùng tồn tại trong cơ sở dữ liệu không
    const user = await UserBasicInfoModel.findOne({ authId: _id });
    if (!user) throw new Error('User not found');

    // Kiểm tra xem người dùng có quyền cập nhật thông tin này không
    // Ở đây bạn có thể thực hiện các kiểm tra phù hợp với yêu cầu của dự án
    // Ví dụ: Kiểm tra xem người dùng chỉ có thể cập nhật thông tin của chính họ

    // Tiến hành cập nhật thông tin người dùng
    user.firstname = firstname;
    user.surname = surname;
    user.dateOfBirth = new Date(dateOfBirth);
    user.phoneNumber = phoneNumber;
    user.gender = gender;
    user.username = username;

    // Lưu thông tin người dùng đã cập nhật vào cơ sở dữ liệu
    const updatedUser = await user.save();
    return resClientData(res, 200, updatedUser);
  } catch (error) {
    return resClientData(res, 403, null, error.message);
  }
};
export const UserInfoUpdatePassword = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new Error('Unauthorized');

    const getToken = token.split(' ')[1];
    const verify = decodeToken(getToken);
    if (!verify) throw new Error('Verification failed!');
    const { _id } = verify;
   
    const {
      oldPassword,
      newPassword,
      confirmPassword
    } = req.body;

    // Kiểm tra xem người dùng tồn tại trong cơ sở dữ liệu không
    const user = await UserAuthInfoModel.findOne({ _id: _id });
    if (!user) throw new Error('User not found');
    const isPasswordCorrect = comparePassword(oldPassword, user.salt, user.password);
    if (!isPasswordCorrect) {
      return resClientData(res, 400, null, 'Mật khẩu hiện tại không chính xác.Vui lòng thử lại');
    }
    if (newPassword !== confirmPassword) {
      return resClientData(res, 400, null, 'Mật khẩu mới và xác nhận mật khẩu không khớp');
    }

    // Nếu mật khẩu mới khớp, tiến hành cập nhật mật khẩu
    // Đầu tiên, tạo mới salt và hash mật khẩu mới
    const { hashedPassword, salt } = hashingPassword(newPassword); // Hàm hash mật khẩu mới, bạn cần triển khai nó

    // Cập nhật thông tin người dùng trong cơ sở dữ liệu với mật khẩu mới và salt
    user.password = hashedPassword;
    user.salt = salt;
    await user.save();

    return resClientData(res, 200, {  }, 'Mật khẩu đã được cập nhật thành công!');
  } catch (error) {
    return resClientData(res, 500, null, error.message);
  }
};
export const UserInfoUpdateAvt = async (req, res) => {
  try {
    // Sử dụng middleware upload để xử lý việc nhận và lưu trữ tập tin ảnh
    upload(req, res, async function (err) {
      if (err) {
        return resClientData(res, 500, null, err.message);
      }

      // Nếu upload thành công, thông tin ảnh sẽ được lưu trong req.file
      const file = req.file;

      if (!file) {
        return resClientData(res, 400, null, "No file uploaded");
      }

      // Lấy URL của ảnh trên Cloudinary sau khi upload thành công
      const imageUrl = file.path;
      const token = req.headers.authorization;
      if (!token) throw new Error('Unauthorized');
  
      const getToken = token.split(' ')[1];
      const verify = decodeToken(getToken);
      if (!verify) throw new Error('Verification failed!');
      const { _id } = verify;
      const user = await UserBasicInfoModel.findOne({ authId: _id });
      user.avatarUrl=imageUrl
      await user.save()
      return resClientData(res, 200,user, "Avatar uploaded successfully!");
    });
  } catch (error) {
    return resClientData(res, 500, null, error.message);
  }
};
