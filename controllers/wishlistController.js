const { ObjectId } = require("mongodb");

class WishlistController {
  constructor(models) {
    this.Wishlist = models.Wishlist;
    this.Book = models.Book;
  }

  async addToWishlist(req, res) {
    try {
      const { bookId } = req.body;
      const userEmail = req.user.email;

      if (!bookId) {
        return res.status(400).send({ message: "BookId required" });
      }

      const existing = await this.Wishlist.collection.findOne({
        bookId,
        userEmail
      });

      if (existing) {
        return res.status(400).send({
          message: "Already in wishlist"
        });
      }

      await this.Wishlist.collection.insertOne({
        bookId,
        userEmail,
        createdAt: new Date()
      });

      res.send({ message: "Added to wishlist" });

    } catch (error) {
      console.log("Wishlist Error:", error);
      res.status(500).send({ message: "Wishlist failed" });
    }
  }

  async getMyWishlist(req, res) {
    try {
      const userEmail = req.user.email;

      const wishlist = await this.Wishlist.collection
        .find({ userEmail })
        .toArray();

      const books = await Promise.all(
        wishlist.map(item =>
          this.Book.collection.findOne({
            _id: new ObjectId(item.bookId)
          })
        )
      );

      res.send(books.filter(Boolean));

    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Fetch failed" });
    }
  }

  async removeFromWishlist(req, res) {
    try {
      const { id } = req.params;
      const userEmail = req.user.email;

      await this.Wishlist.collection.deleteOne({
        bookId: id,
        userEmail
      });

      res.send({ message: "Removed" });

    } catch (error) {
      res.status(500).send({ message: "Remove failed" });
    }
  }
}

module.exports = WishlistController;
