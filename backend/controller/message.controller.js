import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js';

export const sendMessage = async(req, res)=>{

    try {
        const {message} = req.body;
        const {id: receiverID} = req.params;
        const senderID = req.user._id;

        console.log(receiverID);
        console.log(senderID._id);
        console.log('#################################')

        let conversation = await Conversation.findOne({
            participants: { $all: [senderID, receiverID]},

        });

        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderID, receiverID],
            });
        }

        const newMessage = new  Message({
            senderID,
            receiverID,
            message,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(),newMessage.save()]);

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }

}


export const getMessages = async (req, res) => {
    try {
        const {id: userToChatID} = req.params;
        const senderID = req.user._id;

        const conversation = await Conversation.findOne({
			participants: { $all: [senderID, userToChatID] },
		}).populate("messages"); 

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

		res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }   
}