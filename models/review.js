const { ObjectId } = require("mongodb");

class ReviewModel {
  constructor(collection) {
    this.collection = collection;
  }

  async add(reviewData) {
    return await this.collection.insertOne({
      ...reviewData,
      createdAt: new Date()
    });
  }

  async getByBook(bookId) {
    return await this.collection
      .find({ bookId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async alreadyReviewed(bookId, userEmail) {
    return await this.collection.findOne({
      bookId,
      userEmail
    });
  }
}

module.exports = ReviewModel;
