import express from "express";

const router = express.Router();

// login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt: ${email} / ${password}`);

  if (email === "admin@example.com" && password === "password") {
    console.log("Login successful");
    res.json({ success: true });
  } else {
    console.log("Login failed");
    res.json({ success: false });
  }
});

// logout
router.post("/logout", (req, res) => {
  console.log("Logout requested");
  res.json({ success: true });
});

export default router;
