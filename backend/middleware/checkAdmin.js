import {   resClientData,
    hashingPassword,
    comparePassword,generateJwt,decodeToken} from "../utils/index.js";
const checkAdmin = (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const getToken = token.split(' ')[1];
      const verify = decodeToken(getToken);
      if (!verify) {
        return res.status(401).json({ message: 'Verification failed!' });
      }
  
      if (verify.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Bạn không có quyền hạn' });
      }
  
      // Nếu mọi điều kiện kiểm tra đều vượt qua, tiếp tục middleware tiếp theo
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình xử lý' });
    }
  };
  
  export default checkAdmin;
  