import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" }, 
  brandName: { type: String }, 
  logoUrl: { type: String, default: "" },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  caption: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Status", statusSchema);
