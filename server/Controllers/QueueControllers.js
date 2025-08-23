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



export const TreatedByDoctor = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { patient_id, description, medicine, disease, files } = req.body;

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: "Provide patient id",
      });
    }

  
    const patient = await queUserModel.findById(patient_id).populate("user_id");
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found in queue",
      });
    }


    const medicalRecord = await medicalrecordsModel.create({
      user_id: patient.user_id._id, 
      doctor_id: doctorId,
      description,
      medicine,
      disease,
      files: files || [],
    });

   
    await queUserModel.findByIdAndDelete(patient_id);

    return res.status(200).json({
      success: true,
      message: "Medical record added successfully",
      medicalRecord,
    });
  } catch (error) {
    next(error);
  }
};
 