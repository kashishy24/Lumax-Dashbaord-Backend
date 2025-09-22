const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");  // ✅ add this
const middlewares = require("./src/middlewares/middlewares.js");
const loginRoute = require("./src/Controllers/loginAPI.js");
const machineWiseDataRoute = require("./src/Controllers/machineWiseData.js");

const app = express();

// ✅ Rate limiter (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(limiter);   // ✅ now works
app.use(express.json());

app.use("/api/login", loginRoute);
app.use("/api", machineWiseDataRoute);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/api/status", (request, response) => {
  middlewares.standardResponse(response, null, 200, "running");
});
