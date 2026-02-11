const admin = require('../config/firebase');

// This middleware checks if the request has a valid Firebase token
const verifyToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    // No token found in headers
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized access. No token provided." });
    }

    try {
        // Extract the token from "Bearer <token>"
        const token = authHeader.split(' ')[1];

        // Verify token using Firebase Admin SDK
        const decoded = await admin.auth().verifyIdToken(token);

        // Save email inside request for later use
        req.decodedEmail = decoded.email;

        next();

    } catch (error) {
        return res.status(401).send({ message: "Invalid or expired token." });
    }
};

module.exports = { verifyToken };
