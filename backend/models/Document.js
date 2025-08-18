import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  _id: String,
  content: String,
}, { timestamps: true });

export default mongoose.model("Document", DocumentSchema);
