const { ObjectId } = require("mongodb");

class OrderModel {
  constructor(collection) {
    this.collection = collection;
  }

  //  Create Order
  async create(orderData) {
    const newOrder = {
      ...orderData,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date(),
    };

    return await this.collection.insertOne(newOrder);
  }

  //  Get Orders by User
  async findByUser(email) {
    return await this.collection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();
  }

  //  Cancel Order
  async cancelOrder(id) {
  return await this.collection.updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: { 
        status: "cancelled",
        paymentStatus: "cancelled"
      } 
    }
  );
}


  // 🔹 Mark Order As Paid
  async markAsPaid(id, paymentId) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          paymentStatus: "paid",
          paymentId: paymentId,
          paidAt: new Date()
        } 
      }
    );
  }
}

module.exports = OrderModel;
