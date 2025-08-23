import express from "express"
import { AddInQueue, GetAppointments, MoveToWaitingQueue, RejectAppointment } from "../Controllers/QueueControllers";



const queueRoutes=express.Router();

queueRoutes.post('/add-in-queue',AddInQueue);
queueRoutes.get('/get-queue',GetAppointments);
queueRoutes.post('/add-wt-queue',MoveToWaitingQueue)
queueRoutes.post('/reject',RejectAppointment)
// queueRoutes.post('/accept',acceptAppointment)

export default queueRoutes;