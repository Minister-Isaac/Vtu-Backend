import { Router } from "express"
import { buyDataSubcription, buyAirtimeSubscription, getAllDataTransactions, queryDataTransaction, queryAirtimeTransaction, payElectricityBills, queryElectricityBill} from "../controller/account.controller.js"
import { authenticateUser } from "../middleware/auth.middleware.js"
import validateDataReqBody from "../middleware/data.schema.js"
import validateAirtimeReqBody from "../middleware/airtime.schema.js"
import validateElectricityReqBody from "../middleware/electricity.schema.js"

const router = Router()

router.post("/data", authenticateUser, validateDataReqBody, buyDataSubcription)
router.post("/airtime", authenticateUser, validateAirtimeReqBody, buyAirtimeSubscription)
router.get("/data-history", authenticateUser, getAllDataTransactions)
router.get("/query-data/:transactionId", authenticateUser, queryDataTransaction)
router.get("/query-airtime/:transactionId", authenticateUser, queryAirtimeTransaction)
router.post("/electricity", authenticateUser, validateElectricityReqBody, payElectricityBills)
router.get("/query-electricity-bill", authenticateUser, queryElectricityBill)

export default router