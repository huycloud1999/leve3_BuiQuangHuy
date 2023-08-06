import express from "express";
import mongoose from "mongoose";
import dotEnv from "dotenv";
import CombineRouter from "./routers/index.js";
dotEnv.config();
import cors from "cors";
const { DB_URL, PORT ,CLOUD_NAME,API_KEY,API_SECRET} = process.env;
const app = express();
app.use(cors())

mongoose.connect(`${DB_URL}`).then(() => {
  console.log("Database connection established!");
});
app.use(express.json());

app.use('/api/v1',CombineRouter)
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
