const { check } = require("express-validator");
const vaildatorMiddlware = require("../../Middlware/validatorMiddlware");
const Room = require("../../models/roomModel");
const User = require("../../models/userModel");

exports.getBookingValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];

exports.createBookingValidator = [
  check("userId")
    .notEmpty()
    .withMessage("User id required")
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom(async (val, { req }) => {
      const user = await User.findById(val);
      if (!user) {
        throw new Error(`UserId Must Belong To user `);
      }
    }),
  check("roomId")
    .notEmpty()
    .withMessage("Type Of Booking Required..")
    .custom(async (val, { req }) => {
      const room = await Room.findById(val);
      if (!room) {
        throw new Error(`RoomId Must Belong To Room `);
      }
    }),

  check("checkInDate").notEmpty().withMessage("Check In Date Required"),
  check("checkOutDate").notEmpty().withMessage("Check Out Date Required"),

  vaildatorMiddlware,
];

exports.updateBookingValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];

exports.deleteBookingValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];
exports.confirmBookingValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];
exports.cancledBookingValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];
