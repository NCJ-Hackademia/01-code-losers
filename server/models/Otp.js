import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true }, // store as string
  otp: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    index: { expires: 600 } // 600s = 10 minutes
  },
});

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;