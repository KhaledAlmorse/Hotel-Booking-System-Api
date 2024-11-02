const express = require("express");

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

router.route("/").post(createHotelValidator, createHotel).get(getHotels);

router
  .route("/:id")
  .get(getHotelValidator, getHotel)
  .put(updateHotelValidator, updateHotel)
  .delete(deleteHotelValidator, deleteHotel);

module.exports = router;
