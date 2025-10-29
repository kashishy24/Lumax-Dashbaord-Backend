
const express = require("express");
const sql = require("mssql");




const router = express.Router();

router.get("/GetMachineParametersByCategory", async (req, res) => {
try {
const sql = require("mssql");
const pool = await sql.connect();


// Read query parameters (with fallbacks)
const MachineID = req.query.MachineID || req.query.machineID || "1";
const CategoryList = req.query.CategoryList || req.query.categoryList || null;
const ParameterList = req.query.ParameterList || req.query.parameterList || null;

// Validate required field
if (!MachineID) {
  return res.status(400).json({
    success: false,
    message: "MachineID is required.",
  });
}

// Execute stored procedure
const result = await pool
  .request()
  .input("MachineID", sql.VarChar, MachineID)
  .input("CategoryList", sql.NVarChar, CategoryList)
  .input("ParameterList", sql.NVarChar, ParameterList)
  .execute("SP_GetMachineParameters_ByCategory");

// Return response
res.status(200).json({
  success: true,
  message: "Data fetched successfully.",
  data: result.recordset,
});


} catch (error) {
console.error("Error in /GetMachineParametersByCategory:", error);
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