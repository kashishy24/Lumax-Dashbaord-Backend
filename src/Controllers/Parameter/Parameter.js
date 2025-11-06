
const express = require("express");
const sql = require("mssql");




const router = express.Router();


router.get("/GetMachineParameterTrendByTime", async (req, res) => {
  try {
    const sql = require("mssql");
    const pool = await sql.connect();

    const MachineID = req.query.MachineID || req.query.machineID;
    const ProdDate = req.query.ProdDate || req.query.prodDate;
    const ShiftName = req.query.ShiftName || req.query.shiftName || null;
    const StartTime = req.query.StartTime || req.query.startTime || null;
    const EndTime = req.query.EndTime || req.query.endTime || null;
    const ParameterList = req.query.ParameterList || req.query.parameterList;

    if (!MachineID || !ProdDate || !ParameterList) {
      return res.status(400).json({
        success: false,
        message: "MachineID, ProdDate, and ParameterList are required.",
      });
    }

    const result = await pool
      .request()
      .input("MachineID", sql.NVarChar, MachineID)
      .input("ProdDate", sql.Date, ProdDate)
      .input("ShiftName", sql.NVarChar, ShiftName)
      // 👇 Change sql.Time → sql.VarChar
      .input("StartTime", sql.VarChar, StartTime)
      .input("EndTime", sql.VarChar, EndTime)
      .input("ParameterList", sql.NVarChar, ParameterList)
      .execute("SP_GetMachineParameterTrend_ByTime1");

    res.status(200).json({
      success: true,
      message: "Machine parameter trend fetched successfully.",
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error in /GetMachineParameterTrendByTime:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});




router.get("/GetShibauraMachine", async (req, res) => {
try {
const sql = require("mssql");
const pool = await sql.connect();
// Execute stored procedure
const result = await pool
  .request()
  .execute("SP_Dashbaord_Get_ShibauraMachineName");

// Return response
res.status(200).json({
  success: true,
  message: "Data fetched successfully.",
  data: result.recordset,
});
} catch (error) {
console.error("Error in /SP_Dashbaord_Get_ShibauraMachineName:", error);
res.status(500).json({
success: false,
message: "Internal Server Error",
error: error.message,
});
}
});


module.exports = router;