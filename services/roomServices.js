const Room = require("../models/roomModel");

const factory = require("./handlerFactory");

//Nested Route
//Get /api/v2/hotel/:hotelId/rooms

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.hotelId) filterObject = { hotel: req.params.hotelId };
  req.filterObj = filterObject;
  next();
};

exports.setHotelIdToBody = (req, res, next) => {
  //Nested Route
  if (!req.body.hotel) req.body.hotel = req.params.hotelId;

  next();
};

/**
 * @description Create Room
 * @route Post /api/v1/rooms
 * @private admin
 */
exports.createRoom = factory.CreateOne(Room);

/**
 * @description Get All Rooms
 * @route Get /api/v1/rooms
 * @private admin
 */
exports.getRooms = factory.getAll(Room);

/**
 * @description Get Specific Room
 * @route Get /api/v1/rooms/:id
 * @private admin
 */

exports.getRoom = factory.getOne(Room);

/**
 * @description Update Specific Room
 * @route Put /api/v1/rooms/:id
 * @private admin
 */

exports.updateRoom = factory.updateOne(Room);

/**
 * @description Delete Specific Room
 * @route Delete /api/v1/rooms/:id
 * @private admin
 */

exports.deleteRoom = factory.deleteOne(Room);
