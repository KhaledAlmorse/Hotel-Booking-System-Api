const Review = require("../models/reviewModel");

const factory = require("./handlerFactory");

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
 * @description Create Review
 * @route Post /api/v1/reviews
 * @private admin
 */

exports.createReview = factory.CreateOne(Review);

/**
 * @description Get List of Review
 * @route Get /api/v1/reviews
 * @private admin
 */

exports.getReviews = factory.getAll(Review);

/**
 * @description Get Specific Review
 * @route Get /api/v1/reviews/:id
 * @private admin
 */

exports.getReview = factory.getOne(Review);

/**
 * @description Update Specific reviews
 * @route Put /api/v1/reviews/:id
 * @private admin
 */

exports.updateReview = factory.updateOne(Review);

/**
 * @description Delete Specific reviews
 * @route Delete /api/v1/reviews/:id
 * @private admin
 */
exports.deleteReview = factory.deleteOne(Review);
