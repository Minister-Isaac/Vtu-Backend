import { Router } from "express"
import { buyDataSubcription, buyAirtimeSubscription } from "../controller/account.controller.js"
import { authenticateUser } from "../middleware/auth.middleware.js"
import validateDataReqBody from "../middleware/data.schema.js"
import validateAirtimeReqBody from "../middleware/airtime.schema.js"

const router = Router()

router.post("/data", authenticateUser, validateDataReqBody, buyDataSubcription)
router.post("/airtime", authenticateUser, validateAirtimeReqBody, buyAirtimeSubscription)

export default router