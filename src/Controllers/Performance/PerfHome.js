const express = require("express");
const sql = require("mssql");




const router = express.Router();

//Get the good and rejected  qty acc to filter
router.get("/GetGoodRejectedQty", async (req, res) => {
  try {
    const { mode, startDate, endDate } = req.query;

    // Connect to DB
    const pool = await sql.connect();

    // Call stored procedure
    const result = await pool
      .request()
      .input("Mode", sql.VarChar(20), mode || "SHIFT")  // default SHIFT
      .input("StartDate", sql.Date, startDate || null)
      .input("EndDate", sql.Date, endDate || null)
      .execute("sp_Dashboard_Get_Good_RejectedQty");   // or sp_Get_Plant_OEE if that's the correct name

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching good and rejected Qty data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching good and rejected  data",
      error: error.message,
    });
  }
});


//Get the Total Time and Downtimeacc to filter
router.get("/GetTotalandDownTime", async (req, res) => {
  try {
    const { mode, startDate, endDate } = req.query;

    // Connect to DB
    const pool = await sql.connect();

    // Call stored procedure
    const result = await pool
      .request()
      .input("Mode", sql.VarChar(20), mode || "SHIFT")  // default SHIFT
      .input("StartDate", sql.Date, startDate || null)
      .input("EndDate", sql.Date, endDate || null)
      .execute("sp_Dashboard_Get_TotalTime_and_Dt");   // or sp_Get_Plant_OEE if that's the correct name

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching good and rejected Qty data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching good and rejected  data",
      error: error.message,
    });
  }
});


//Performance Machine Card Data same api is using on home page also for card

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

module.exports = router;