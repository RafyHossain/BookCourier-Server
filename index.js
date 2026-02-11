const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/database');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('BookCourier Server Running');
});

async function startServer() {
    const { collections } = await connectDB();

    // later we will pass collections to routes

    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
}

startServer();
