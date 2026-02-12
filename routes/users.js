const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");

const { verifyToken } = require("../middleware/auth");
const { verifyAdmin } = require("../middleware/verifyRole");

module.exports = (models) => {
  const userController = new UserController(models.User);

  router.post("/", (req, res) =>
    userController.saveUser(req, res)
  );

  router.get(
    "/",
    verifyToken,
    verifyAdmin,
    (req, res) => userController.getAllUsers(req, res)
  );

  router.patch(
    "/:email/role",
    verifyToken,
    verifyAdmin,
    (req, res) => userController.updateUserRole(req, res)
  );

  router.patch(
    "/make-admin/:email",
    verifyToken,
    verifyAdmin,
    (req, res) => userController.makeAdmin(req, res)
  );

  router.patch(
    "/make-librarian/:email",
    verifyToken,
    verifyAdmin,
    (req, res) => userController.makeLibrarian(req, res)
  );

  router.get(
    "/:email/role",
    verifyToken,
    (req, res) => userController.getUserRole(req, res)
  );

  return router;
};
