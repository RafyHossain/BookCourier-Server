const { ObjectId } = require("mongodb");

class BookModel {
  constructor(collection) {
    this.collection = collection;
  }

  async create(bookData) {
    bookData.createdAt = new Date();
    return await this.collection.insertOne(bookData);
  }

  async findAll(search = "", sort = "desc") {
    const query = {
      status: "published",
      title: { $regex: search, $options: "i" },
    };

    const sortOption = sort === "asc" ? 1 : -1;

    return await this.collection
      .find(query)
      .sort({ price: sortOption })
      .toArray();
  }

  async findById(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }
}

module.exports = BookModel;
