// UserAuthInfoSchema.js
import mongoose from "mongoose";
import CombineCollection from "../database/index.js";

const UserAuthInfoSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  role: { type: String, default: "MEMBER", required: true },
});

const UserAuthInfoModel = mongoose.model(
  CombineCollection.USERAUTHINFO,
  UserAuthInfoSchema
);
export default UserAuthInfoModel;
