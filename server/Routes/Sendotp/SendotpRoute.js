import express from "express";
import { SendOtp } from "../../Controllers/SendOtp/Sendotp.js";


const SendOtpRoute=express.Router();
SendOtpRoute.post('/send-otp',SendOtp);
export default SendOtpRoute;