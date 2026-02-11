const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function connectDatabase() {
  await client.connect();
  console.log("✅ MongoDB Connected");

  const db = client.db("bookCourierDB");

  return {
    db,
    collections: {
      users: db.collection("users"),
       books: db.collection("books"),
    },
  };
}

module.exports = { connectDatabase };
