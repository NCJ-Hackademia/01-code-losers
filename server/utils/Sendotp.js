import transporter from "../config/nodemailer.js";

export const SendOtp = async (email, otp) => {
  try {
    if (!email || !otp) {
      return false;
    }

    const mailOptions = {
      from: "pharmacyrgukt@gmail.com",
      to: email,
      subject: "Your OTP",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };
    console.log(email);
    const result = await transporter.sendMail(mailOptions);
    console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
