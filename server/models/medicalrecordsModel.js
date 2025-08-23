import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  user_id: { type: String,ref:"Users"},
  doctor_id: { type: String, ref:"doctors" },
  description: { type: String, required: true },
   medicine:{type:[String],required:true},
   disease:{type:String,required:true},
   files:{type:[String]}
}, {timestamps:true});

const  medicalrecords = mongoose.model("medical_records", medicalRecordSchema);

export default medicalrecords;