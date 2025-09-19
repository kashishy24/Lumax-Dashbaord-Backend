const express = require("express");
const router = express.Router();
const { sql } = require("../database/db");

// 1. Get user by username

router.get("/username", async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query(
      "SELECT DISTINCT Username FROM Config_User"
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(result.recordset);  // ✅ return all rows
  } catch (err) {
    console.error("Error in GET /username", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 2. Login
router.post("/Userlogin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .query(
        "SELECT UserID, Username FROM Config_User WHERE Username = @username AND Password = @password"
      );

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: result.recordset[0],
    });
  } catch (err) {
    console.error("Error in POST /Userlogin", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
