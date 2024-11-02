const express = require("express");

const {
  createUserBooking,
  getAllBooking,
  getSpecificBooking,
  updateSpecificBooking,
  deleteSpecificBooking,
  confirmBooking,
  cancledBooking,
  getAvailableUserRooms,
} = require("../services/bookingServices");

const {
  getBookingValidator,
  createBookingValidator,
  updateBookingValidator,
  deleteBookingValidator,
  confirmBookingValidator,
  cancledBookingValidator,
} = require("../utils/validator/bookingValidator");

const router = express.Router();

router
  .route("/")
  .post(createBookingValidator, createUserBooking)
  .get(getAllBooking);

router
  .route("/:id")
  .get(getBookingValidator, getSpecificBooking)
  .put(updateBookingValidator, updateSpecificBooking)
  .delete(deleteBookingValidator, deleteSpecificBooking);

router.route("/confirm/:id").put(confirmBookingValidator, confirmBooking);
router.route("/cancled/:id").put(cancledBookingValidator, cancledBooking);
router.get("/rooms/available", getAvailableUserRooms);

module.exports = router;
