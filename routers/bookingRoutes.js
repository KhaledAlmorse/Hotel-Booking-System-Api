const express = require("express");

const AuthServices = require("../services/authServices");

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
  .post(
    AuthServices.protect,
    AuthServices.allowedTo("user"),
    createBookingValidator,
    createUserBooking
  )
  .get(
    AuthServices.protect,
    AuthServices.allowedTo("user", "admin"),
    getAllBooking
  );

router
  .route("/:id")
  .get(
    AuthServices.protect,
    AuthServices.allowedTo("user", "admin"),
    getBookingValidator,
    getSpecificBooking
  )
  .put(
    AuthServices.protect,
    AuthServices.allowedTo("user", "admin"),
    updateBookingValidator,
    updateSpecificBooking
  )
  .delete(
    AuthServices.protect,
    AuthServices.allowedTo("user", "admin"),
    deleteBookingValidator,
    deleteSpecificBooking
  );

router
  .route("/confirm/:id")
  .put(
    AuthServices.protect,
    AuthServices.allowedTo("user"),
    confirmBookingValidator,
    confirmBooking
  );
router
  .route("/cancled/:id")
  .put(
    AuthServices.protect,
    AuthServices.allowedTo("user"),
    cancledBookingValidator,
    cancledBooking
  );
router
  .route("/rooms/available")
  .get(
    AuthServices.protect,
    AuthServices.allowedTo("user"),
    getAvailableUserRooms
  );

module.exports = router;
