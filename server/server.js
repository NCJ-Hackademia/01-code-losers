import  express from "express"
import dotenv from 'dotenv';
import upload from "./config/multer.js";
dotenv.config();
import connectDb from "./config/mongodb.js"
import AuthRouter from "./Routes/AuthRouter.js";

connectDb();
const app=express();
app.use(express.json());  
app.get('/',(req,res)=>
{
    res.send(`server is working good`);
})


app.use('/auth',AuthRouter);



app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.use('/auth',AuthRouter);

app.listen(process.env.PORT,()=>
{
    console.log(`http://localhost:${process.env.PORT}`);
})