import logger from "../utils/logger.js"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

const signUpUser = async (req, res) => {
    const { full_name, username, email, phone, address, referral_username, password } = req.body
    if(!full_name || !username || !email || !phone || !address || !referral_username || !password) {
        logger.error("All fields are required")
        return res.status(400).json({ message: "All fields are required" })
    }

    const user = await User.findOne({ email })
    if (user){
        return res.status(429).json({ message: "User already exists" })
    }
    if (username){
        return res.status(429).json({ message: "An existing account with this username is taken already" })
    }

    const newUser = await User.create({
        full_name,
        username,
        email,
        phone,
        address,
        referral_username,
        password
    })


}