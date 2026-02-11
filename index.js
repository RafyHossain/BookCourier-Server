const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDatabase } = require("./config/database");
const { attachCollections } = require("./middleware/collections");
const { initializeModels } = require("./models");
const { initializeControllers } = require("./controllers");

const userRoutes = require("./routes/users");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("📚 BookCourier server running");
});

async function startServer() {
  const { collections } = await connectDatabase();

  app.use(attachCollections(collections));

  const models = initializeModels(collections);
  const controllers = initializeControllers(models);

  userRoutes(app, controllers);

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

startServer();
