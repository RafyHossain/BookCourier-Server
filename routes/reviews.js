const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const ReviewController = require("../controllers/reviewController");

module.exports = (models) => {
  const controller = new ReviewController(models);

  // Add Review (Only ordered users)
  router.post(
    "/",
    verifyToken,
    (req, res) => controller.addReview(req, res)
  );

  // Get Reviews by Book
  router.get(
    "/:bookId",
    (req, res) => controller.getBookReviews(req, res)  
  );

  return router;
};
