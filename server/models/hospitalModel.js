import mongoose from "mongoose";

const hospitalScheme = new mongoose.Schema({
  user_id: { type: String,ref:"Users"},
  address: { type: String, required: true },
  pincode: { type: String, required: true },
});

const hospitalModel = mongoose.model("hospital", hospitalScheme);

export default hospitalModel; 