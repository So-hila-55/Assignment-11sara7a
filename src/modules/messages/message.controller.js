

import { Router } from "express"
import * as MS from "./message.service.js"
import { authentication } from "../../common/middleware/authentication.js"




const messageRouter = Router()

messageRouter.post("/send/:receiverId", authentication, MS.sendMessage)

messageRouter.get("/requests", authentication, MS.getRequests)
messageRouter.patch("/requests/:requestId", authentication, MS.respondToRequest)
messageRouter.post("/conversations/:conversationId/messages", authentication, MS.sendConversationMessage)
messageRouter.get("/conversations/:conversationId/messages", authentication, MS.getConversationMessages)
messageRouter.post("/:messageId/request-identity", authentication, MS.requestSenderIdentity)



export default messageRouter