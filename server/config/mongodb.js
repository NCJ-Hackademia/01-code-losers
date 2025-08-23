import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
 const connectDb =async()=>
{       try {
               await mongoose.connect(process.env.MONGOURL)
               console.log("DataBase Connected Successfully");
        } catch (error) {
            console.log(error)
        }
}
export default connectDb;
