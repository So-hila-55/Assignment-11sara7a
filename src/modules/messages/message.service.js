
import { RequestStatusEnum } from "../../common/enum/request.enum.js"
import * as dbService from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import messageModel from "../../DB/models/message.model.js"
import requestModel from "../../DB/models/request.model.js"
import conversationModel from "../../DB/models/conversation.model.js"
import conversationMessageModel from "../../DB/models/conversationMessage.model.js"


export const sendMessage = async (req, res, next) => {
    const { receiverId } = req.params
    const { content } = req.body

    if (receiverId === req.user._id.toString()) {
        throw new Error("you can't send a message to yourself", { cause: 400 })
    }

    const receiver = await dbService.findById({ model: userModel, id: receiverId })
    if (!receiver) {
        throw new Error("receiver not found", { cause: 404 })
    }

    await dbService.create({
        model: messageModel,
        data: { content, receiverId, senderId: req.user._id },
    })

    return res.status(201).json({ message: "Message sent anonymously" })
}

export const requestSenderIdentity = async (req, res, next) => {
    const { messageId } = req.params

    const message = await dbService.findOne({
        model: messageModel,
        filter: { _id: messageId, receiverId: req.user._id },
        select: "+senderId",
    })
    if (!message) {
        throw new Error("message not found", { cause: 404 })
    }

    const existing = await dbService.findOne({
        model: requestModel,
        filter: { messageId, requesterId: req.user._id },
    })
    if (existing) {
        throw new Error("you already requested this message's sender", { cause: 409 })
    }

    await dbService.create({
        model: requestModel,
        data: {
            messageId,
            requesterId: req.user._id,
            senderId: message.senderId,
        },
    })

    return res.status(201).json({ message: "Request sent, status: pending" })

}

export const getRequests = async (req, res, next) => {
    const requests = await dbService.find({
        model: requestModel,
        filter: { senderId: req.user._id },
        select: "messageId status createdAt",
        options: {
            populate: { path: "messageId", select: "content createdAt" },
            sort: { createdAt: -1 },
        },
    })

    return res.status(200).json({ message: "Done", data: requests })
}

export const respondToRequest = async (req, res, next) => {
    const { requestId } = req.params
    const { status } = req.body

    if (![RequestStatusEnum.accepted, RequestStatusEnum.rejected].includes(status)) {
        throw new Error("status must be accepted or rejected", { cause: 400 })
    }

    const request = await dbService.findOneAndUpdate({
        model: requestModel,
        filter: { _id: requestId, senderId: req.user._id, status: RequestStatusEnum.pending },
        update: { status },
    })
    if (!request) {
        throw new Error("request not found or already answered", { cause: 404 })
    }

    if (status === RequestStatusEnum.accepted) {
        const [conversation] = await dbService.create({
            model: conversationModel,
            data: {
                participants: [request.senderId, request.requesterId],
                messageId: request.messageId,
            },
        })

        return res.status(200).json({
            message: "Request accepted",
            data: { conversationId: conversation._id },
        })
    }

    return res.status(200).json({ message: "Request rejected" })
}

export const sendConversationMessage = async (req, res, next) => {
    const { conversationId } = req.params
    const { content } = req.body

    const conversation = await dbService.findOne({
        model: conversationModel,
        filter: { _id: conversationId, participants: req.user._id },
    })
    if (!conversation) {
        throw new Error("conversation not found", { cause: 404 })
    }

    const [message] = await dbService.create({
        model: conversationMessageModel,
        data: { conversationId, senderId: req.user._id, content },
    })

    return res.status(201).json({ message: "Done", data: message })
}

export const getConversationMessages = async (req, res, next) => {
    const { conversationId } = req.params

    const conversation = await dbService.findOne({
        model: conversationModel,
        filter: { _id: conversationId, participants: req.user._id },
    })
    if (!conversation) {
        throw new Error("conversation not found", { cause: 404 })
    }

    const messages = await dbService.find({
        model: conversationMessageModel,
        filter: { conversationId },
        options: { sort: { createdAt: 1 } },
    })

    return res.status(200).json({ message: "Done", data: messages })
}