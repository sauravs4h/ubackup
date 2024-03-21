const jwt = require("jsonwebtoken");
const { User } = require("../../models/index.models");
const authorizeRequest = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token)
            return res.status(403).json({ error: "You must be logged In." });

        if (token.startsWith("Bearer ")) {
            token = token.replace("Bearer ", "");
        } else {
            return res.status(401).json({ error: { message: "Wrong Token" } });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: verified.id,
            deviceId: verified.deviceId,
        });
        if (!user) {
            return res.status(403).json({ error: "You must be logged In." });
        }
        req.user = verified;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { authorizeRequest };
