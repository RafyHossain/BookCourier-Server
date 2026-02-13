class ReviewController {
  constructor(models) {
    this.Review = models.Review;
    this.Order = models.Order;
  }

  // ================= ADD REVIEW =================
  async addReview(req, res) {
    try {
      const { bookId, rating, comment } = req.body;
      const userEmail = req.user.email;

      // Check if user ordered this book
      const order = await this.Order.collection.findOne({
        bookId,
        userEmail,
        status: { $ne: "cancelled" }
      });

      if (!order) {
        return res.status(403).send({
          message: "You must order this book to review"
        });
      }

      // Prevent duplicate review
      const existing = await this.Review.collection.findOne({
        bookId,
        userEmail
      });

      if (existing) {
        return res.status(400).send({
          message: "You already reviewed this book"
        });
      }

      await this.Review.collection.insertOne({
        bookId,
        rating,
        comment,
        userEmail,
        createdAt: new Date()
      });

      res.send({ message: "Review added successfully" });

    } catch (error) {
      res.status(500).send({ message: "Review failed" });
    }
  }

  // ================= GET REVIEWS =================
  async getBookReviews(req, res) {
    try {
      const { bookId } = req.params;

      const reviews = await this.Review.collection
        .find({ bookId })
        .sort({ createdAt: -1 })
        .toArray();

      res.send(reviews);

    } catch (error) {
      res.status(500).send({ message: "Failed to fetch reviews" });
    }
  }
}

module.exports = ReviewController;
