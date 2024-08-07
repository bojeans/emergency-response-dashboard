import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt: ${email} / ${password}`);

  // Simulate authentication logic
  if (email === "admin@example.com" && password === "password") {
    console.log("Login successful");
    res.json({ success: true });
  } else {
    console.log("Login failed");
    res.json({ success: false });
  }
});

export default router;
