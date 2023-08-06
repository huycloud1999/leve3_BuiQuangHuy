import * as yup from "yup";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();
const { SECRET_CODE } = process.env;

const validateMiddleWare = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      return next();
    } catch (error) {
      res.status(500).send({
        data: null,
        success: false,
        message: `Error:${error.name} - ${error.message}`,
      });
    }
  };
};

const resClientData = (res, statusCode, data, message) => {
  res.status(statusCode).send({
    data: data ? data : null,
    message: message ? message : data ? "Complete" : "Failed",
    success: data ? true : false,
  });
};

const hashingPassword = (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return {
    hashedPassword,
    salt,
  };
};

const comparePassword = (password, salt, hashedPassword) => {
  const hashingPasswordReq = bcrypt.hashSync(password, salt);
  return hashedPassword === hashingPasswordReq;
};

const generateJwt = (data) => {
  const token = jwt.sign(data, SECRET_CODE, {
    expiresIn: "1d",
  });
  return token;
};

const decodeToken = (token) => {
  const verifyToken = jwt.verify(token, SECRET_CODE);
  return verifyToken;
};

export {SECRET_CODE,
  resClientData,
  hashingPassword,
  comparePassword,
  generateJwt,
  decodeToken,
  validateMiddleWare,
};
