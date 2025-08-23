import mongoose from "mongoose";

const queUserScheme = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId,ref:"Users"},
  queue_id: { type: mongoose.Schema.Types.ObjectId, ref:"queue" },
  estimated_time:{type:Date,required:true},
  type:{type:String,required:true,enum:["original","waiting"],default:"original"}
});

const queUserModel = mongoose.model("queue", queUserScheme);

export default queUserModel;