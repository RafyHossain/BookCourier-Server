const { ObjectId } = require("mongodb");

class WishlistModel {
  constructor(collection) {
    this.collection = collection;
  }

  async add(bookId, userEmail) {
    const existing = await this.collection.findOne({
      bookId,
      userEmail
    });

    if (existing) {
      throw new Error("Already in wishlist");
    }

    return await this.collection.insertOne({
      bookId,
      userEmail,
      createdAt: new Date()
    });
  }

  async getUserWishlist(userEmail) {
    return await this.collection
      .find({ userEmail })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async remove(bookId, userEmail) {
    return await this.collection.deleteOne({
      bookId,
      userEmail
    });
  }
}

module.exports = WishlistModel;
