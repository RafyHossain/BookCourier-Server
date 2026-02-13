const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const { verifyAdmin } = require("../middleware/verifyRole");

const LibrarianRequestController = require("../controllers/librarianRequestController");

module.exports = (models) => {

  const controller = new LibrarianRequestController(models);

  router.post(
    "/",
    verifyToken,
    (req, res) => controller.sendRequest(req, res)
  );

  router.get(
    "/",
    verifyToken,
    verifyAdmin,
    (req, res) => controller.getAllRequests(req, res)
  );

  router.patch(
    "/:id/approve",
    verifyToken,
    verifyAdmin,
    (req, res) => controller.approveRequest(req, res)
  );

  router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  (req, res) => controller.deleteRequest(req, res)
);


  return router;
};
