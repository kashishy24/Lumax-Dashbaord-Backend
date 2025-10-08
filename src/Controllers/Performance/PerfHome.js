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


//Get the   OEE Trend

// ✅ API Endpoint: /api/PerformanceHome/GetOEETrend
router.get("/GetOEETrend", async (req, res) => {
  const { Mode, StartDate, EndDate } = req.query;

  try {
    // Basic validation
    if (!Mode) {
      return res.status(400).json({ success: false, message: "Mode is required" });
    }

    // Connect to SQL
    const pool = await sql.connect();

    // Execute stored procedure
    const result = await pool
      .request()
      .input("Mode", sql.VarChar(20), Mode)
      .input("StartDate", sql.Date, StartDate || null)
      .input("EndDate", sql.Date, EndDate || null)
      .execute("sp_Get_Plant_OEE_Trend");

    // Return the data
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error executing SP:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


//Get the   Availability  Trend

router.get("/GetAvailabilityTrend", async (req, res) => {
  const { Mode, StartDate, EndDate } = req.query;

  try {
    // Basic validation
    if (!Mode) {
      return res.status(400).json({ success: false, message: "Mode is required" });
    }

    // Connect to SQL
    const pool = await sql.connect();

    // Execute stored procedure
    const result = await pool
      .request()
      .input("Mode", sql.VarChar(20), Mode)
      .input("StartDate", sql.Date, StartDate || null)
      .input("EndDate", sql.Date, EndDate || null)
      .execute("sp_Get_Plant_Availability_DTandTotalTime_Trend");

    // Return the data
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error executing SP:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


//Get the   Performance  Trend
router.get("/GetPerformanceTrend", async (req, res) => {
  const { Mode, StartDate, EndDate } = req.query;

  try {
    // Basic validation
    if (!Mode) {
      return res.status(400).json({ success: false, message: "Mode is required" });
    }

    // Connect to SQL
    const pool = await sql.connect();

    // Execute stored procedure
    const result = await pool
      .request()
      .input("Mode", sql.VarChar(20), Mode)
      .input("StartDate", sql.Date, StartDate || null)
      .input("EndDate", sql.Date, EndDate || null)
      .execute("sp_Get_Plant_Perf_Qty_Trend");

    // Return the data
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error executing SP:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

//Get the   Quantity  Trend
router.get("/GetQualityTrend", async (req, res) => {
  const { Mode, StartDate, EndDate } = req.query;

  try {
    // Basic validation
    if (!Mode) {
      return res.status(400).json({ success: false, message: "Mode is required" });
    }

    // Connect to SQL
    const pool = await sql.connect();

    // Execute stored procedure
    const result = await pool
      .request()
      .input("Mode", sql.VarChar(20), Mode)
      .input("StartDate", sql.Date, StartDate || null)
      .input("EndDate", sql.Date, EndDate || null)
      .execute("sp_Get_Plant_Quantity_GoodRejected_Trend");

    // Return the data
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error executing SP:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

//Get Hourly expected and actual trend
router.get("/GetHourlyExpActualQtyTrend", async (req, res) => {
  const { Mode, StartDate, EndDate, EquipmentID } = req.query; // ✅ Added EquipmentID

  try {
    // Basic validation
    if (!Mode) {
      return res.status(400).json({ success: false, message: "Mode is required" });
    }

    // Connect to SQL
    const pool = await sql.connect();

    // Execute stored procedure
    const request = pool.request()
      .input("Mode", sql.VarChar(20), Mode)
      .input("StartDate", sql.Date, StartDate || null)
      .input("EndDate", sql.Date, EndDate || null);

    // ✅ Add EquipmentID only if provided (and matches NVARCHAR(50))
    if (EquipmentID) {
      request.input("EquipmentID", sql.NVarChar(50), EquipmentID);
    } else {
      request.input("EquipmentID", sql.NVarChar(50), null);
    }

    const result = await request.execute("sp_Get_Machine_Hourly_ExpActual_Trend");

    // Return the data
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error executing SP:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});



//Get Hourly total and rejected trend
router.get("/GetHourlyTotalRejectedQtyTrend", async (req, res) => {
  const { Mode, StartDate, EndDate, EquipmentID } = req.query; // ✅ Added EquipmentID

  try {
    // Basic validation
    if (!Mode) {
      return res.status(400).json({ success: false, message: "Mode is required" });
    }

    // Connect to SQL
    const pool = await sql.connect();

    // Execute stored procedure
    const request = pool.request()
      .input("Mode", sql.VarChar(20), Mode)
      .input("StartDate", sql.Date, StartDate || null)
      .input("EndDate", sql.Date, EndDate || null);

    // ✅ Add EquipmentID only if provided (and matches NVARCHAR(50))
    if (EquipmentID) {
      request.input("EquipmentID", sql.NVarChar(50), EquipmentID);
    } else {
      request.input("EquipmentID", sql.NVarChar(50), null);
    }

    const result = await request.execute("sp_Get_Machine_Hourly_TotalRejected_Trend");

    // Return the data
    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error executing SP:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
// Get the Rework quantity according to reason

router.get("/GetReworkQtyandReasonChart", async (req, res) => {
  const { Mode, StartDate, EndDate, EquipmentID } = req.query;

  try {
    if (!Mode) {
      return res.status(400).json({ success: false, message: "Mode is required" });
    }

    const pool = await sql.connect();

    const request = pool.request()
      .input("Mode", sql.VarChar(20), Mode)
      .input("StartDate", sql.Date, StartDate || null)
      .input("EndDate", sql.Date, EndDate || null)
      .input("EquipmentID", sql.NVarChar(50), EquipmentID || null);

    const result = await request.execute("sp_Get_Rework_Reason_Trend");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error executing SP:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


module.exports = router;