const { verifyToken } = require("../middleware/auth");

function bookRoutes(app, controllers) {
  const bookController = controllers.book;

  app.post("/books", verifyToken, (req, res) =>
    bookController.addBook(req, res)
  );

  app.get("/books", (req, res) =>
    bookController.getAllBooks(req, res)
  );

  app.get("/books/:id", (req, res) =>
    bookController.getBookById(req, res)
  );
}

module.exports = bookRoutes;
