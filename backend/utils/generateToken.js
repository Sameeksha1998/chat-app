import jwt from "jsonwebtoken";

const generateWebTokenCookie = (userId, res) => {

    const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '15d' });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: true
    });

};

export default generateWebTokenCookie;