import  express from "express"
import dotenv from 'dotenv';
import upload from "./config/multer.js";
dotenv.config();
import connectDb from "./config/mongodb.js"
import AdminRoutes from "./Routes/AdminRoutes.js";
import HospitalRoutes from "./Routes/HospitalRoutes.js";
// import AuthRouter from "./Routes/AuthRouter.js";
import "./config/cloudinary.js"


import AuthRouter from "./Routes/AuthRouter.js";
import cors from 'cors'
import ProfileRoutes from "./Routes/ProfileRoutes.js";

const app=express();
app.use(express.json());  
app.use(cors());
app.use(upload.array('img'));

app.get('/',(req,res)=>
{
    res.send(`server is working good`);
})


app.use('/auth',AuthRouter);
app.use('/admin',AdminRoutes);
app.use('/hospital',HospitalRoutes);
app.use('/profile',ProfileRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});



app.listen(process.env.PORT,()=>
{
    console.log(`http://localhost:${process.env.PORT}`);
})