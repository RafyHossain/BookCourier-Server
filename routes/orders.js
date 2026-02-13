const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const OrderController = require("../controllers/orderController");

module.exports = (models) => {
  const orderController = new OrderController(models);

  router.post(
    "/",
    verifyToken,
    (req, res) => orderController.createOrder(req, res)
  );

  router.get(
    "/my-orders",
    verifyToken,
    (req, res) => orderController.getMyOrders(req, res)
  );

  router.get(
    "/check/:bookId",
    verifyToken,
    (req, res) => orderController.checkUserOrder(req, res)
  );

  router.patch(
    "/cancel/:id",
    verifyToken,
    (req, res) => orderController.cancelOrder(req, res)
  );

  router.patch(
    "/pay/:id",
    verifyToken,
    (req, res) => orderController.payOrder(req, res)
  );

  // 🔥 LIBRARIAN ROUTES
  router.get(
    "/librarian-orders",
    verifyToken,
    (req, res) => orderController.getLibrarianOrders(req, res)
  );

  router.patch(
    "/librarian-orders/:id",
    verifyToken,
    (req, res) => orderController.updateOrderStatus(req, res)
  );

  return router;
};
