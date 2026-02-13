const { ObjectId } = require("mongodb");

class WishlistModel {
  constructor(collection) {
    this.collection = collection;
  }

  async add(data) {
    return await this.collection.insertOne({
      ...data,
      createdAt: new Date(),
    });
  }

  async findByUser(email) {
    return await this.collection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async exists(bookId, userEmail) {
    return await this.collection.findOne({ bookId, userEmail });
  }

  async remove(id) {
    return await this.collection.deleteOne({
      _id: new ObjectId(id),
    });
  }
}

module.exports = WishlistModel;
