const { ObjectId } = require("mongodb");

class BookController {
  constructor(models) {
    this.Book = models.Book;
    this.Order = models.Order;
  }

  async addBook(req, res) {
    try {
      const bookData = {
        ...req.body,
        librarianEmail: req.user.email,
        status:req.body.status || "unpublished",
        createdAt: new Date(),
      };

      const result = await this.Book.create(bookData);
      res.status(201).send(result);
    } catch (error) {
      console.log("Add Book Error:", error);
      res.status(500).send({ message: error.message });
    }
  }

  async getAllBooks(req, res) {
    try {
      // Added category, page and limit for pagination & filtering
      const { search, sort, category, page = 1, limit = 8 } = req.query;

      let query = { status: "published" };

      // Search by title
      if (search) {
        query.title = { $regex: search, $options: "i" };
      }
      
      // Filter by category
      if (category && category !== "All") {
        query.category = category;
      }

      // Sorting
      let sortOptions = { createdAt: -1 };
      if (sort === "asc") {
        sortOptions = { price: 1 };
      } else if (sort === "desc") {
        sortOptions = { price: -1 };
      }

      // Pagination Logic
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      // Get total count for frontend pagination buttons
      const totalBooks = await this.Book.collection.countDocuments(query);

      const books = await this.Book.collection
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber)
        .toArray();

      // Send books along with pagination info
      res.send({
        books,
        totalBooks,
        totalPages: Math.ceil(totalBooks / limitNumber),
        currentPage: pageNumber
      });
    } catch (error) {
      console.log("Get Books Error:", error);
      res.status(500).send({ message: "Failed to fetch books" });
    }
  }

  async getLatestBooks(req, res) {
    try {
      const books = await this.Book.collection
        .find({ status: "published" })
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();

      res.send(books);
    } catch (error) {
      console.log("Latest Books Error:", error);
      res.status(500).send({
        message: "Failed to fetch latest books",
      });
    }
  }

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

  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const email = req.user.email;

      const result = await this.Book.collection.updateOne(
        { _id: new ObjectId(id), librarianEmail: email },
        { $set: req.body }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).send({
          message: "Book not found or unauthorized",
        });
      }

      res.send({ message: "Book updated successfully" });
    } catch (error) {
      console.log("Update Book Error:", error);
      res.status(500).send({ message: "Update failed" });
    }
  }

  async deleteBookAdmin(req, res) {
    try {
      const { id } = req.params;

      await this.Order.collection.deleteMany({ bookId: id });

      const result = await this.Book.collection.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Book not found" });
      }

      res.send({
        message: "Book and related orders deleted successfully",
      });
    } catch (error) {
      console.log("Delete Book Error:", error);
      res.status(500).send({ message: "Delete failed" });
    }
  }

  async updateBookStatusAdmin(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["published", "unpublished"].includes(status)) {
        return res.status(400).send({
          message: "Invalid status",
        });
      }

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