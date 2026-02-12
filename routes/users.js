const { verifyToken, verifyAdmin } = require("../middleware/auth");

function userRoutes(app, controllers) {
  const userController = controllers.user;

  // Save user
  app.post("/users", (req, res) =>
    userController.saveUser(req, res)
  );

  // Get all users (admin only)
  app.get(
    "/users",
    verifyToken,
    verifyAdmin,
    (req, res) => userController.getAllUsers(req, res)
  );

  // Update role (admin only)
  app.patch(
    "/users/:email/role",
    verifyToken,
    verifyAdmin,
    (req, res) => userController.updateUserRole(req, res)
  );

  // 🔥 ADD THIS ROUTE (VERY IMPORTANT)
  app.get(
    "/users/role/:email",
    verifyToken,
    async (req, res) => {
      try {
        const { users } = req.collections;
        const email = req.params.email;

        const user = await users.findOne({ email });

        res.send({
          role: user?.role || "user",
        });

      } catch (error) {
        res.status(500).send({
          message: "Error fetching role",
          error: error.message,
        });
      }
    }
  );
}

module.exports = userRoutes;
