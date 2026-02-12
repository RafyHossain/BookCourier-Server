const admin = require("../config/firebase");

// Verify Firebase Token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    req.decodedEmail = decoded.email; // keep your naming style
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};

//  Generic Role Verifier
const verifyRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      if (!req.collections) {
        return res
          .status(500)
          .send({ message: "Database collections not attached" });
      }

      const { users } = req.collections;
      const email = req.decodedEmail;

      const user = await users.findOne({ email });

      if (!user || user.role !== requiredRole) {
        return res.status(403).send({ message: "Forbidden access" });
      }

      next();
    } catch (error) {
      return res.status(500).send({
        message: "Role verification failed",
        error: error.message,
      });
    }
  };
};

//  Specific Role Middlewares
const verifyAdmin = verifyRole("admin");
const verifyLibrarian = verifyRole("librarian");

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyLibrarian,
};
