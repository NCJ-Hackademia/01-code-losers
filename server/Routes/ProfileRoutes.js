import express from "express"
import { GetUserById } from "../Controllers/ProfileCrudControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
const ProfileRoutes=express.Router();
ProfileRoutes.get('/get-user',authenticate,GetUserById);
export default ProfileRoutes;