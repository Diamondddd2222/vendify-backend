import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    phone: { type: Number, trim: true },
    email: { type: String, trim: true },
    logoUrl: { type: String, default: "" },
    storeLink: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);
