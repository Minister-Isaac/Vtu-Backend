import { Router } from "express"
import { buyDataSubcription } from "../controller/account.controller.js"
import { authenticateUser } from "../middleware/auth.middleware.js"
import validateDataReqBody from "../middleware/data.schema.js"

const router = Router()

router.post("/data", authenticateUser, validateDataReqBody, buyDataSubcription)

export default router