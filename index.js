const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDatabase } = require("./config/database");
const { initializeModels } = require("./models");

// Routes Imports
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const librarianRequestRoutes = require("./routes/librarianRequests");
const wishlistRoutes = require("./routes/wishlist");
const reviewRoutes = require("./routes/reviews"); // 🔥 Added Review Routes

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

  // Attach models to request object (optional, if you use it in middleware)
  app.use((req, res, next) => {
    req.models = models;
    next();
  });

  // Use Routes
  app.use("/users", userRoutes(models));
  app.use("/books", bookRoutes(models));
  app.use("/orders", orderRoutes(models));
  app.use("/librarian-requests", librarianRequestRoutes(models));
  app.use("/wishlist", wishlistRoutes(models));
  app.use("/reviews", reviewRoutes(models)); // 🔥 Enabled Review Routes

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

startServer();