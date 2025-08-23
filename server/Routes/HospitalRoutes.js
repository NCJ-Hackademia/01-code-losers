import express from 'express'
import { AddDoctor, UpdateDoctor } from '../Controllers/HospitalControllers.js';

const HospitalRoutes=express.Router();
HospitalRoutes.post('/add-doctor',AddDoctor);
HospitalRoutes.put('/update-doctor',UpdateDoctor);

export default HospitalRoutes;