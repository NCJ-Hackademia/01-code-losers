import Otp from "../models/Otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import { SendOtp } from "../utils/Sendotp.js";

const AuthLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Error("parameters missing"))
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      next(new Error("User Not Found"));
    } else {
      
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const accessToken = jwt.sign(
          { id: user._id, role: user.role },
          process.env.KEY,
          {
            expiresIn: "7d",
          }
        );

        return res.status(200).json(accessToken);
      } else {
        return res.status(401).json({ message: "Password incorrect" });
      }
    }
  } catch (error) {
    next(error);
  }
};

const AuthRegister = async (req, res, next) => {
  try {
    const { password, name,email, phoneNumber, otp } = req.body;

    if (!name || !phoneNumber || !password || !otp || !email) {
      return next(new Error("parameters are missing"));
    }


    const otpRecord = await Otp.findOne({ email });
    console.log(otpRecord.otp)
    console.log(otp)
    if (!otpRecord) {
      return next(new Error("invalid otp"));
    } else {
      console.log(otp)
      console.log(otpRecord)
      const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
      if (!isOtpValid) {
        next(new Error("invalid OTP"));
      } else {
        await Otp.deleteOne({ email });

        const user = await userModel.findOne({ email });
        if (user) {
          return next(new Error("user already exist"));
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const result = await userModel.create({
          email: req.body.email,
          password: hashpassword,
          name,
          phoneNumber,
        });
        res.json(result);
      }
    }
  } catch (err) {
    next(err);
  }
};

const sendRegisterotp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is  missing" });
    }

    const user= await userModel.findOne({email})
    if(user){
      return next(new Error("user already found"))
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.findOneAndUpdate(
      { email },
      { $set: { otp: hashedOtp, createdAt: Date.now() } },
      { upsert: true, new: true }
    );

    const sent = await SendOtp(email,otp);

    if (sent) {
      return res.status(200).json({ message: "OTP sent successfully" });
    } else {
      return res.status(400).json({ message: "Unable to send the OTP" });
    }
  } catch (err) {
    next(err);
  }
};



const forgetPasswordOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json("no phone number provided");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json("user not found");
    }

    const generateOtp = () =>
      Math.floor(100000 + Math.random() * 900000).toString();

    const otp = generateOtp();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.findOneAndUpdate(
      { email },
      { $set: { otp: hashedOtp, createdAt: Date.now() } },
      { upsert: true, new: true }
    );

    const sent = await SendOtp(email,otp);

    if (sent) {
      return res.status(200).json({ message: "OTP sent successfully" });
    } else {
      return res.status(400).json({ message: "Unable to send the OTP" });
    }
  } catch (err) {
    next(err);
  }
};

const passChange = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
      return res.status(400).json("parameters are missing");
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    } else {
      const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
      if (!isOtpValid) {
        next(new Error("invalid OTP"));
      } else {
        await Otp.deleteOne({ email });

        const hashpassword = await bcrypt.hash(password, 10);
        const result = await userModel.updateOne(
          { email }, 
          { $set: { password: hashpassword } }, 
          { new: true } 
        );
        res.status(200).json("password updated successfully");
      }
    }
  } catch (err) {
    next(err);
  }
};

export {
  AuthLogin,
  AuthRegister,
  sendRegisterotp,
  passChange,
  forgetPasswordOtp,
};