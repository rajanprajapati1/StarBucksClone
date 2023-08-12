const jwt = require('jsonwebtoken');
const RegisterSBs = require("../models/model");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log("Received token:", token);

        if (!token) {
            return res.status(401).send("No token provided");
        }

        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Verified user:", verifyUser);

        const user = await RegisterSBs.findOne({ _id: verifyUser._id });
        if (user) {
            req.token = token;
            next();
        } else {
            res.status(400).send("User not found");
        }
    } catch (error) {
        console.log("Authentication error:", error);
        res.status(400).send("Invalid token");
    }
};

module.exports = auth;
