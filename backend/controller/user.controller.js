import User from "../modal/user.modal.js";

const getUser = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        const userData = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(userData)
    } catch (error) {
        console.log("Error in login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export { getUser }