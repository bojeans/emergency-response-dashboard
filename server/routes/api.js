import express from "express";
const router = express.Router();

// Define a simple route
try {
  router.get("/hello", (req, res) => {
    res.json({ message: "Hello, world!" });
  });
} catch (error) {
  console.log(error);
}

export default router;
