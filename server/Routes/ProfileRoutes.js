import express from "express"
import { GetUserById, UpdateById } from "../Controllers/ProfileCrudControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
const ProfileRoutes=express.Router();
ProfileRoutes.get('/get-user',authenticate,GetUserById);
ProfileRoutes.put('/update-user',authenticate,UpdateById);
export default ProfileRoutes;