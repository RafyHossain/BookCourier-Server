const admin = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.decodedEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).send({ message: "Invalid Token" });
  }
};

module.exports = { verifyToken };
