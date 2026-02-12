const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const { verifyAdmin } = require("../middleware/verifyRole");

const BookController = require("../controllers/bookController");

module.exports = (models) => {
  const bookController = new BookController(models);

  router.post(
    "/",
    verifyToken,
    (req, res) => bookController.addBook(req, res)
  );

  router.get(
    "/admin",
    verifyToken,
    verifyAdmin,
    (req, res) => bookController.getAllBooksAdmin(req, res)
  );

  router.delete(
    "/admin/:id",
    verifyToken,
    verifyAdmin,
    (req, res) => bookController.deleteBookAdmin(req, res)
  );

  router.patch(
    "/admin/:id",
    verifyToken,
    verifyAdmin,
    (req, res) => bookController.updateBookStatusAdmin(req, res)
  );

  router.get(
    "/",
    (req, res) => bookController.getAllBooks(req, res)
  );

  router.get(
    "/:id",
    (req, res) => bookController.getBookById(req, res)
  );

  return router;
};
