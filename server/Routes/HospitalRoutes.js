import express from 'express'
import { AddDoctor, getDoctors, getQueuedetails, UpdateDoctor } from '../Controllers/HospitalControllers.js';
import {authenticate} from "../middlewares/authenticate.js"
const HospitalRoutes=express.Router();
HospitalRoutes.post('/add-doctor',authenticate,AddDoctor);
HospitalRoutes.put('/update-doctor',UpdateDoctor);
HospitalRoutes.get('/get-doctors',getDoctors)
HospitalRoutes.get('/get-queue-details',getQueuedetails)

export default HospitalRoutes; 