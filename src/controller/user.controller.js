import User from "../models/user.model.js"

const getUserDetails = async (req, res) => {
    const userId = req.user._id
    if(!userId) {
        return res.status(400).json({ message: "User ID is required" })
    }
    try {
        const user = await User.findById(userId).populate("account")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ user, message: "User details retrieved successfully" })
    } catch(error){
        console.error("Error retrieving user details:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export { getUserDetails}