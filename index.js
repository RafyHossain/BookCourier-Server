const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/database');
const { verifyToken } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5000;

// Basic middlewares
app.use(cors());
app.use(express.json());


// Just a simple check to see if server is alive
app.get('/', (req, res) => {
    res.send('📚 BookCourier server is running...');
});


// This route is protected
// Only users with a valid Firebase token can access this
app.get('/protected', verifyToken, (req, res) => {
    res.send({
        message: "You have accessed a protected route 🎉",
        loggedInUser: req.decodedEmail
    });
});


// Starting the server after DB connection
async function startServer() {
    try {
        // Connect to MongoDB first
        await connectDB();

        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });

    } catch (error) {
        console.error("Server failed to start:", error);
        process.exit(1);
    }
}

startServer();
