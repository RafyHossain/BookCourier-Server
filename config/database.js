const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.emedy2q.mongodb.net/?appName=Cluster0`;



const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectDB() {
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);

        console.log("✅ MongoDB Connected Successfully");

        return {
            db,
            collections: {
                users: db.collection('users'),
                books: db.collection('books'),
                orders: db.collection('orders'),
                payments: db.collection('payments'),
                reviews: db.collection('reviews'),
                wishlists: db.collection('wishlists')
            }
        };
    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
        process.exit(1);
    }
}

module.exports = { connectDB };
