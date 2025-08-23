
import userModel from "../models/userModel.js";
import { uploadFiles } from "../utils/uploadFile.js";
import hospitalModel from '../models/hospitalModel.js';

export const AddHospital = async (req, res, next) => {
  try {
    const { email, password, name, phoneNumber, role, isActive, address, pincode } = req.body;

    if (!email || !password || !name || !phoneNumber || !role || !isActive) {
      return next(new Error("All the details are needed"));
    }

    
    const user = await userModel.create({
      email,
      password,
      name,
      phoneNumber,
      role,
      isActive,
    });

    if (req.file?.path) {
      const imageData = await uploadFiles(req.file.path, "image", "hospitals");
      user.img = imageData.secure_url;
      await user.save();
    }


    await hospitalModel.create({
      user_id: user._id,
      address,
      pincode,
    });

    return res.status(200).json({ success: true, message: "Added successfully" });

  } catch (error) {
    next(error);
  }
};

export const DeactiveHospital=async(req,res,next)=>
{
    try {
        const {objectId}=req.body;
        if(!objectId)
        {
            return res.json({success:"False",message:"Object id needed"});
        }

        await userModel.findByIdAndUpdate({_id:objectId},{
            isActive:false
        })
        return res.status(200).json({success:true,message:"updated successfully "})
    } catch (error) {
        next(error);
    }
}

