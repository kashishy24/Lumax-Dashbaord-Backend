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

// GET Machine cycle time heat map

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
      Mode: rawMode,
      RefDate: rawRefDate,
      StartDate: rawStartDate,
      EndDate: rawEndDate,
      IncludeZeroLosses: rawIncludeZero,
      "LossID": rawLossID, // accept query param named 4MLossID
    } = req.query;

    // Basic validation
    if (!EquipmentKey) {
      return res.status(400).json({ success: false, message: "EquipmentKey is required" });
    }

    // Normalize Mode: SP expects 'day'|'week'|'month'.
    // In your examples you passed 'date' when using StartDate/EndDate — map that safely.
    let Mode = (rawMode || "day").toString().toLowerCase();
    if (Mode === "date") {
      // If user explicitly passed "date" but did not supply StartDate/EndDate, it's ambiguous.
      // We'll allow 'date' only when the caller also supplies StartDate & EndDate.
      // When StartDate/EndDate are present SP treats the range as a single period regardless of Mode.
      if (!rawStartDate || !rawEndDate) {
        // fallback to day to avoid SP error but notify caller
        Mode = "day";
      } else {
        // keep Mode mapped to 'day' (value won't matter when StartDate/EndDate provided)
        Mode = "day";
      }
    }
    // Only allow day/week/month to avoid SP RAISERROR
    if (!["day", "week", "month"].includes(Mode)) Mode = "day";

    // Parse IncludeZeroLosses (accept "0"/"1", boolean, or missing)
    const IncludeZeroLosses =
      rawIncludeZero === undefined || rawIncludeZero === null
        ? 1
        : (rawIncludeZero === "0" || rawIncludeZero === 0 || rawIncludeZero === false)
        ? 0
        : 1;

    // Parse 4MLossID if provided (optional)
    const _LossID =
      rawLossID === undefined || rawLossID === null || rawLossID === ""
        ? null
        : Number.isFinite(Number(rawLossID))
        ? parseInt(rawLossID, 10)
        : null;

    // Helper to safely convert to JS Date or pass null
    const parseDateOrNull = (val) => {
      if (!val && val !== 0) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };

    const RefDate = parseDateOrNull(rawRefDate);
    const StartDate = parseDateOrNull(rawStartDate);
    const EndDate = parseDateOrNull(rawEndDate);

    const pool = await sql.connect();
    const request = pool.request()
      .input("EquipmentKey", sql.NVarChar(100), EquipmentKey)
      .input("Mode", sql.VarChar(10), Mode)
      .input("RefDate", sql.Date, RefDate)
      .input("StartDate", sql.Date, StartDate)
      .input("EndDate", sql.Date, EndDate)
      .input("LossID", sql.Int, _LossID)
      .input("IncludeZeroLosses", sql.Bit, IncludeZeroLosses);

    const result = await request.execute("SP_Dashbaord_Get_ALL_DWMDates_LossSummary_ByMode100TPM");

    return res.json({
      success: true,
      data: result.recordset, // rows from your SP (PeriodKey, PeriodLabel, 4MLossID, 4MLossName, MinutesLost, Occurrences)
    });
  } catch (error) {
    console.error("Error fetching Losses Data:", error);
    return res.status(500).json({
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
      Mode: rawMode,
      RefDate: rawRefDate,
      StartDate: rawStartDate,
      EndDate: rawEndDate,
      IncludeZeroLosses: rawIncludeZero,
      "4MLossID": raw4MLossID, // accept query param named 4MLossID
    } = req.query;

    // Basic validation
    if (!EquipmentKey) {
      return res.status(400).json({ success: false, message: "EquipmentKey is required" });
    }

    // Normalize Mode: SP expects 'day'|'week'|'month'.
    // In your examples you passed 'date' when using StartDate/EndDate — map that safely.
    let Mode = (rawMode || "day").toString().toLowerCase();
    if (Mode === "date") {
      // If user explicitly passed "date" but did not supply StartDate/EndDate, it's ambiguous.
      // We'll allow 'date' only when the caller also supplies StartDate & EndDate.
      // When StartDate/EndDate are present SP treats the range as a single period regardless of Mode.
      if (!rawStartDate || !rawEndDate) {
        // fallback to day to avoid SP error but notify caller
        Mode = "day";
      } else {
        // keep Mode mapped to 'day' (value won't matter when StartDate/EndDate provided)
        Mode = "day";
      }
    }
    // Only allow day/week/month to avoid SP RAISERROR
    if (!["day", "week", "month"].includes(Mode)) Mode = "day";

    // Parse IncludeZeroLosses (accept "0"/"1", boolean, or missing)
    const IncludeZeroLosses =
      rawIncludeZero === undefined || rawIncludeZero === null
        ? 1
        : (rawIncludeZero === "0" || rawIncludeZero === 0 || rawIncludeZero === false)
        ? 0
        : 1;

    // Parse 4MLossID if provided (optional)
    const _4MLossID =
      raw4MLossID === undefined || raw4MLossID === null || raw4MLossID === ""
        ? null
        : Number.isFinite(Number(raw4MLossID))
        ? parseInt(raw4MLossID, 10)
        : null;

    // Helper to safely convert to JS Date or pass null
    const parseDateOrNull = (val) => {
      if (!val && val !== 0) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };

    const RefDate = parseDateOrNull(rawRefDate);
    const StartDate = parseDateOrNull(rawStartDate);
    const EndDate = parseDateOrNull(rawEndDate);

    const pool = await sql.connect();
    const request = pool.request()
      .input("EquipmentKey", sql.NVarChar(100), EquipmentKey)
      .input("Mode", sql.VarChar(10), Mode)
      .input("RefDate", sql.Date, RefDate)
      .input("StartDate", sql.Date, StartDate)
      .input("EndDate", sql.Date, EndDate)
      .input("4MLossID", sql.Int, _4MLossID)
      .input("IncludeZeroLosses", sql.Bit, IncludeZeroLosses);

    const result = await request.execute("SP_Dashbaord_Get_ALL_DWMDates_4MLossSummary_ByMode100");

    return res.json({
      success: true,
      data: result.recordset, // rows from your SP (PeriodKey, PeriodLabel, 4MLossID, 4MLossName, MinutesLost, Occurrences)
    });
  } catch (error) {
    console.error("Error fetching Losses Data:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching Losses data",
      error: error.message,
    });
  }
});




// GET /api/shift-loss-trend?equipmentKey=1&lossId=1[&subLossId=2]
router.get('/GetShiftCumulativeTrendDurationOccurrence', async (req, res) => {
  try {
    // read params (case-insensitive fallbacks)
    const equipmentKey = req.query.EquipmentKey || req.query.equipmentKey || '1';
    const lossId       = req.query.LossID       || req.query.lossId       || 1;
    const subLossIdRaw = req.query.SubLossID    || req.query.subLossId;

    // get (or create) a connection from the global pool
    const pool = await sql.connect(); // no config here—uses the global one set at startup

    const request = pool.request()
      .input('EquipmentKey', sql.NVarChar(50), String(equipmentKey))
      .input('LossID',       sql.Int,          parseInt(lossId, 10))
      .input('SubLossID',    sql.Int,          subLossIdRaw !== undefined && subLossIdRaw !== '' ? parseInt(subLossIdRaw, 10) : null);

    const result = await request.execute('dbo.SP_Cumulative_Trend_Duration_Occurence_shift_Loss100');

    // returns HourNo, HourSlot, Duration_Minutes, Occurrences
    res.status(200).json({
      success: true,
      message: 'Data fetched successfully.',
      params: { equipmentKey, lossId: Number(lossId), subLossId: subLossIdRaw ? Number(subLossIdRaw) : null },
      data: result.recordset || []
    });
  } catch (error) {
    console.error('Error in /GetShiftCumulativeTrendDurationOccurrence:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shift loss trend',
      error: error?.originalError?.info || error.message
    });
  }
});

// ===============================
// ROUTE: Get Cumulative Trend Duration & Occurrence by Mode
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
