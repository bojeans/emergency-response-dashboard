import express from "express";
import { executeQuery } from "../config/db.js";
import sql from "mssql";
import { generateToken } from "../utils/auth.js";

const router = express.Router();

router.get("/incidents", async (req, res) => {
  try {
    const query = "SELECT * FROM Incidents";
    const incidents = await executeQuery(query);
    res.json(incidents);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const query =
      "SELECT * FROM Users WHERE Email = @Email AND Password = @Password";
    const params = [
      { name: "Email", type: sql.VarChar, value: email },
      { name: "Password", type: sql.VarChar, value: password },
    ];
    const users = await executeQuery(query, params);
    if (users.length > 0) {
      const token = generateToken(users[0]); // Implement your token generation logic
      res.json({ token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});

export default router;
