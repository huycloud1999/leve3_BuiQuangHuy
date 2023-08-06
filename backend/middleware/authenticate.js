import jwt from 'jsonwebtoken';
import UserBasicInfoModel from '../models/UserBasicInfo.js';
const { SECRET_CODE } = process.env;
const authenticate = async (req, res, next) => {
  try {
    // Lấy token từ header của yêu cầu
    const token = req.header('Authorization').replace('Bearer ', '');

    // Xác thực token
    const decodedToken = decodeToken(token.replace('Bearer ', ''),SECRET_CODE);
    req.user = decodedToken;
    // Tìm người dùng trong cơ sở dữ liệu dựa vào id từ token
    const user = await UserBasicInfoModel.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).send({
        data: null,
        success: false,
        message: 'Unauthorized',
      });
    }

    // Lưu thông tin người dùng vào yêu cầu để sử dụng trong controller
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({
      data: null,
      success: false,
      message: 'Unauthorized',
    });
  }
};

export default authenticate;
