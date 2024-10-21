import mongoose from "mongoose";

let conversationSchema = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    message: [{ // Changed from `message` to `messages` for clarity
        type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId reference
        ref: "Message" // Reference to Message model
    }],
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
