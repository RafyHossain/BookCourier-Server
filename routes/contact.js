const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/contactController");

module.exports = (models) => {
  const controller = new ContactController(models);

  router.post("/", (req, res) => controller.saveMessage(req, res));

  return router;
};