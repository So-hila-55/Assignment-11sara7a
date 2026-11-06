
import mongoose from "mongoose"
import { RequestStatusEnum } from "../../common/enum/request.enum.js"

const requestSchema = new mongoose.Schema(
    {
        messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message", required: true },
        requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: Object.values(RequestStatusEnum),
            default: RequestStatusEnum.pending,
        },
    },
    { timestamps: true }
)

requestSchema.index({ messageId: 1, requesterId: 1 }, { unique: true })

const requestModel = mongoose.models.Request || mongoose.model("Request", requestSchema)
export default requestModel