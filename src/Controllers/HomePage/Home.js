const express = require("express");
const sql = require("mssql");




const router = express.Router();

//  Plant OEE API
router.get("/plantOEE", async (req, res) => {
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
      .execute("sp_Get_Plant_OEE");   // or sp_Get_Plant_OEE if that's the correct name

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching plant OEE data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching plant OEE data",
      error: error.message,
    });
  }
});

//Get the Plan and actual qty acc to filter
router.get("/GetPlanActualQty", async (req, res) => {
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
      .execute("sp_Dashboard_Get_plan_ActualQty");   // or sp_Get_Plant_OEE if that's the correct name

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching plan Actual Qty data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching plan Actual Qty data",
      error: error.message,
    });
  }
});


//Get the Ok and Total qty acc to filter
router.get("/GetOKTotalQty", async (req, res) => {
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
      .execute("sp_Dashboard_Get_OK_TotalQty");   // or sp_Get_Plant_OEE if that's the correct name

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching OK and Total Qty data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching OK and Total  Qty data",
      error: error.message,
    });
  }
});


module.exports = router;