const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const { verifyAdmin } = require("../middleware/verifyRole");

const BookController = require("../controllers/bookController");

module.exports = (models) => {
  const bookController = new BookController(models);

  // ================= LIBRARIAN =================

 
  router.get(
    "/my-books",
    verifyToken,
    (req, res) => bookController.getMyBooks(req, res)
  );

  router.patch(
    "/my-books/:id",
    verifyToken,
    (req, res) => bookController.updateBook(req, res)
  );

  // ================= ADMIN =================

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

  // ================= PUBLIC =================

  // ADD BOOK
  router.post(
    "/",
    verifyToken,
    (req, res) => bookController.addBook(req, res)
  );

  // ALL BOOKS
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
