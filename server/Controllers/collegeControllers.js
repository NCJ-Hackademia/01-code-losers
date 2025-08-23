import doctorModel from "../models/doctorsmodel.js";
import userModel from "../models/userModel.js";
import { uploadFiles } from "../utils/uploadFile.js";

export const AddDoctor = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      description,
      phoneNumber,
      role,
      isActive,
      hospital_id,
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
      !hospital_id ||
      !specilization ||
      !pincode ||
      !rating ||
      !experience ||
      !usersPerDay||
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

 
    const user = await userModel.create({
      email,
      password,
      name,
      phoneNumber,
      role,
      isActive,
    });

    // Upload doctor image if provided
    if (req.file?.path) {
      const imageData = await uploadFiles(req.file.path, "image", "doctors");
      user.img = imageData.secure_url;
      await user.save();
    }

    // Create doctor record
    const doctor = await doctorModel.create({
      hospital_id,
      user_id: user._id,
      specilization,
      pincode: pincodeNumber,
      rating: ratingNumber,
      experience: experienceNumber,
      usersPerDay: usersPerDayNumber,
      description
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

 
    if (req.file?.path) {
      const imageData = await uploadFiles(req.file.path, "image", "doctors");
      user.img = imageData.secure_url;
    }

    await user.save();

    const updates = {};
    if (specilization) updates.specilization = specilization;
    if (description) updates.description = description;
    if (hospital_id) updates.hospital_id = hospital_id;
    if (pincode) {
      const pincodeNumber = parseInt(pincode, 10);
      if (isNaN(pincodeNumber)) return next(new Error("Pincode must be a valid number"));
      updates.pincode = pincodeNumber;
    }
    if (rating) {
      const ratingNumber = parseFloat(rating);
      if (isNaN(ratingNumber)) return next(new Error("Rating must be a valid number"));
      updates.rating = ratingNumber;
    }
    if (experience) {
      const experienceNumber = parseInt(experience, 10);
      if (isNaN(experienceNumber)) return next(new Error("Experience must be a valid number"));
      updates.experience = experienceNumber;
    }
    if (usersPerDay) {
      const usersPerDayNumber = parseInt(usersPerDay, 10);
      if (isNaN(usersPerDayNumber)) return next(new Error("Users per day must be a valid number"));
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