import transporter from "../config/nodemailer.js";

export const SendOtp = async (email) => {
  try {

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return otp;
  } catch (error) {
    next(error);
  }
};
