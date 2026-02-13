class WishlistController {
  constructor(models) {
    this.Wishlist = models.Wishlist;
  }

  async addToWishlist(req, res) {
    try {
      const { bookId } = req.body;
      const userEmail = req.user.email;

      const exists = await this.Wishlist.exists(bookId, userEmail);

      if (exists) {
        return res.status(400).send({ message: "Already added" });
      }

      const result = await this.Wishlist.add({
        bookId,
        userEmail,
      });

      res.status(201).send(result);

    } catch (error) {
      res.status(500).send({ message: "Failed" });
    }
  }

  async getMyWishlist(req, res) {
    try {
      const email = req.user.email;
      const data = await this.Wishlist.findByUser(email);
      res.send(data);
    } catch {
      res.status(500).send({ message: "Failed" });
    }
  }

  async removeFromWishlist(req, res) {
    try {
      await this.Wishlist.remove(req.params.id);
      res.send({ message: "Removed" });
    } catch {
      res.status(500).send({ message: "Failed" });
    }
  }
}

module.exports = WishlistController;
