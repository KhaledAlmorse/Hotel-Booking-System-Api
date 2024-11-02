const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const morgan = require("morgan");

const dbConnection = require("./config/dbConnection");
const ApiError = require("./utils/apiError");
const globalError = require("./Middlware/errorMiddlware");

const userRoutes = require("./routers/userRoutes");
const hotelRoutes = require("./routers/hotelRoutes");
const roomRoutes = require("./routers/roomRoutes");
const bookingRoutes = require("./routers/bookingRoutes");
const reviewRoutes = require("./routers/reviewRoutes");

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

// app.all("*", (req, res, next) => {
//   next(new ApiError(`Can't find this route:${req.originalUrl}`, 404));
// });

//Global error handling middlware
app.use(globalError);

const port = process.env.PORT || 7000;
const server = app.listen(port, () => {
  console.log(`App Running on Port ${port}`);
});

//OutSide Express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error :${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});
