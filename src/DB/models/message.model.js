
import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
    {
        content: { type: String, required: true, minlength: 1, trim: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, select: false },
    },
    { timestamps: true }
)

const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema)
export default messageModel