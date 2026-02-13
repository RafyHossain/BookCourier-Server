const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const OrderController = require("../controllers/orderController");

module.exports = (models) => {
  const orderController = new OrderController(models);

  // Place Order
  router.post(
    "/",
    verifyToken,
    (req, res) => orderController.createOrder(req, res)
  );

  // Get My Orders
  router.get(
    "/my-orders",
    verifyToken,
    (req, res) => orderController.getMyOrders(req, res)
  );

  // Check if User Ordered a Book
  router.get(
    "/check/:bookId",
    verifyToken,
    (req, res) => orderController.checkUserOrder(req, res)
  );

  // Cancel Order
  router.patch(
    "/cancel/:id",
    verifyToken,
    (req, res) => orderController.cancelOrder(req, res)
  );

  // Pay for Order
  router.patch(
    "/pay/:id",
    verifyToken,
    (req, res) => orderController.payOrder(req, res)
  );

  // ================= LIBRARIAN ROUTES =================

  // Get Orders for Librarian's Books
  router.get(
    "/librarian-orders",
    verifyToken,
    (req, res) => orderController.getLibrarianOrders(req, res)
  );

  // Update Order Status (e.g., pending -> delivered)
  router.patch(
    "/librarian-orders/:id",
    verifyToken,
    (req, res) => orderController.updateOrderStatus(req, res)
  );

  // Delete Order
  router.delete(
    "/librarian-orders/:id",
    verifyToken,
    (req, res) => orderController.deleteOrder(req, res)
  );

  return router;
};