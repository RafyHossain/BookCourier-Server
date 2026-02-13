const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const WishlistController = require("../controllers/wishlistController");

module.exports = (models) => {
  const controller = new WishlistController(models);

  router.post(
    "/",
    verifyToken,
    (req, res) => controller.addToWishlist(req, res)
  );

  router.get(
    "/my",
    verifyToken,
    (req, res) => controller.getMyWishlist(req, res)
  );

  router.delete(
    "/:id",
    verifyToken,
    (req, res) => controller.removeFromWishlist(req, res)
  );

  return router;
};
