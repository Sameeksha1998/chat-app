
import Conversation from '../modal/conversation.modal.js'; // Adjust the path if necessary
import Message from "../modal/message.modal.js";

const sendMessage = async (req, res) => {
    try {
        console.log("Message sent");
        const { message } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id


        let conversation = await Conversation.findOne({
            participants: { $all: [receiverId, senderId] }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        console.log(conversation, "conversation");

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })
        console.log(newMessage, "newMessage");
        if (newMessage) {
            conversation.message.push(newMessage._id);
        }
        // this will run parallel
        await Promise.all([conversation.save(), newMessage.save()])
        res.status(201).json(newMessage)
    } catch (error) {
        console.log(error);
        res.status(500).json("internal server error")

    }
}

const getMessage = async (req, res) => {

    try {

        const { id: userToChat } = req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({ participants: { $all:[senderId, userToChat]}, }).populate("message")
        console.log(conversation.message,"userToChat",senderId);
        if(!conversation) return res.status(200).json([])
        const messages = conversation.message
        res.status(200).json(messages);

    } catch (error) {
        console.log(error);
        res.status(500).json("internal server error")

    }
}

export { sendMessage, getMessage }