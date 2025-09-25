const express = require("express");
const sql = require("mssql");

const router = express.Router();

// GET Machine Times Data

router.get("/plantTimes", async (req, res) => {
  try {
    const { mode, startDate, endDate,  } = req.query;

    // Run Stored Procedure
    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("Mode", sql.VarChar(20), mode || "SHIFT")
      .input("StartDate", sql.Date, startDate || null)
      .input("EndDate", sql.Date, endDate || null)
      .execute("sp_GetPlantTimes");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching plant times Data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching plant times data",
      error: error.message,
    });
  }
});

module.exports = router;