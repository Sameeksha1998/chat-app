import jwt from "jsonwebtoken"; // Default import

import User from "../modal/user.modal.js";

const protectRoute = async(req, res, next) => {
console.log(req.cookies.jwt ,"nnnnnnnnnnnnnnnnnn");
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({ error: "unauthorized-No token provided" })
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY)

        if (!decode) {
            return res.status(401).json({ error: "unauthorized-Invalid token" })
        }
        const user = await User.findById(decode.userId).select("-password");
        if (!user) {
            return res.status(401).json({ error: "User not found" })
        }
        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

}

export default protectRoute;
