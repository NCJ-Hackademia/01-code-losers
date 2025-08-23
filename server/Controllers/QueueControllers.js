import queueModel from "../models/queuemodel";
import queUserModel from "../models/queuserModel";
import { parseDateString, addMinutes, getQueueStartTime } from "../utils/parsedate";

import doctorModel from "../models/doctorModel.js";

export const AddInQueue = async (req, res, next) => {
  try {
    const { date, doctor_id } = req.body;

    // Validate doctor
    const doctor = await doctorModel.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Consultation time in minutes (default 5 if not set per doctor)
    const consultationTime = doctor.consultationTime || 5;

    // Parse date ("dd-mm-yyyy") → local Date
    const parsedDate = parseDateString(date);

    // Find existing queue for doctor & date
    let queue = await queueModel.findOne({ doctor_id, date: parsedDate });

    let estimatedTime;

    if (!queue) {
      // No queue yet → create new one starting 9:00 AM
      const startTime = getQueueStartTime(date);

      queue = await queueModel.create({
        doctor_id,
        date: parsedDate,
        count: 1,
        end_time: addMinutes(startTime, consultationTime), // first ends at 9:05
      });

      estimatedTime = startTime; // first user starts at 9:00
    } else {
      // Queue exists → next slot is current end_time
      estimatedTime = queue.end_time;

      // Update queue for next user
      queue.count += 1;
      queue.end_time = addMinutes(queue.end_time, consultationTime);
      await queue.save();
    }

    // Create queue-user record
    const queUser = await queUserModel.create({
      queue_id: queue._id,
      user_id: req.user._id, // assuming auth middleware sets this
      estimated_time: estimatedTime,
      type: "original",
    });

    res.status(201).json({
      message: "User added to queue successfully",
      queue,
      queUser,
    });

  } catch (err) {
    console.error("Error in AddInQueue:", err);
    next(err);
  }
};



export const MoveToWaitingQueue = async (req, res, next) => {
  try {
    const { queUserId } = req.body;

    // Find queue-user
    const queUser = await queUserModel.findById(queUserId).populate("queue_id");
    if (!queUser) {
      return res.status(404).json({ message: "Queue user not found" });
    }

    const queue = queUser.queue_id;
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    
    if (queUser.type === "waiting") {
      return res.status(400).json({ message: "User is already in waiting queue" });
    }

    
    const newEstimatedTime = addMinutes(queUser.estimated_time, -5);


    queUser.type = "waiting";
    queUser.estimated_time = newEstimatedTime;
    await queUser.save();

    res.status(200).json({
      message: "User moved to waiting queue successfully",
      queUser,
    });

  } catch (err) {
    console.error("Error in MoveToWaitingQueue:", err);
    next(err);
  }
};



export const GetAppointments = async (req, res, next) => {
  try {
    const { date, type, doctor_id } = req.query;

    if (!date || !doctor_id) {
      return res.status(400).json({ message: "Date and doctor_id are required" });
    }

    // Parse date string "dd-mm-yyyy" → Date object (midnight local)
    const parsedDate = parseDateString(date);

    // Find queue for that doctor + date
    const queue = await queueModel.findOne({ doctor_id, date: parsedDate });
    if (!queue) {
      return res.status(404).json({ message: "No queue found for this doctor on the given date" });
    }

    // Filter queue users
    let query = { queue_id: queue._id };
    if (type) {
      query.type = type; // filter by "original" or "waiting"
    }

    const appointments = await queUserModel
      .find(query)
      .populate("user_id", "name email") // populate basic user details
      .sort({ estimated_time: 1 }); // earliest first

    res.status(200).json({
      message: "Appointments fetched successfully",
      count: appointments.length,
      appointments,
    });

  } catch (err) {
    console.error("Error in GetAppointments:", err);
    next(err);
  }
};


export const RejectAppointment = async (req, res, next) => {
  try {
    const { queUserId } = req.params;

    if (!queUserId) {
      return res.status(400).json({ message: "queUserId is required" });
    }

    // Find the queue-user
    const queUser = await queUserModel.findById(queUserId);
    if (!queUser) {
      return res.status(404).json({ message: "Queue user not found" });
    }

    // Update type → reject
    queUser.type = "reject";
    await queUser.save();

    res.status(200).json({
      message: "Appointment rejected successfully",
      appointment: queUser,
    });

  } catch (err) {
    console.error("Error in RejectAppointment:", err);
    next(err);
  }
};







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