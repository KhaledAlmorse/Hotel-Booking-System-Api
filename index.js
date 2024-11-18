const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const morgan = require("morgan");

const dbConnection = require("./config/dbConnection");
const ApiError = require("./utils/apiError");
const globalError = require("./Middlware/errorMiddlware");

//Routes
const userRoutes = require("./routers/userRoutes");
const hotelRoutes = require("./routers/hotelRoutes");
const roomRoutes = require("./routers/roomRoutes");
const bookingRoutes = require("./routers/bookingRoutes");
const reviewRoutes = require("./routers/reviewRoutes");
const authRoutes = require("./routers/authRoutes");

//Connection with db
dbConnection();

const app = express();

//Middlware
app.use(express.json());

if (process.env.MODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.MODE_ENV}`);
}

//mount Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/auth", authRoutes);

//Mount Routes
mountRoutes(app);
app.get("/", (req, res) => {
  res.send("<h1>صلي علي النبي كدا</h1>");
});

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// app.use((req, res, next) => {
//   return return res.status(404).json({
//     error: "Route not found",
//     path: req.originalUrl,
//   });
// });

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
