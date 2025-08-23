
import userModel from "../models/userModel.js";
import { uploadFiles } from "../utils/uploadFile.js";
import hospitalModel from '../models/hospitalModel.js';
import bcrypt from "bcrypt"

export const AddHospital = async (req, res, next) => {
  try {
    const { email, password, name, phoneNumber, role, isActive, address, pincode } = req.body;

    if (!email || !password || !name || !phoneNumber || !role || !isActive) {
      return next(new Error("All the details are needed"));
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await userModel.create({
      email,
      password:hashedPassword,
      name,
      phoneNumber,
      role,
      isActive,
    });

    if (req.files && req.files[0]?.path) {
      const imageData = await uploadFiles(req.files[0].path, "image", "hospitals");
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

