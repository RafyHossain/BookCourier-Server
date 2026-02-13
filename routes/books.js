const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const { verifyAdmin } = require("../middleware/verifyRole");

const BookController = require("../controllers/bookController");

module.exports = (models) => {
  const bookController = new BookController(models);

  // ================= LIBRARIAN =================

  // Get My Books
  router.get(
    "/my-books",
    verifyToken,
    (req, res) => bookController.getMyBooks(req, res)
  );

  // Update My Book
  router.patch(
    "/my-books/:id",
    verifyToken,
    (req, res) => bookController.updateBook(req, res)
  );

  // ================= ADMIN =================

  // Get All Books
  router.get(
    "/admin",
    verifyToken,
    verifyAdmin,
    (req, res) => bookController.getAllBooksAdmin(req, res)
  );

  // Update Publish / Unpublish
  router.patch(
    "/admin/:id",
    verifyToken,
    verifyAdmin,
    (req, res) => bookController.updateBookStatusAdmin(req, res)
  );

  // Delete Book (and related orders)
  router.delete(
    "/admin/:id",
    verifyToken,
    verifyAdmin,
    (req, res) => bookController.deleteBookAdmin(req, res)
  );

  // ================= PUBLIC =================

  // Add Book (Librarian)
  router.post(
    "/",
    verifyToken,
    (req, res) => bookController.addBook(req, res)
  );

  // All Published Books
  router.get(
    "/",
    (req, res) => bookController.getAllBooks(req, res)
  );

  // Single Book
  router.get(
    "/:id",
    (req, res) => bookController.getBookById(req, res)
  );

  return router;
};
