import express from "express"
import { TreatedByDoctor } from "../Controllers/QueueControllers.js";
import { AddInQueue, GetAppointments, MoveToWaitingQueue, RejectAppointment } from "../Controllers/QueueControllers.js";
import { authenticate } from "../middlewares/authenticate.js";



const queueRoutes=express.Router();

queueRoutes.post('/add-in-queue',authenticate,AddInQueue);
queueRoutes.get('/get-queue',GetAppointments);
queueRoutes.post('/add-wt-queue',MoveToWaitingQueue)
queueRoutes.post('/reject',RejectAppointment)
queueRoutes.post('/add-medical-record',TreatedByDoctor);


export default queueRoutes;