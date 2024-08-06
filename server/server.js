import express from "express";
import apiRoutes from "./routes/api.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Use API routes
app.use(apiRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
