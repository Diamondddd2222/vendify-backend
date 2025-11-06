import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  brandName: { type: String, required: true, unique: false },
  password: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
