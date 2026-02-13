const { ObjectId } = require("mongodb");

class OrderController {
  constructor(models) {
    this.Order = models.Order;
    this.Book = models.Book;
  }

  // ================= CREATE ORDER =================
  async createOrder(req, res) {
    try {
      const { bookId, phone, address, name } = req.body;
      const userEmail = req.user.email;

      const book = await this.Book.collection.findOne({
        _id: new ObjectId(bookId),
      });

      if (!book) {
        return res.status(404).send({ message: "Book not found" });
      }

      const existingOrder = await this.Order.collection.findOne({
        bookId,
        userEmail,
        status: { $ne: "cancelled" }
      });

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
        bookOwner: book.librarianEmail, // ✅ FIXED
      };

      const result = await this.Order.create(orderData);

      res.status(201).send(result);

    } catch (error) {
      res.status(500).send({ message: "Order failed" });
    }
  }

  // ================= USER ORDERS =================
  async getMyOrders(req, res) {
    try {
      const userEmail = req.user.email;
      const orders = await this.Order.findByUser(userEmail);
      res.send(orders);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch orders" });
    }
  }

  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      await this.Order.cancelOrder(id);
      res.send({ message: "Order cancelled" });
    } catch (error) {
      res.status(500).send({ message: "Cancel failed" });
    }
  }

  async payOrder(req, res) {
    try {
      const { id } = req.params;
      const userEmail = req.user.email;

      const order = await this.Order.collection.findOne({
        _id: new ObjectId(id),
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
        bookId,
        userEmail,
        status: { $ne: "cancelled" }
      });

      res.send(order ? true : false);

    } catch (error) {
      res.status(500).send({ message: "Failed to check order" });
    }
  }

  // ================= LIBRARIAN ORDERS =================
  async getLibrarianOrders(req, res) {
    try {
      const email = req.user.email;

      const orders = await this.Order.collection
        .find({ bookOwner: email })
        .sort({ createdAt: -1 })
        .toArray();

      res.send(orders);

    } catch (error) {
      res.status(500).send({ message: "Failed to fetch librarian orders" });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await this.Order.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );

      res.send({ message: "Order status updated" });

    } catch (error) {
      res.status(500).send({ message: "Status update failed" });
    }
  }

  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const email = req.user.email;

      const order = await this.Order.collection.findOne({
        _id: new ObjectId(id),
        bookOwner: email
      });

      if (!order) {
        return res.status(403).send({
          message: "Unauthorized action"
        });
      }

      await this.Order.collection.deleteOne({
        _id: new ObjectId(id)
      });

      res.send({ message: "Order deleted successfully" });

    } catch (error) {
      res.status(500).send({
        message: "Delete failed"
      });
    }
  }
}

module.exports = OrderController;
