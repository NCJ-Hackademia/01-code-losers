import express from 'express';
import {AuthRegister,AuthLogin, sendRegisterotp, forgetPasswordOtp, passChange} from "../Controllers/AuthController.js";

const AuthRouter = express.Router();

AuthRouter.post('/login',AuthLogin);
AuthRouter.post('/register',AuthRegister);
AuthRouter.post('/send-otp',sendRegisterotp);
AuthRouter.post('/forget',forgetPasswordOtp);
AuthRouter.post('/passchange',passChange);

export default AuthRouter;