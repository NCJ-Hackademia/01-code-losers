import express from "express"
import { TreatedByDoctor } from "../Controllers/QueueControllers";
import { AddInQueue, GetAppointments, MoveToWaitingQueue, RejectAppointment } from "../Controllers/QueueControllers";



const queueRoutes=express.Router();

queueRoutes.post('/add-in-queue',AddInQueue);
queueRoutes.get('/get-queue',getOriginalQueue);
queueRoutes.post('/add-wt-queue',addWtQueue)
queueRoutes.post('/reject',rejectAppointment)
queueRoutes.post('/accept',acceptAppointment)
queueRoutes.post('/add-medical-record',TreatedByDoctor);

// queueRoutes.post('/accept',acceptAppointment)

export default queueRoutes;