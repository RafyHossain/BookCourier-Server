class OrderController {
  constructor(models) {
    this.Order = models.Order;
    this.Book = models.Book;
  }

  //  Create Order
async createOrder(req, res) {
  try {
    const { bookId, phone, address, name } = req.body;
    const userEmail = req.user.email;

    const book = await this.Book.findById(bookId);

    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }

    const existingOrder = await this.Order.findActiveOrder(bookId, userEmail);

    if (existingOrder) {
      return res.status(400).send({
        message: "You already ordered this book",
      });
    }

    const orderData = {
      bookId,
      bookTitle: book.title,
      price: book.price,
      userEmail,
      name,
      phone,
      address,
    };

    const result = await this.Order.create(orderData);

    res.status(201).send(result);

  } catch (error) {
    res.status(500).send({ message: "Order failed" });
  }
}

  //  Get My Orders
  async getMyOrders(req, res) {
    try {
      const userEmail = req.user.email;
      const orders = await this.Order.findByUser(userEmail);
      res.send(orders);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch orders" });
    }
  }

  //  Cancel Order
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;

      await this.Order.cancelOrder(id);

      res.send({ message: "Order cancelled" });

    } catch (error) {
      res.status(500).send({ message: "Cancel failed" });
    }
  }


  

  //  Pay Order  
  async payOrder(req, res) {
    try {
      const { id } = req.params;
      const userEmail = req.user.email;

      // Optional safety check 
      const order = await this.Order.collection.findOne({
        _id: new (require("mongodb").ObjectId)(id),
        userEmail,
        paymentStatus: "unpaid"
      });

      if (!order) {
        return res.status(404).send({ message: "Order not found or already paid" });
      }

      const paymentId = "PAY_" + Date.now();

      await this.Order.markAsPaid(id, paymentId);

      res.send({
        message: "Payment successful",
        paymentId
      });

    } catch (error) {
      res.status(500).send({ message: "Payment failed" });
    }
  }

 async checkUserOrder(req, res) {
  try {
    const { bookId } = req.params;
    const userEmail = req.user.email;

    const order = await this.Order.collection.findOne({
      bookId: bookId,
      userEmail: userEmail,
      status: { $ne: "cancelled" }
    });

    res.send(order ? true : false);

  } catch (error) {
    res.status(500).send({ message: "Failed to check order" });
  }
}


}

module.exports = OrderController;
