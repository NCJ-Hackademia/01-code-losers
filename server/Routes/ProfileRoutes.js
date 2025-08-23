import express from "express"
import { GetUserById, UpdateById } from "../Controllers/ProfileCrudControllers.js";
const ProfileRoutes=express.Router();
ProfileRoutes.get('/get-user',GetUserById);
ProfileRoutes.post('/update-user',UpdateById);
export default ProfileRoutes;