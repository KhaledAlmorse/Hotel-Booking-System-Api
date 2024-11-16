const { check } = require("express-validator");
const vaildatorMiddlware = require("../../Middlware/validatorMiddlware");

const Room = require("../../models/roomModel");

exports.getHotelValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];

exports.createHotelValidator = [
  check("name")
    .notEmpty()
    .withMessage("Hotel Name Required..")
    .isLength({ max: 20 })
    .withMessage("Too Long Hotel Name"),

  check("location").notEmpty().withMessage("Hotel location Required.."),
  check("amenities").optional().isArray().withMessage("Not array format"),
  check("description").optional(),

  vaildatorMiddlware,
];

exports.updateHotelValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];

exports.deleteHotelValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];
