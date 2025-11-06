const express = require("express");
const sql = require("mssql");
const router = express.Router();




router.get("/AlarmDurationOccurrence", async (req, res) => {
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
      .input("MachineID", sql.NVarChar(50), EquipmentID || null);

    const result = await request.execute("SP_MachineWise_Alarm_Duration_Occurrence");

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