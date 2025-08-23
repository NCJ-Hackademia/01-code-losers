import doctorModel from "../models/doctorsmodel.js";
import hospitalModel from "../models/hospitalModel.js";
import userModel from "../models/userModel.js";
export const GetUserById = async (req, res, next) => {
  try {
   
    const id = req.user._id;
    const role = req.user.role;
    const user = await userModel.findById(id).lean();
    if (!user) {
      return next(new Error("No user found"));
    }
    delete user.password;

    let extraDetails = null;

    if (role === "doctor") {
      extraDetails = await doctorModel.findOne({ user_id: id })
    } else if (role === "hospital") {
        
      extraDetails = await hospitalModel.findOne({ user_id: id }).lean();
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
      extraDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateById=async(req,res,next)=>
{
    try {
        const id=req.user_id;
        const role=req.user.role;
        const {name,phoneNumber}=req.body;
        const user=await userModel.findByIdAndUpdate({_id:id},{name,phoneNumber});



        return res.status(200).json({success:true,message:"Updated successfully",user})
        
    } catch (error) {
        next(error);
    }
}
