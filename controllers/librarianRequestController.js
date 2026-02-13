const { ObjectId } = require("mongodb");

class LibrarianRequestController {
  constructor(models) {
    this.Request = models.LibrarianRequest;
    this.User = models.User;
  }

  async sendRequest(req, res) {
    try {
      const email = req.user.email;

      const existing = await this.Request.findByEmail(email);

      if (existing) {
        return res.status(400).send({
          message: "Request already exists",
        });
      }

      const result = await this.Request.create({ email });

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
        _id: new ObjectId(id),
      });

      if (!request) {
        return res.status(404).send({ message: "Request not found" });
      }

      await this.User.updateRole(request.email, "librarian");

      await this.Request.updateStatus(id, "approved");

      res.send({ message: "Approved successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async deleteRequest(req, res) {
  try {
    const id = req.params.id;

    await this.Request.collection.deleteOne({
      _id: new ObjectId(id),
    });

    res.send({ message: "Request deleted" });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

}

module.exports = LibrarianRequestController;
