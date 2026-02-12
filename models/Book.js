const { ObjectId } = require("mongodb");

class BookModel {
  constructor(collection) {
    this.collection = collection;
  }

 async create(bookData) {
  const newBook = {
    ...bookData,
    createdAt: new Date(),
  };

  return await this.collection.insertOne(newBook);
}


  async findAll(search = "", sort = "desc") {
    const query = {
      status: "published",
      title: { $regex: search, $options: "i" },
    };

    const sortValue = sort === "asc" ? 1 : -1;

    return await this.collection
      .find(query)
      .sort({ price: sortValue })
      .toArray();
  }

  async findById(id) {
    return await this.collection.findOne({
      _id: new ObjectId(id),
    });
  }
}

module.exports = BookModel;
