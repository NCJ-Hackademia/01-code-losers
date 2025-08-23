import Otp from "../models/Otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/UsersModel.js";
import { SendOtp } from "../utils/sendotp.js";

const AuthLogin = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json("parametres are missing");
    }

    const user = await userModel.findOne({ phoneNumber });

    if (!user) {
      next(new Error("User Not Found"));
    } else {
      console.log(password);
      console.log(user);
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
        await Otp.deleteOne({ phoneNumber });

        const user = await userModel.findOne({ phoneNumber });
        if (user) {
          return res.status(400).json("user already found");
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
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number missing" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.findOneAndUpdate(
      { phoneNumber },
      { $set: { otp: hashedOtp, createdAt: Date.now() } },
      { upsert: true, new: true }
    );

    const message = `Your OTP is ${otp}. It will expire in 10 minutes. Do not share with anyone.`;
    const sent = await sendSms(message, "+91" + phoneNumber);

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
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json("no phone number provided");
    }
    const user = await userModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json("user not found");
    }

    const generateOtp = () =>
      Math.floor(100000 + Math.random() * 900000).toString();

    const otp = generateOtp();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.findOneAndUpdate(
      { phoneNumber },
      { $set: { otp: hashedOtp, createdAt: Date.now() } },
      { upsert: true, new: true }
    );

    const message = `Your OTP is ${otp}. It will expire in 10 minutes. Do not share with anyone.`;
    const sent = await sendSms(message, "+91" + phoneNumber);

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
    const { phoneNumber, password, otp } = req.body;

    if (!phoneNumber || !password || !otp) {
      return res.status(400).json("parameters are missing");
    }

    const otpRecord = await Otp.findOne({ phoneNumber });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    } else {
      const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
      if (!isOtpValid) {
        next(new Error("invalid OTP"));
      } else {
        await Otp.deleteOne({ phoneNumber });

        const hashpassword = await bcrypt.hash(password, 10);
        const result = await userModel.updateOne(
          { phoneNumber }, // filter
          { $set: { password: hashpassword } }, // update
          { new: true } // option (but note: 'new' has no effect on updateOne)
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