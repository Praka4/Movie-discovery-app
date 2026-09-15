// 1. Load environment variables first
require('dotenv').config();

// 2. Print connection status to verify it's working
console.log("Your URI is:", process.env.MONGODB_URI);

// 3. Import your modules and local files in the correct sequence
const express = require('express');
const app = require("./src/app");
const connectDatabase = require("./src/config/database");

const PORT = process.env.PORT || 5000;

// 4. Start the server connection lifecycle
const startServer = async () => {
    try {
        await connectDatabase();
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start the server database connection:", error);
        process.exit(1);
    }
};

startServer();