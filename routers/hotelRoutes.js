const express = require("express");

const AuthServices = require("../services/authServices");

const {
  createHotel,
  getHotels,
  getHotel,
  updateHotel,
  deleteHotel,
} = require("../services/hotelServices");

const {
  getHotelValidator,
  createHotelValidator,
  updateHotelValidator,
  deleteHotelValidator,
} = require("../utils/validator/hotelValidator");

const roomRoutes = require("../routers/roomRoutes");
const reviewRoutes = require("../routers/reviewRoutes");

const router = express.Router();

router.use("/:hotelId/rooms", roomRoutes);
router.use("/:hotelId/reviews", reviewRoutes);

router.use(AuthServices.protect, AuthServices.allowedTo("user"));

router
  .route("/")
  .post(
    AuthServices.protect,
    AuthServices.allowedTo("admin"),
    createHotelValidator,
    createHotel
  )
  .get(
    AuthServices.protect,
    AuthServices.allowedTo("admin", "user"),
    getHotels
  );

router
  .route("/:id")
  .get(
    AuthServices.protect,
    AuthServices.allowedTo("user", "admin"),
    getHotelValidator,
    getHotel
  )
  .put(
    AuthServices.protect,
    AuthServices.allowedTo("admin"),
    updateHotelValidator,
    updateHotel
  )
  .delete(
    AuthServices.protect,
    AuthServices.allowedTo("admin"),
    deleteHotelValidator,
    deleteHotel
  );

module.exports = router;
