const { ObjectId } = require("mongodb");

class BookController {
  constructor(models) {
    this.Book = models.Book;
    this.Order = models.Order;
  }

  // ================= ADD BOOK =================
  async addBook(req, res) {
    try {
      const bookData = {
        ...req.body,
        librarianEmail: req.user.email,
        createdAt: new Date(),
      };

      const result = await this.Book.create(bookData);
      res.status(201).send(result);

    } catch (error) {
      console.log("Add Book Error:", error);
      res.status(500).send({ message: error.message });
    }
  }

  // ================= PUBLIC BOOKS =================
  async getAllBooks(req, res) {
    try {
      const books = await this.Book.collection
        .find({ status: "published" })
        .sort({ createdAt: -1 })
        .toArray();

      res.send(books);

    } catch (error) {
      console.log("Get Books Error:", error);
      res.status(500).send({ message: "Failed to fetch books" });
    }
  }

  // ================= SINGLE BOOK =================
  async getBookById(req, res) {
    try {
      const book = await this.Book.collection.findOne({
        _id: new ObjectId(req.params.id),
      });

      if (!book) {
        return res.status(404).send({ message: "Book not found" });
      }

      res.send(book);

    } catch (error) {
      console.log("Get Book Error:", error);
      res.status(500).send({ message: "Failed to fetch book" });
    }
  }

  // ================= LIBRARIAN MY BOOKS =================
  async getMyBooks(req, res) {
    try {
      const email = req.user.email;

      const books = await this.Book.collection
        .find({ librarianEmail: email })
        .sort({ createdAt: -1 })
        .toArray();

      res.send(books);

    } catch (error) {
      console.log("My Books Error:", error);
      res.status(500).send({ message: "Failed to fetch books" });
    }
  }

  // ================= UPDATE BOOK =================
  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const email = req.user.email;

      const result = await this.Book.collection.updateOne(
        { _id: new ObjectId(id), librarianEmail: email },
        { $set: req.body }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).send({ message: "Book not found or unauthorized" });
      }

      res.send({ message: "Book updated successfully" });

    } catch (error) {
      console.log("Update Book Error:", error);
      res.status(500).send({ message: "Update failed" });
    }
  }

  // ================= ADMIN DELETE =================
  async deleteBookAdmin(req, res) {
    try {
      const { id } = req.params;

      // delete related orders
      await this.Order.collection.deleteMany({ bookId: id });

      // delete book
      const result = await this.Book.collection.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Book not found" });
      }

      res.send({
        message: "Book and related orders deleted"
      });

    } catch (error) {
      console.log("Delete Book Error:", error);
      res.status(500).send({ message: "Delete failed" });
    }
  }

  // ================= ADMIN STATUS UPDATE =================
  async updateBookStatusAdmin(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const result = await this.Book.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).send({ message: "Book not found" });
      }

      res.send({ message: "Book status updated successfully" });

    } catch (error) {
      console.log("Update Status Error:", error);
      res.status(500).send({ message: "Update failed" });
    }
  }

  // ================= ADMIN GET ALL =================
  async getAllBooksAdmin(req, res) {
    try {
      const books = await this.Book.collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      res.send(books);

    } catch (error) {
      console.log("Admin Get Books Error:", error);
      res.status(500).send({ message: "Failed to fetch books" });
    }
  }
}

module.exports = BookController;
