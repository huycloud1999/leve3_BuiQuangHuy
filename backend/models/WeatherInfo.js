import mongoose from "mongoose";
import CombineCollection from "../database/index.js";
const WeatherInfoSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    weather_desc: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    humidityQuality: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true,
    },
    windSpeed: {
      type: Number,
      required: true,
    },
    windSpeedQuality: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true,
    },
    visibility: {
      type: Number,
      required: true,
    },
    visibilityQuality: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true,
    },
    air: {
      type: Number,
      required: true,
    },
    airQuality: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true,
    },
    uvIndex: {
      type: Number,
      required: true,
    },
    uvIndexQuality: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true,
    },
    rateRainy: {
      type: Number,
      required: true,
    },
    rateRainyQuality: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CombineCollection.LOCATION,
    },
  },
  {
    timestamps: true,
  }
);
const WeatherInfoSchemaModel = mongoose.model(
  CombineCollection.WEATHER_DATA,
  WeatherInfoSchema
);
export default WeatherInfoSchemaModel;
