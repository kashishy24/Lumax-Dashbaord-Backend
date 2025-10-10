
const express = require("express");
const sql = require("mssql");




const router = express.Router();


// ✅ Get the Machine Operating and Running Time according to filters (Mode + EquipmentID)
router.get("/GetMachineOperatingRunningTime", async (req, res) => {
  try {
    // Accept case-insensitive query parameters
    const mode = req.query.mode || req.query.Mode || "SHIFT";
    const startDate = req.query.startDate || req.query.StartDate || null;
    const endDate = req.query.endDate || req.query.EndDate || null;
    const equipmentID = req.query.equipmentID || req.query.EquipmentID || null;

    // Convert dates safely
    const startDateVal = startDate ? new Date(startDate) : null;
    const endDateVal = endDate ? new Date(endDate) : null;

    // Connect to SQL Server
    const pool = await sql.connect();

    // Execute stored procedure
    const result = await pool.request()
      .input("Mode", sql.VarChar(20), mode)
      .input("StartDate", sql.Date, startDateVal)
      .input("EndDate", sql.Date, endDateVal)
      .input("EquipmentID", sql.NVarChar(50), equipmentID)
      .execute("sp_Dashboard_Get_Machine_Operating_RunningTime");

    // Return response
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("❌ Error fetching Machine Operating and Running Time:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ✅ Get the Machine Idle Time according to filters (Mode + EquipmentID)
router.get("/GetMachineIdleTime", async (req, res) => {
  try {
    // Accept case-insensitive query parameters
    const mode = req.query.mode || req.query.Mode || "SHIFT";
    const startDate = req.query.startDate || req.query.StartDate || null;
    const endDate = req.query.endDate || req.query.EndDate || null;
    const equipmentID = req.query.equipmentID || req.query.EquipmentID || null;

    // Convert dates safely
    const startDateVal = startDate ? new Date(startDate) : null;
    const endDateVal = endDate ? new Date(endDate) : null;

    // Connect to SQL Server
    const pool = await sql.connect();

    // Execute stored procedure
    const result = await pool.request()
      .input("Mode", sql.VarChar(20), mode)
      .input("StartDate", sql.Date, startDateVal)
      .input("EndDate", sql.Date, endDateVal)
      .input("EquipmentID", sql.NVarChar(50), equipmentID)
      .execute("sp_Get_Machine_IdleTime");

    // Return response
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("❌ Error fetching Machine Idle Time:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ✅ Get the Machine Total DT according to filters (Mode + EquipmentID)
router.get("/GetMachineTotalTime", async (req, res) => {
  try {
    // Accept case-insensitive query parameters
    const mode = req.query.mode || req.query.Mode || "SHIFT";
    const startDate = req.query.startDate || req.query.StartDate || null;
    const endDate = req.query.endDate || req.query.EndDate || null;
    const equipmentID = req.query.equipmentID || req.query.EquipmentID || null;

    // Convert dates safely
    const startDateVal = startDate ? new Date(startDate) : null;
    const endDateVal = endDate ? new Date(endDate) : null;

    // Connect to SQL Server
    const pool = await sql.connect();

    // Execute stored procedure
    const result = await pool.request()
      .input("Mode", sql.VarChar(20), mode)
      .input("StartDate", sql.Date, startDateVal)
      .input("EndDate", sql.Date, endDateVal)
      .input("EquipmentID", sql.NVarChar(50), equipmentID)
      .execute("sp_Dashboard_Get_Machine_TotalDT");

    // Return response
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("❌ Error fetching Machine Total Time:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ✅ Get the Machine No production Time according to filters (Mode + EquipmentID)
router.get("/GetMachineNoProductionTime", async (req, res) => {
  try {
    // Accept case-insensitive query parameters
    const mode = req.query.mode || req.query.Mode || "SHIFT";
    const startDate = req.query.startDate || req.query.StartDate || null;
    const endDate = req.query.endDate || req.query.EndDate || null;
    const equipmentID = req.query.equipmentID || req.query.EquipmentID || null;

    // Convert dates safely
    const startDateVal = startDate ? new Date(startDate) : null;
    const endDateVal = endDate ? new Date(endDate) : null;

    // Connect to SQL Server
    const pool = await sql.connect();

    // Execute stored procedure
    const result = await pool.request()
      .input("Mode", sql.VarChar(20), mode)
      .input("StartDate", sql.Date, startDateVal)
      .input("EndDate", sql.Date, endDateVal)
      .input("EquipmentID", sql.NVarChar(50), equipmentID)
      .execute("sp_Get_Machine_NoProductionTime");

    // Return response
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("❌ Error fetching Machine No production  Time:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = router;