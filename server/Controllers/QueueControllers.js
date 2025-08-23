import queueModel from "../models/queuemodel";
import queUserModel from "../models/queuserModel";
import medicalrecordsModel from "../models/medicalrecordsModel.js"


const AddInQueue = async (req,res,next)=>{

try{

const {user_id,date,doctor_id} = req.body;
const parsed_date = parseDateString(date);
let queue = await queueModel.findOne({date:parsed_date,doctor_id});

if(!queue){
   queue = await queueModel.create({date:parsed_date,doctor_id,end_time:parsed_date})
}

}
catch(err){
    next(err)
}


}

export const TreatedByDoctor=async(req,res,next)=>
{
    try {
        const id=user.id;
        const {patient_id,description,medicine,disease}=req.body;

        if(!patient_id)
        {
            return res.status(400).send({success:false,message:"Provide patient id"});
        }
        const user=await queUserModel.findById(patient_id);
        await queUserModel.findByIdAndDelete(patient_id);
        const medicalRecord=await medicalrecordsModel.create({
            ...user,
            description,
            user_id:patient_id,
            doctor_id:id

        })

        return res.status(200).json({success:true,message:"Medical REcord added successfully",MedicalREcord:medicalRecord})
        
        
    } catch (error) {
        next(error);
    }
}
