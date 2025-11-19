require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/database");
const http = require('http');
const config = require('./config/config');
const startWSServer = require('./wsServer');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/adminRoutes"));
app.use('/api/baseip', require("./routes/base_IPRoutes"));
app.use('/api/robot', require("./routes/index"));

// Create a single HTTP server to handle both Express and WebSockets
const server = http.createServer(app);

// Initialize the WebSocket server on the single HTTP server
const wss = startWSServer(server);

// Start the one and only server
server.listen(config.server.port, () => {
    const port = config.server.port;
    console.log(`Backend listening on port ${port}`);
    console.log(`Server running on port ${port}`);
});

sequelize
    .sync({ alter: true }) // Updates tables without dropping data
    .then(() => console.log("✅ Database & tables synced successfully!"))
    .catch((err) => console.error("❌ Error syncing database:", err));