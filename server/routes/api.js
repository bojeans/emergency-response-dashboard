import express from "express";
const router = express.Router();

try {
  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@example.com" && password === "password") {
      res.json({ message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Login failed" });
    }
  });
} catch (error) {
  console.log(error);
}

export default router;
