import doctorModel from "../models/doctorsmodel.js";
import userModel from "../models/userModel.js";
import { uploadFiles } from "../utils/uploadFile.js";
import bcrypt from 'bcrypt'

export const AddDoctor = async (req, res, next) => {
  try {

    const id=req.user.id;
    
    const {
      email, 
      password,
      name,
      description,
      phoneNumber,
      role,
      isActive,
     
      specilization,
      pincode,
      rating,
      experience,
      usersPerDay,
    } = req.body;

    if (
      !email ||
      !password ||
      !name ||
      !phoneNumber ||
      !role ||
      isActive === undefined ||
      
      !specilization ||
      !pincode ||
      !rating ||
      !experience ||
      !usersPerDay ||
      !description
    ) {
      return next(new Error("All the details are needed"));
    }
    

    const pincodeNumber = parseInt(pincode, 10);
    const ratingNumber = parseFloat(rating);
    const experienceNumber = parseInt(experience, 10);
    const usersPerDayNumber = parseInt(usersPerDay, 10);

    if (
      isNaN(pincodeNumber) ||
      isNaN(ratingNumber) ||
      isNaN(experienceNumber) ||
      isNaN(usersPerDayNumber)
    ) {
      return next(new Error("Numeric fields must be valid numbers"));
    }
        const hashpassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      email,
      password:hashpassword,
      name,
      phoneNumber,
      role,
      isActive,
    });

    if (req.files && req.files[0]?.path) {
      const imageData = await uploadFiles(req.files[0].path, "image", "doctors");
      user.img = imageData.secure_url;
      await user.save();
    }

    const doctor = await doctorModel.create({
      hospital_id:id,
      user_id: user._id,
      specilization:specilization.toLowerCase(),
      pincode: pincodeNumber,
      rating: ratingNumber,
      experience: experienceNumber,
      usersPerDay: usersPerDayNumber,
      description,
    });
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: "Doctor added successfully",
      userObj,
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateDoctor = async (req, res, next) => {
  try {
    const {
      email,
      name,
      description,
      phoneNumber,
      role,
      hospital_id,
      specilization,
      pincode,
      rating,
      experience,
      usersPerDay,
    } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return next(new Error("User not found"));

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (role) user.role = role;

    if (req.files && req.files[0]?.path) {
      const imageData = await uploadFiles(req.files[0].path, "image", "doctors");
      user.img = imageData.secure_url;
    }

    await user.save();

    const updates = {};
    if (specilization) updates.specilization = specilization.toLowerCase();
    if (description) updates.description = description;
    if (hospital_id) updates.hospital_id = hospital_id;
    if (pincode) {
      const pincodeNumber = parseInt(pincode, 10);
      if (isNaN(pincodeNumber))
        return next(new Error("Pincode must be a valid number"));
      updates.pincode = pincodeNumber;
    }
    if (rating) {
      const ratingNumber = parseFloat(rating);
      if (isNaN(ratingNumber))
        return next(new Error("Rating must be a valid number"));
      updates.rating = ratingNumber;
    }
    if (experience) {
      const experienceNumber = parseInt(experience, 10);
      if (isNaN(experienceNumber))
        return next(new Error("Experience must be a valid number"));
      updates.experience = experienceNumber;
    }
    if (usersPerDay) {
      const usersPerDayNumber = parseInt(usersPerDay, 10);
      if (isNaN(usersPerDayNumber))
        return next(new Error("Users per day must be a valid number"));
      updates.usersPerDay = usersPerDayNumber;
    }

    const doctor = await doctorModel.findOneAndUpdate(
      { user_id: user._id },
      updates,
      { new: true }
    );

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      user: userObj,
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctors = async (req, res) => {
  try {
    const { name, specialization, pincode } = req.query;

    const doctorFilters = {};
    if (specialization) {
      doctorFilters.specilization = { $regex: `^${specialization.toLowerCase()}$` }; 
    }
    if (pincode) doctorFilters.pincode = Number(pincode);

    const pipeline = [
      {
        $match: doctorFilters, 
      },
      {
        $lookup: {
          from: "users", 
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ];

    if (name) {
      pipeline.push({
        $match: {
          "user.name": { $regex: name, $options: "i" },
        },
      });
    }

    const doctors = await doctorModel.aggregate(pipeline);

    return res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
