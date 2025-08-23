import express from "express";
import { AddHospital, DeactiveHospital } from "../Controllers/AdminControllers.js";

const AdminRoutes=express.Router();

AdminRoutes.post('/add-hospital',AddHospital);
AdminRoutes.put('/deactivate-hospital',DeactiveHospital);
export default AdminRoutes;