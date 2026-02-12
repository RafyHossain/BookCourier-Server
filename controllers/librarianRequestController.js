class LibrarianRequestController {
  constructor(models) {
    this.Request = models.LibrarianRequest;
    this.User = models.User;
  }

  async sendRequest(req, res) {
    try {
      const email = req.decodedEmail;

      const existing = await this.Request.findByEmail(email);

      if (existing) {
        return res.send({ message: "Request already exists" });
      }

      const result = await this.Request.create({
        email,
      });

      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async getAllRequests(req, res) {
    try {
      const requests = await this.Request.findAll();
      res.send(requests);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async approveRequest(req, res) {
    try {
      const id = req.params.id;

      const request = await this.Request.collection.findOne({
        _id: new (require("mongodb").ObjectId)(id),
      });

      await this.User.updateRole(request.email, "librarian");
      await this.Request.updateStatus(id, "approved");

      res.send({ message: "Approved" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

module.exports = LibrarianRequestController;
