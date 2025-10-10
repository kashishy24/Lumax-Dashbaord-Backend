const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");  //  add this
const middlewares = require("./src/middlewares/middlewares.js");
const loginRoute = require("./src/Controllers/loginAPI.js");
const machineWiseDataRoute = require("./src/Controllers/Performance/machineWiseData.js");
const HomeRoute=require("./src/Controllers/HomePage/Home.js")
const PerformanceHomeRoute = require("./src/Controllers/Performance/PerfHome.js");
const DowntimeHomeRoute= require("./src/Controllers/Downtime/DTHome.js");
const DowntimeMachineRoute= require("./src/Controllers/Downtime/DTMachine.js");
const app = express();

// Rate limiter (100 requests per 15 minutes per IP)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

//app.use(limiter);   

// app.use("/api", limiter);
app.use(express.json());

app.use("/api/login", loginRoute);
app.use("/api/PerfMachine", machineWiseDataRoute);
app.use("/api/Home",HomeRoute );
app.use("/api/PerformanceHome",PerformanceHomeRoute );
app.use("/api/DowntimeHome",DowntimeHomeRoute );
app.use("/api/DowntimeMachine",DowntimeMachineRoute );

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/api/status", (request, response) => {
  middlewares.standardResponse(response, null, 200, "running");
});
