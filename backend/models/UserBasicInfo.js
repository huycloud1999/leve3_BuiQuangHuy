// UserBasicInfoSchema.js
import mongoose from "mongoose";
import CombineCollection from "../database/index.js";

const UserBasicInfoSchema = new mongoose.Schema({
  firstname: { type: String, default:null },
  surname: { type: String, default:null },
  username: { type: String, required: true},
  dateOfBirth: { type: Date },
  phoneNumber: { type: String,default:null },
  gender: { type: String },
  authId: { type: mongoose.Schema.Types.ObjectId, ref: CombineCollection.USERAUTHINFO, unique:true },
  avatarUrl:{type:String,default:"https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2023/02/hinh-avatar-anh-dai-dien-FB-mac-dinh.jpg?ssl\u003d1"}
});

const UserBasicInfoModel = mongoose.model(
  CombineCollection.USERBASICINFO,
  UserBasicInfoSchema
);
export default UserBasicInfoModel;
