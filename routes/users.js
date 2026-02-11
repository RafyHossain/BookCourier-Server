const { verifyToken } = require("../middleware/auth");

function userRoutes(app, controllers) {
  const userController = controllers.user;

  app.post("/users", verifyToken, (req, res) =>
    userController.saveUser(req, res)
  );
}

module.exports = userRoutes;
