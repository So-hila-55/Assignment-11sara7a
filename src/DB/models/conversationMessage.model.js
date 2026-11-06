

import mongoose from "mongoose"

const conversationMessageSchema = new mongoose.Schema(
    {
        conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true, minlength: 1, trim: true },
    },
    { timestamps: true }
)

const conversationMessageModel =
    mongoose.models.ConversationMessage ||
    mongoose.model("ConversationMessage", conversationMessageSchema)
export default conversationMessageModel