const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDatabase } = require("./config/database");
const { initializeModels } = require("./models");
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const librarianRequestRoutes = require("./routes/librarianRequests");



const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("📚 BookCourier server running");
});

async function startServer() {
  const { collections } = await connectDatabase();

  const models = initializeModels(collections);

  app.use((req, res, next) => {
    req.models = models;
    next();
  });

  app.use("/users", userRoutes(models));
  app.use("/books", bookRoutes(models));
  app.use("/orders", orderRoutes(models));
  app.use("/librarian-requests", librarianRequestRoutes(models));



  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

startServer();
