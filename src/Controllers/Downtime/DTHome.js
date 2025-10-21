
const express = require("express");
const sql = require("mssql");




const router = express.Router();

//Get the Operating Time and Runing Timeacc to filter
router.get("/GetOperatingRunningTime", async (req, res) => {
  try {
    // accept either lower- or upper-case query keys
    const mode = req.query.mode || req.query.Mode || "SHIFT";
    const startDate = req.query.startDate || req.query.StartDate || null;
    const endDate = req.query.endDate || req.query.EndDate || null;

    // convert to Date or pass null
    const startDateVal = startDate ? new Date(startDate) : null;
    const endDateVal = endDate ? new Date(endDate) : null;

    const pool = await sql.connect();
    const result = await pool.request()
      .input("Mode", sql.VarChar(20), mode)
      .input("StartDate", sql.Date, startDateVal)
      .input("EndDate", sql.Date, endDateVal)
      .execute("sp_Dashboard_Get_Operating_RunningTime");

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching Operating and Running Time:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

//Get the Total DT acc to filter
router.get("/GetTotalDowntime", async (req, res) => {
  try {
    // accept either lower- or upper-case query keys
    const mode = req.query.mode || req.query.Mode || "SHIFT";
    const startDate = req.query.startDate || req.query.StartDate || null;
    const endDate = req.query.endDate || req.query.EndDate || null;

    // convert to Date or pass null
    const startDateVal = startDate ? new Date(startDate) : null;
    const endDateVal = endDate ? new Date(endDate) : null;

    const pool = await sql.connect();
    const result = await pool.request()
      .input("Mode", sql.VarChar(20), mode)
      .input("StartDate", sql.Date, startDateVal)
      .input("EndDate", sql.Date, endDateVal)
      .execute("sp_Dashboard_Get_Plant_TotalDT");

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching Downtim Time:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
//Get the Total DT acc to filter
router.get("/GetNoProductionTime", async (req, res) => {
  try {
    // accept either lower- or upper-case query keys
    const mode = req.query.mode || req.query.Mode || "SHIFT";
    const startDate = req.query.startDate || req.query.StartDate || null;
    const endDate = req.query.endDate || req.query.EndDate || null;

    // convert to Date or pass null
    const startDateVal = startDate ? new Date(startDate) : null;
    const endDateVal = endDate ? new Date(endDate) : null;

    const pool = await sql.connect();
    const result = await pool.request()
      .input("Mode", sql.VarChar(20), mode)
      .input("StartDate", sql.Date, startDateVal)
      .input("EndDate", sql.Date, endDateVal)
      .execute("sp_Get_Plant_NoProductionTime");

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching No Prodcution Time:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

//Get the Total Idle Time

router.get("/GetPlantIdleTime", async (req, res) => {
  try {
    // accept either lower- or upper-case query keys
    const mode = req.query.mode || req.query.Mode || "SHIFT";
    const startDate = req.query.startDate || req.query.StartDate || null;
    const endDate = req.query.endDate || req.query.EndDate || null;

    // convert to Date or pass null
    const startDateVal = startDate ? new Date(startDate) : null;
    const endDateVal = endDate ? new Date(endDate) : null;

    const pool = await sql.connect();
    const result = await pool.request()
      .input("Mode", sql.VarChar(20), mode)
      .input("StartDate", sql.Date, startDateVal)
      .input("EndDate", sql.Date, endDateVal)
      .execute("sp_Get_Plant_IdleTime");

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching No Prodcution Time:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


//Get the top 5 dt 
router.get("/GetPlantTop5Downtimes", async (req, res) => {
  try {
    // accept either lower- or upper-case query keys
    const mode = req.query.mode || req.query.Mode || "SHIFT";
    const startDate = req.query.startDate || req.query.StartDate || null;
    const endDate = req.query.endDate || req.query.EndDate || null;

    // convert to Date or pass null
    const startDateVal = startDate ? new Date(startDate) : null;
    const endDateVal = endDate ? new Date(endDate) : null;

    const pool = await sql.connect();
    const result = await pool.request()
      .input("Mode", sql.VarChar(20), mode)
      .input("StartDate", sql.Date, startDateVal)
      .input("EndDate", sql.Date, endDateVal)
      .execute("sp_Dashboard_Plant_Get_Top5_Downtime_Duration_Occurence");

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("Error fetching No Downtimes:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router;