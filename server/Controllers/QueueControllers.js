import queueModel from "../models/queuemodel.js";
import queUserModel from "../models/queuserModel.js";
import {
  parseDateString,
  addMinutes,
  getQueueStartTime,
} from "../utils/parsedate.js";
import medicalrecordsModel from "../models/medicalrecordsModel.js";
import doctorModel from "../models/doctorsmodel.js";
import mongoose from "mongoose";

export const AddInQueue = async (req, res, next) => {
  try {
    const { date, doctor_id } = req.body;

    const doctor = await doctorModel.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const consultationTime = 5;

    const parsedDate = parseDateString(date);

    let queue = await queueModel.findOne({ doctor_id, date: parsedDate });

    let estimatedTime;

    if (!queue) {
      const startTime = getQueueStartTime(date);

      queue = await queueModel.create({
        doctor_id,
        date: parsedDate,
        count: 1,
        end_time: addMinutes(startTime, consultationTime),
      });

      estimatedTime = startTime;
    } else {
      estimatedTime = queue.end_time;

      queue.count += 1;
      queue.end_time = addMinutes(queue.end_time, consultationTime);
      await queue.save();
    }

    const queUser = await queUserModel.create({
      queue_id: queue._id,
      user_id: req.user._id,
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

    const queUser = await queUserModel.findById(queUserId).populate("queue_id");
    if (!queUser) {
      return res.status(404).json({ message: "Queue user not found" });
    }

    const queue = queUser.queue_id;
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    if (queUser.type === "waiting") {
      return res
        .status(400)
        .json({ message: "User is already in waiting queue" });
    }

    queue.wt_count += 1;
    queue.wt_time -= 5;
    await queue.save();

    queUser.type = "waiting";
    await queUser.save();

    const effectiveEstimatedTime = new Date(
      queUser.estimated_time.getTime() + queue.wt_time * 60000
    );

    res.status(200).json({
      message: "User moved to waiting queue successfully",
      queUser: {
        ...queUser.toObject(),
        effective_estimated_time: effectiveEstimatedTime,
      },
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
      return res
        .status(400)
        .json({ message: "Date and doctor_id are required" });
    }

    const parsedDate = parseDateString(date);

    const queue = await queueModel.findOne({ doctor_id, date: parsedDate });
    if (!queue) {
      return res
        .status(404)
        .json({ message: "No queue found for this doctor on the given date" });
    }

    let query = { queue_id: queue._id };
    if (type) {
      query.type = type;
    }

    const appointments = await queUserModel
      .find(query)
      .populate("user_id", "name email")
      .sort({ estimated_time: 1 });

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

    const queUser = await queUserModel.findById(queUserId);
    if (!queUser) {
      return res.status(404).json({ message: "Queue user not found" });
    }

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
    const doctorId = req.user._id;
    const { queUserId, description, medicine, disease } = req.body;

    if (!queUserId || !mongoose.Types.ObjectId.isValid(queUserId)) {
      return res.status(400).json({
        success: false,
        message: "Provide valid queue user id",
      });
    }

    const queUser = await queUserModel
      .findById(queUserId)
      .populate("queue_id")
      .populate("user_id");

    if (!queUser) {
      return res.status(404).json({
        success: false,
        message: "Patient not found in queue",
      });
    }

    const queue = queUser.queue_id;
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    if (queue.count > 0) queue.count -= 1;

    await queue.save();

    const medicalRecord = await medicalrecordsModel.create({
      user_id: queUser.user_id._id,
      doctor_id: doctorId,
      description,
      medicine,
      disease,
      files: [],
    });

    await queUserModel.findByIdAndDelete(queUserId);

    return res.status(200).json({
      success: true,
      message: "Medical record added successfully",
      medicalRecord,
    });
  } catch (error) {
    console.error("Error in TreatedByDoctor:", error);
    next(error);
  }
};


export const AcceptWaitingPatient = async (req, res, next) => {
  try {
    const doctorId = req.user._id;
    const { queUserId, description, medicine, disease } = req.body;

    if (!queUserId) {
      return res.status(400).json({
        success: false,
        message: "Provide queue user id",
      });
    }
 if (!queUserId || !mongoose.Types.ObjectId.isValid(queUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid queue user id",
      });
    }
    const objectId = new mongoose.Types.ObjectId(queUserId);

    const queUser = await queUserModel
      .findById(objectId)
      .populate("queue_id")
      .populate("user_id");

    if (!queUser) {
      return res.status(404).json({
        success: false,
        message: "Queue user not found",
      });
    }

    if (queUser.type !== "waiting") {
      return res.status(400).json({
        success: false,
        message: "This patient is not in waiting queue",
      });
    }

    const queue = queUser.queue_id;
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    if (queue.wt_count > 0) queue.wt_count -= 1;
    queue.wt_time += 5;
    queue.count-=1;
    await queue.save();

    const medicalRecord = await medicalrecordsModel.create({
      user_id: queUser.user_id._id,
      doctor_id: doctorId,
      description,
      medicine,
      disease,
      files: [],
    });

       await queUserModel.findByIdAndDelete(queUserId);


    return res.status(200).json({
      success: true,
      message: "Waiting patient accepted and treated successfully",
      medicalRecord,
    });
  } catch (error) {
    console.error("Error in AcceptWaitingPatient:", error);
    next(error);
  }
};
