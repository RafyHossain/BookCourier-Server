class BookController {
  constructor(models) {
    this.Book = models.Book;
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
    const { search = "", sort = "desc" } = req.query;
    const books = await this.Book.findAll(search, sort);
    res.send(books);
  }

  async getBookById(req, res) {
    const book = await this.Book.findById(req.params.id);
    res.send(book);
  }
}

module.exports = BookController;
