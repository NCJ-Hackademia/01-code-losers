
import nodemailer from 'nodemailer'
import dotenv from "dotenv"
dotenv.config();
 const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'pharmacyrgukt@gmail.com',
            pass: process.env.EMAIL_APPCODE
          }
        });

export default transporter;