const admin = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send({ message: "Forbidden" });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.user.email;

    const userCollection = req.app.locals.collections.users;

    const user = await userCollection.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
};

module.exports = { verifyToken, verifyAdmin };
