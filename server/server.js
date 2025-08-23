import  express from "express"
import dotenv from 'dotenv';
dotenv.config();
import connectDb from "./config/mongodb.js"
import SendOtpRoute from "./Routes/Sendotp/SendotpRoute.js";
connectDb();
const app=express();
app.use(express.json());  
app.get('/',(req,res)=>
{
    res.send(`server is working good`);
})
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
app.use('/auth',SendOtpRoute)
app.listen(process.env.PORT,()=>
{
    console.log(`http://localhost:${process.env.PORT}`);
})