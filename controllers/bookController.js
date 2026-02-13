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
      res.status(500).send({ message: "Failed to fetch books" });
    }
  }

  // ================= SINGLE BOOK =================
  async getBookById(req, res) {
    try {
      const book = await this.Book.collection.findOne({
        _id: new ObjectId(req.params.id),
      });

      res.send(book);

    } catch (error) {
      res.status(500).send({ message: "Failed to fetch book" });
    }
  }

  // ================= LIBRARIAN MY BOOKS =================
 async getMyBooks(req, res) {
  try {
    const email = req.user.email;

    const books = await this.Book.collection
      .find({
        $or: [
          { ownerEmail: email },
          { librarianEmail: email }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(books);

  } catch (error) {
    res.status(500).send({ message: "Failed to fetch books" });
  }
}


  // ================= UPDATE BOOK =================
  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const email = req.user.email;

      await this.Book.collection.updateOne(
        { _id: new ObjectId(id), librarianEmail: email },
        { $set: req.body }
      );

      res.send({ message: "Book updated successfully" });

    } catch (error) {
      res.status(500).send({ message: "Update failed" });
    }
  }

  // ================= ADMIN DELETE =================
  async deleteBookAdmin(req, res) {
    try {
      const { id } = req.params;

      await this.Order.collection.deleteMany({ bookId: id });

      await this.Book.collection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send({ message: "Book deleted successfully" });

    } catch (error) {
      res.status(500).send({ message: "Delete failed" });
    }
  }

  // ================= ADMIN STATUS UPDATE =================
  async updateBookStatusAdmin(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await this.Book.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );

      res.send({ message: "Book status updated" });

    } catch (error) {
      res.status(500).send({ message: "Update failed" });
    }
  }
}

module.exports = BookController;
