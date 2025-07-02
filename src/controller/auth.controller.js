import logger from "../utils/logger.js"
import User from "../models/user.model.js"
//import Account from "../models/account.model.js"
import RefreshToken from "../models/refresh.token.model.js"
import { generateAccessToken, generateRefreshToken } from "../utils/generate.token.js"

const registerUser = async (req, res) => {
    logger.info("Registering new user endpoint hit!")
    const { full_name, username, email, phone, address, referral_username, password } = req.body
    if(!full_name || !username || !email || !phone || !address || !password) {
        logger.error("All fields are required")
        return res.status(422).json({ success: false, message: "All fields are required" })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser){
            logger.warn("user already exists:", existingUser)
            return res.status(409).json({ success: false, message: "User already exists" })
        }
        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return res.status(409).json({ success: false, message: "An existing account with this username is taken already" })
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
        
        await Account.create({
            user: newUser._id
        })
        
        logger.debug("New user created")
        return res.status(201).json({ success: true, message: "User registered successfully"})
    } catch (error) {
    logger.error("Error registering user:", error)
    return res.status(500).json({ success: false, message: "Internal server error"})
  }
}

const loginUser = async (req, res) => {
    logger.info("Login user endpoint hit!")
    const { username, password } = req.body
    if (!username || !password) {   
        logger.error("Username and password are required")
        return res.status(422).json({ message: "Username and password are required" })
    }

    try{
        const user = await User.findOne({ username}).select("+password")
        if(!user) {
            logger.error("User not found", username)
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const isPasswordValid = await user.comparePassword(password)
        if(!isPasswordValid) {
            logger.error("Invalid password for user:", username)
            return res.status(401).json({ success: false, message: "Invalid password" })
        }
        
        const accessToken = generateAccessToken(user._id, user.username)
        const refreshToken = generateRefreshToken(user._id, user.username)

        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
        
        user.last_login = new Date()
        await user.save()

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        })

        logger.debug("User logged in successfully:", username)
     return res.status(200).json({ success: true, message: "Login successful", user, accessToken })
    } catch(error){
         logger.error("Failed to Log in user:", error)
        return res.status(500).json({ success: false, message: "Internal server error"})
    }
}
export { registerUser, loginUser}