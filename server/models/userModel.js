import mongoose from "mongoose";

const UserScheme = new mongoose.Schema({
  email: { type: String,required:true,unique:true},
  password: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  role: { type: String, enum: ["doctor", "hospital","user"],default:"user" },
  isActive: { type: Boolean, default: true },
  img: {
    type: String,
    default:
      "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o",
  },
});

const userModel = mongoose.model("Users", UserScheme);

export default userModel;