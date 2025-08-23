import run from "../config/Gemini.js";

export const CallGemini=async(req,res,next)=>
{
    try {

        const {symptoms}=req.body;
const prompt = `
You are a medical assistant. 
I will provide a list of symptoms. 
From these symptoms, identify:
1. The most likely disease.
2. The type of medical specialist the patient should consult.

Rules:
- If you are not confident about the specialist, return "general".
- The response MUST be ONLY an array of exactly two strings in this format:
["disease name", "specialist type"]

Symptoms: ${JSON.stringify(symptoms)}
`;

        const response=await run(prompt);
       const  parsed = JSON.parse(response);

        res.status(200).json(parsed);
    } catch (error) {
        next(error);
    }
}
