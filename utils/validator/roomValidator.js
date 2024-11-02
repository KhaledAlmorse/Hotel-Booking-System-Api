const { check } = require("express-validator");
const vaildatorMiddlware = require("../../Middlware/validatorMiddlware");
const Hotel = require("../../models/hotelModel");
const Room = require("../../models/roomModel");

exports.getRoomValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];

exports.createRoomValidator = [
  check("hotel")
    .notEmpty()
    .withMessage("Hotel id required")
    .isMongoId()
    .withMessage("Ivalid Id Format")
    .custom(async (val, { req }) => {
      const hotel = await Hotel.findById(val);
      if (!hotel) {
        return Promise.reject(new Error(`No Hotel For This Id: ${val}`));
      }
    }),
  check("roomNumber")
    .notEmpty()
    .withMessage("Room number are required")
    .isNumeric()
    .custom(async (val, { req }) => {
      const room = await Room.findOne({ roomNumber: val });
      if (room) {
        return Promise.reject(new Error("The Room Number Must be unique"));
      }
    }),
  check("typeOfRoom").notEmpty().withMessage("Type Of Room Required.."),

  check("pricePerNight")
    .notEmpty()
    .withMessage("Price Per Night Required")
    .isNumeric(),
  check("amenities").optional(),

  check("maxOccupancy")
    .notEmpty()
    .withMessage("Max number of pepole on room")
    .isNumeric(),

  check("isAvalible")
    .notEmpty()
    .withMessage("Room availability is required")
    .isBoolean(),
  vaildatorMiddlware,
];

exports.updateRoomValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];

exports.deleteRoomValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];
