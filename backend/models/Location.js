import mongoose from "mongoose";
import CombineCollection from "../database/index.js";

const LocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique:true
    },
  },
  {
    timestamps: true,
  }
);
const LocationSchemaModel = mongoose.model(
  CombineCollection.LOCATION,
  LocationSchema
);
export default LocationSchemaModel;
