import { Router } from "express"
import { loginUser, registerUser } from "../controller/auth.controller.js"
import validateSignUpInput from "../middleware/signup.schema.js"
import validateLoginInput from "../middleware/login.schema.js"

const router = Router()

router.post("/register", validateSignUpInput, registerUser)
router.post("/login", validateLoginInput, loginUser)

export default router