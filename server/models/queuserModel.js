import mongoose from "mongoose";

const queUserSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  queue_id: { type: mongoose.Schema.Types.ObjectId, ref: "queue", required: true },
  estimated_time: { type: Date, required: true },
  type: { type: String, enum: ["original", "waiting", "reject"], default: "original" }
});

// Add a compound index for unique user_id + queue_id combination
queUserSchema.index({ user_id: 1, queue_id: 1 }, { unique: true });

const queUserModel = mongoose.model("queuser", queUserSchema);

export default queUserModel;
