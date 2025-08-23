import mongoose from "mongoose";

const queueScheme = new mongoose.Schema({
  doctor_id:{type:String,ref:"doctors"},
  date:{type:Date,required:true},
  count: { type: Number, required: true,default:0 },
  wt_time:{type:Number,required:true,default:0},
  end_time:{type:Date,required:true},
  wt_count:{type:Number,required:true},

});

const queueModel = mongoose.model("queue", queueScheme);

export default queueModel;