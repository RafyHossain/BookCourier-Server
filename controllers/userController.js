class UserController {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async saveUser(req, res) {
    try {
      const userData = req.body;

      const existingUser = await this.userModel.findByEmail(userData.email);

      if (existingUser) {
        return res.send(existingUser);
      }

      const result = await this.userModel.create(userData);
      res.send(result);

    } catch (error) {
      res.status(500).send({ message: "Failed to save user" });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.userModel.findAll();
      res.send(users);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch users" });
    }
  }


 async updateProfile(req, res) {
  try {
    const email = req.user.email;
    const { name, photoURL } = req.body;

    const result = await this.userModel.updateProfile(email, name, photoURL);

    res.send({ message: "Profile updated" });

  } catch (error) {
    res.status(500).send({ message: "Profile update failed" });
  }
}



  async updateUserRole(req, res) {
    try {
      const { email } = req.params;
      const { role } = req.body;

      if (!["admin", "librarian", "user"].includes(role)) {
        return res.status(400).send({ message: "Invalid role" });
      }

      await this.userModel.updateRole(email, role);

      res.send({
        message: `User role updated to ${role}`,
      });

    } catch (error) {
      res.status(500).send({ message: "Failed to update role" });
    }
  }

  async makeAdmin(req, res) {
    try {
      const { email } = req.params;

      await this.userModel.updateRole(email, "admin");

      res.send({
        message: "User promoted to Admin",
      });

    } catch (error) {
      res.status(500).send({ message: "Failed to promote to admin" });
    }
  }

  async makeLibrarian(req, res) {
    try {
      const { email } = req.params;

      await this.userModel.updateRole(email, "librarian");

      res.send({
        message: "User promoted to Librarian",
      });

    } catch (error) {
      res.status(500).send({ message: "Failed to promote to librarian" });
    }
  }

  async getUserRole(req, res) {
    try {
      const { email } = req.params;

      const user = await this.userModel.findByEmail(email);

      res.send({
        role: user?.role || "user",
      });

    } catch (error) {
      res.status(500).send({
        message: "Error fetching role",
      });
    }
  }
}

module.exports = UserController;
