import express from 'express'
import { AddDoctor, getDoctors, UpdateDoctor } from '../Controllers/HospitalControllers.js';

const HospitalRoutes=express.Router();
HospitalRoutes.post('/add-doctor',AddDoctor);
HospitalRoutes.put('/update-doctor',UpdateDoctor);
HospitalRoutes.get('/get-doctors',getDoctors)

export default HospitalRoutes;