import express from "express"
import { AcceptWaitingPatient, TreatedByDoctor } from "../Controllers/QueueControllers.js";
import { AddInQueue, GetAppointments, MoveToWaitingQueue, RejectAppointment } from "../Controllers/QueueControllers.js";
import { authenticate } from "../middlewares/authenticate.js";



const queueRoutes=express.Router();

queueRoutes.post('/add-in-queue',authenticate,AddInQueue);
queueRoutes.get('/get-queue',authenticate,GetAppointments);
queueRoutes.post('/add-wt-queue',MoveToWaitingQueue)
queueRoutes.post('/reject',RejectAppointment)
queueRoutes.post('/add-medical-record',authenticate,TreatedByDoctor);
queueRoutes.post('/accept-wt-patient',authenticate,AcceptWaitingPatient);


export default queueRoutes;