const { ObjectId } = require("mongodb");

class LibrarianRequestModel {
  constructor(collection) {
    this.collection = collection;
  }

  async create(data) {
    data.status = "pending";
    data.createdAt = new Date();
    return await this.collection.insertOne(data);
  }

  async findAll() {
    return await this.collection.find().sort({ createdAt: -1 }).toArray();
  }

  async updateStatus(id, status) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }
}

module.exports = LibrarianRequestModel;
