import express from "express"
import { GetUserById } from "../Controllers/ProfileCrudControllers.js";
const ProfileRoutes=express.Router();
ProfileRoutes.get('/get-user',GetUserById);
export default ProfileRoutes;