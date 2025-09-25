const express = require("express");
const sql = require("mssql");

const router = express.Router();

// GET Machine Wise Data
// Example: /api/machinewise?mode=DAY&startDate=2025-09-01&endDate=2025-09-22&stationId=3
router.get("/machinewise", async (req, res) => {
  try {
    const { mode, startDate, endDate, stationId } = req.query;

    // Run Stored Procedure
    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("Mode", sql.VarChar(20), mode || "SHIFT")
      .input("StartDate", sql.Date, startDate || null)
      .input("EndDate", sql.Date, endDate || null)
      .input("StationID", sql.Int, stationId || null)
      .execute("sp_GetMachineWiseDataDashboard");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching machine wise data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching machine wise data",
      error: error.message,
    });
  }
});


// GET Machine oee Data
router.get("/machineoee", async (req, res) => {
  try {
    const { mode, startDate, endDate, EquipmentName } = req.query;

    // Run Stored Procedure
    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("Mode", sql.VarChar(20), mode || "SHIFT")
      .input("StartDate", sql.Date, startDate || null)
      .input("EndDate", sql.Date, endDate || null)
      .input("EquipmentName", sql.NVarChar(100), EquipmentName || null)
      .execute("sp_GetMachineOEE");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching machine Oee Data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching machine Oee data",
      error: error.message,
    });
  }
});

// GET Machine Times Data

router.get("/machineTimes", async (req, res) => {
  try {
    const { mode, startDate, endDate, EquipmentName } = req.query;

    // Run Stored Procedure
    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("Mode", sql.VarChar(20), mode || "SHIFT")
      .input("StartDate", sql.Date, startDate || null)
      .input("EndDate", sql.Date, endDate || null)
      .input("EquipmentName", sql.NVarChar(100), EquipmentName || null)
      .execute("sp_GetMachineTimes");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching machine times Data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching machine times data",
      error: error.message,
    });
  }
});
module.exports = router;
