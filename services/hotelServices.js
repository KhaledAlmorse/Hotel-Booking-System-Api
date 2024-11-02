const Hotel = require("../models/hotelModel");

const factory = require("./handlerFactory");

/**
 * @description Create Hotel
 * @route Post /api/v1/hotels
 * @private admin
 */

exports.createHotel = factory.CreateOne(Hotel);

/**
 * @description Get All Hotel
 * @route Get /api/v1/hotels
 * @private admin
 */

exports.getHotels = factory.getAll(Hotel);

/**
 * @description Get Specific Hotel
 * @route Post /api/v1/hotels
 * @private admin
 */

exports.getHotel = factory.getOne(Hotel, "rooms reviews");
/**
 * @description Update Specific Hotel
 * @route Put /api/v1/hotels
 * @private admin
 */

exports.updateHotel = factory.updateOne(Hotel);

/**
 * @description Delete Specific Hotel
 * @route delete /api/v1/hotels
 * @private admin
 */

exports.deleteHotel = factory.deleteOne(Hotel);
