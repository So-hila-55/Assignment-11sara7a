

import mongoose from "mongoose"

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        ],
        messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message", required: true, unique: true },
    },
    { timestamps: true }
)

const conversationModel =
    mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema)
export default conversationModel