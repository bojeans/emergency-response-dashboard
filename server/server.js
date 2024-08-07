import express from "express";
import apiRoutes from "./routes/api.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API routes
app.use("/api", apiRoutes);

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, "..", "client")));

// Serve the dashboard.html file from the client directory
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dashboard.html"));
});

// Serve the index.html file from the client directory
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
