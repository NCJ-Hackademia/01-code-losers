import express from "express";
import { CallGemini } from "../../utils/callGemini.js";
const CallGeminiRouter=express.Router();
CallGeminiRouter.post('/run',CallGemini);

export default CallGeminiRouter;