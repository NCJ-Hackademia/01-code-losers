import mongoose from "mongoose";

const DoctorScheme = new mongoose.Schema({
  hospital_id: { type: String,ref:"hospital"},
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, 
  specilization: { type: String, required: true },
  pincode: { type: Number, required: true },
  rating:{type:Number,required:true,default:3.5},
  experience:{type:Number,required:true,default:2},
  usersPerDay:{type:Number,required:true,default:50},
  description:{type:String,required:true}
});

const doctorModel = mongoose.model("doctors", DoctorScheme);

export default doctorModel; 