import mongoose from "mongoose";


const queueSchema = new mongoose.Schema({
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "doctors" },
  date: { type: Date, required: true }, 
  count: { type: Number, default: 0 },
  wt_time: { type: Number, default: 0 }, 
  end_time: { type: Date, required: true },
  wt_count: { type: Number, default: 0 },
});

const queueModel = mongoose.model("queue", queueSchema);

export default queueModel; 