import queueModel from "../models/queuemodel";



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