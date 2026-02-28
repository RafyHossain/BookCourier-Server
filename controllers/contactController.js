class ContactController {
  constructor(models) {
    // Assuming we pass the db directly or a Contact model
    this.Contact = models.Contact; 
  }

  async saveMessage(req, res) {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).send({ message: "Name, email and message are required" });
      }

      const newContact = {
        name,
        email,
        subject,
        message,
        createdAt: new Date(),
        status: "unread"
      };

      const result = await this.Contact.collection.insertOne(newContact);
      res.status(201).send({ message: "Message sent successfully!", result });

    } catch (error) {
      console.log("Contact Error:", error);
      res.status(500).send({ message: "Failed to send message" });
    }
  }
}

module.exports = ContactController;