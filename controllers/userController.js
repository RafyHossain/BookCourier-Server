class UserController {
  constructor(models) {
    this.User = models.User;
  }

  async saveUser(req, res) {
    try {
      const { name, email, photoURL } = req.body;

      const existingUser = await this.User.findByEmail(email);

      if (existingUser) {
        return res.send({ message: "User already exists" });
      }

      const result = await this.User.create({
        name,
        email,
        photoURL,
      });

      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

module.exports = UserController;
