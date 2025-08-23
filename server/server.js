import  express from "express"
import dotenv from 'dotenv';
dotenv.config();

const app=express();

app.get('/',(req,res)=>
{
    res.send(`server is working good`);
})

app.listen(process.env.PORT,()=>
{
    console.log(`http://localhost:${process.env.PORT}`);
})