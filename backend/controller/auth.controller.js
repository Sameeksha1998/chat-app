import User from "../modal/user.modal.js";
import bcrypt from "bcryptjs"
import generateWebTokenCookie from "../utils/generateToken.js";

const signup = async (req, res) => {
    try {
        const { fullName, userName, password, confirmPassword, gender } = req.body
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "password not matches" })
        }

        const user = await User.findOne({ userName })
        if (user) {
            return res.status(400).json({ error: "user already exist" })
        }

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt)

        const boyProfileImg = `https://avatar.iran.liara.run/public/boy?username=${userName}`
        const girlProfileImg = `https://avatar.iran.liara.run/public/girl?username=${userName}`

        const newUser = new User({
            fullName,
            userName,
            password: hash,
            gender,
            profileImg: gender === 'male' ? boyProfileImg : girlProfileImg
        })

        if (newUser) {
            await newUser.save();
            generateWebTokenCookie(newUser._id, res)
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                profileImg: newUser.profileImg
            })
        }
    }
    catch (error) {
        console.log("error in singnup:", error);
        res.status(200).json({ error: "Internal server error" })
    }

    console.log("signup");
}

const login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            // Check if username and password are provided
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await User.findOne({ userName });

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        // Check if the user was found
        if (!user || !isPasswordMatch) {
            console.log("User not found with username and password");
            return res.status(401).json({ error: "Username or password is incorrect" });
        }


        console.log("User logged in successfully");
        generateWebTokenCookie(user._id, res)
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            profileImg: user.profileImg
        })


    } catch (error) {
        console.log("Error in login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "logged out successfully" })
    } catch (error) {
        console.log("Error in login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

    console.log("logout");
}
export { signup, login, logout }