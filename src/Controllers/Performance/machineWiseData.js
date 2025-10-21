const express = require("express");
const sql = require("mssql");

const router = express.Router();

// GET Machine Wise Data


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


//Get the loss Name

// GET Loss Names
router.get("/lossname", async (req, res) => {
  try {
  
    // Run Stored Procedure
    const pool = await sql.connect();
    const result = await pool
      .request()
      .execute("sp_Dashbaord_get_LossName");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching LossName Data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching LossName data",
      error: error.message,
    });
  }
});

//Get subloss Names

// GET Loss Names
router.get("/Sublossname", async (req, res) => {
  try {
    const { LossID } = req.query; // pass LossID as query param if needed

    // Run Stored Procedure
    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("LossID", sql.Int, LossID || null) // if your SP takes LossID
      .execute("sp_dashbaord_GetSubLossBy_LossID");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching Sub LossName Data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Sub LossName  data",
      error: error.message,
    });
  }
});

// //Get the All Losses and selected loss duration and occurence by hourly (Current Shift)
// router.get("/hourlylossForShift", async (req, res) => {
//   try {
//     const { EquipmentKey, IncludeZeroHours, LossID, CountType } = req.query;

//     const pool = await sql.connect();
//     const result = await pool
//       .request()
//       .input("EquipmentKey", sql.NVarChar(100), EquipmentKey)        // required
//       .input("IncludeZeroHours", sql.Bit, IncludeZeroHours || 1)     // default = 1
//       .input("LossID", sql.Int, LossID || null)                      // optional
//       .input("CountType", sql.VarChar(10), CountType || "overlap")   // default = 'overlap'
//       .execute("SP_GetHourlyLossAndOccurrences_ForEquipment_CurrentShift_New");

//     res.json({
//       success: true,
//       data: result.recordset,
//     });
//   } catch (error) {
//     console.error("Error fetching Hourly Loss Data:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching Hourly Loss data",
//       error: error.message,
//     });
//   }
// });


// //Get the All Losses and selected loss duration and occurence by day,week,month,dynamic date selection
// router.post("/lossesForDayWeekMonthDates", async (req, res) => {
//   try {
//     const {
//       EquipmentKey,
//       Mode,
//       IncludeZeroPeriods,
//       LossID,
//       CountType,
//       RefDate,
//       StartDate,
//       EndDate,
//     } = req.body;

//     const pool = await sql.connect();
//     const result = await pool
//       .request()
//       .input("EquipmentKey", sql.NVarChar(100), EquipmentKey)                 // required
//       .input("Mode", sql.VarChar(10), Mode || "day")
//       .input("IncludeZeroPeriods", sql.Bit, IncludeZeroPeriods ?? 1)
//       .input("LossID", sql.Int, LossID ?? null)
//       .input("CountType", sql.VarChar(10), CountType || "overlap")
//       .input("RefDate", sql.Date, RefDate ?? null)
//       .input("StartDate", sql.Date, StartDate ?? null)
//       .input("EndDate", sql.Date, EndDate ?? null)
//       .execute("SP_GetLosses_ByMode_WithOccurrences_Duration");

//     res.json({
//       success: true,
//       data: result.recordset,
//     });
//   } catch (error) {
//     console.error("Error fetching Losses Data:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching Losses data",
//       error: error.message,
//     });
//   }
// });



//Get the All TPM Losses  duration and occurence  (Current Shift) 
router.get("/AlllossForShiftTPM", async (req, res) => {
  try {
    const { EquipmentKey, IncludeZeroHours, LossID, CountType } = req.query;

    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("EquipmentKey", sql.NVarChar(100), EquipmentKey)        // required
      
      .input("LossID", sql.Int, LossID || null)                      // optional
   // default = 'overlap'
      .execute("SP_Dashbaord_Get_ALL_Shift_LossSummaryTPM");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching Hourly Lossess Data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Hourly Lossess data",
      error: error.message,
    });
  }
});

//Get the All TPM Losses  duration and occurence by day,week,month,dynamic date selection
router.get("/lossesForDayWeekMonthDatesTPM", async (req, res) => {
  try {
    const {
      EquipmentKey,
      Mode,
      RefDate,
      StartDate,
      EndDate,
      LossID,
      IncludeZeroLosses, // ✅ match the SP name
    } = req.query;

    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("EquipmentKey", sql.NVarChar(100), EquipmentKey)
      .input("Mode", sql.VarChar(10), Mode || "day")
      .input("RefDate", sql.Date, RefDate ?? null)
      .input("StartDate", sql.Date, StartDate ?? null)
      .input("EndDate", sql.Date, EndDate ?? null)
      .input("LossID", sql.Int, LossID ?? null)
      .input("IncludeZeroLosses", sql.Bit, IncludeZeroLosses ?? 1) // ✅ correct param name
      .execute("SP_Dashbaord_Get_ALL_DWMDates_LossSummary_ByMode1TPM");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching Losses Data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Losses data",
      error: error.message,
    });
  }
});

//Get the All 4M Losses  duration and occurence  (Current Shift) 
router.get("/AlllossForShift4M", async (req, res) => {
  try {
    const { EquipmentKey, IncludeZeroLosses, OccurrenceType } = req.query;

    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("EquipmentKey", sql.NVarChar(100), EquipmentKey)   // required
      // Removed Loss4M_ID input
      .input("IncludeZeroLosses", sql.Bit, IncludeZeroLosses ?? 1)
      .input("OccurrenceType", sql.VarChar(10), OccurrenceType || "start")
      .execute("SP_Dashbaord_Get_ALL_Shift_4MLossSummary");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching 4M Losses Data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching 4M Losses data",
      error: error.message,
    });
  }
});

//Get the All 4M Losses  duration and occurence by day,week,month,dynamic date selection
router.get("/lossesForDayWeekMonthDates4M", async (req, res) => {
  try {
    const {
      EquipmentKey,
      Mode,
      RefDate,
      StartDate,
      EndDate,
      IncludeZeroLosses,
    } = req.query;

    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("EquipmentKey", sql.NVarChar(100), EquipmentKey)
      .input("Mode", sql.VarChar(10), Mode || "day")
      .input("RefDate", sql.Date, RefDate ?? null)
      .input("StartDate", sql.Date, StartDate ?? null)
      .input("EndDate", sql.Date, EndDate ?? null)
      // 🚫 Removed 4MLossID — it's optional
      .input("IncludeZeroLosses", sql.Bit, IncludeZeroLosses ?? 1)
      .execute("SP_Dashbaord_Get_ALL_DWMDates_4MLossSummary_ByMode1");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching Losses Data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Losses data",
      error: error.message,
    });
  }
});

//Get the Cumulative loss and subloss

// ===============================
// ROUTE: Get Cumulative Trend Duration & Occurrence by Mode
// ===============================

router.get("/GetCumulativeTrendDurationOccurrenceByMode", async (req, res) => {
  try {
    const sql = require("mssql");
    const pool = await sql.connect();

    // Read parameters from query or default values
    const EquipmentKey = req.query.EquipmentKey || req.query.equipmentKey || '1';
    const Mode = req.query.Mode || req.query.mode || 'month';
    const LossID = req.query.LossID || req.query.lossID || 1;
    const SubLossID = req.query.SubLossID || req.query.subLossID || 1;

    // Execute Stored Procedure
    const result = await pool
      .request()
      .input("EquipmentKey", sql.NVarChar(100), EquipmentKey)
      .input("Mode", sql.VarChar(10), Mode)
      .input("IncludeZeroPeriods", sql.Bit, 1)  // optional param, set default 1
      .input("LossID", sql.Int, LossID)
      .input("SubLossID", sql.Int, SubLossID)
      .input("CountType", sql.VarChar(10), 'overlap') // default value
      .execute("SP_Cumulative_Trend_Duration_Occurence_Mode_Loss");

    // Return results
    res.status(200).json({
      success: true,
      message: "Data fetched successfully.",
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error in /GetCumulativeTrendDurationOccurrenceByMode:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});



module.exports = router;
