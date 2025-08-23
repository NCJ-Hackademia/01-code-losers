import express from "express"



const queueRoutes=express.Router();

queueRoutes.post('/add-in-queue',AddInQueue);
queueRoutes.get('/get-queue',getOriginalQueue);
queueRoutes.post('/add-wt-queue',addWtQueue)
queueRoutes.post('/reject',rejectAppointment)
queueRoutes.post('/accept',acceptAppointment)

export default queueRoutes;