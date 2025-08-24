import express from 'express'
import { AddDoctor, getDoctorById, getDoctors, getQueuedetails, UpdateDoctor } from '../Controllers/HospitalControllers.js';
import {authenticate} from "../middlewares/authenticate.js"
import { getQueueStartTime } from '../utils/parsedate.js';
const HospitalRoutes=express.Router();
HospitalRoutes.post('/add-doctor',authenticate,AddDoctor);
HospitalRoutes.put('/update-doctor',UpdateDoctor);
HospitalRoutes.get('/get-doctors',getDoctors)
HospitalRoutes.post('/get-by-id',getDoctorById);
HospitalRoutes.get("/get-doctor-details",getQueuedetails)

export default HospitalRoutes; 