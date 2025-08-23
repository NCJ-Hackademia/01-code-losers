const queUserSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  queue_id: { type: mongoose.Schema.Types.ObjectId, ref: "queue" },
  estimated_time: { type: Date, required: true }, 
  type: { type: String, enum: ["original", "waiting","reject"], default: "original" }
});
