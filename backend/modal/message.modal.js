import mongoose from "mongoose";

let messageSchema = mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
    message: { type: String, require: true, default: [] },
}, { timestamps: true });
const Message = mongoose.model("Message", messageSchema);
export default Message;
