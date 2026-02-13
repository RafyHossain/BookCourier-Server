const { ObjectId } = require("mongodb");

class BookController {
  constructor(models) {
    this.Book = models.Book;
    this.Order = models.Order;
  }

  async addBook(req, res) {
    try {
      const result = await this.Book.create(req.body);
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async getAllBooks(req, res) {
    try {
      const { search = "", sort = "desc" } = req.query;
      const books = await this.Book.findAll(search, sort);
      res.send(books);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch books" });
    }
  }

  async getBookById(req, res) {
    try {
      const book = await this.Book.findById(req.params.id);
      res.send(book);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch book" });
    }
  }

  async getAllBooksAdmin(req, res) {
    try {
      const books = await this.Book.collection
        .find()
        .sort({ createdAt: -1 })
        .toArray();

      res.send(books);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch books" });
    }
  }

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




  async getMyBooks(req, res) {
  try {
    const email = req.user.email;

    const books = await this.Book.collection
      .find({ createdBy: email })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(books);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch books" });
  }
}

async updateBook(req, res) {
  try {
    const { id } = req.params;
    const email = req.user.email;

    const updatedData = req.body;

    await this.Book.collection.updateOne(
      { _id: new ObjectId(id), createdBy: email },
      { $set: updatedData }
    );

    res.send({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Update failed" });
  }
}






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
