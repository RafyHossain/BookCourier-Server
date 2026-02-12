const { ObjectId } = require("mongodb");

class OrderModel {
  constructor(collection) {
    this.collection = collection;
  }

  async create(orderData) {
    const newOrder = {
      ...orderData,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date(),
    };

    return await this.collection.insertOne(newOrder);
  }

  async findByUser(email) {
    return await this.collection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async cancelOrder(id) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "cancelled" } }
    );
  }
}

module.exports = OrderModel;
