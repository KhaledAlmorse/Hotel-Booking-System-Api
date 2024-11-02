const { check } = require("express-validator");
const vaildatorMiddlware = require("../../Middlware/validatorMiddlware");

const Review = require("../../models/reviewModel");
const User = require("../../models/userModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];

exports.createReviewValidator = [
  check("user")
    .notEmpty()
    .withMessage("Review must blong to user")
    .isMongoId()
    .withMessage("Invalid Id Format"),
  check("hotel")
    .notEmpty()
    .withMessage("Review must blong to hotel")
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom(async (val, { req }) => {
      //1-check if user create a review before
      const review = await Review.findOne({
        user: req.body.user,
        hotel: req.body.hotel,
      });
      if (review) {
        return Promise.reject(new Error("You already created review before"));
      }
    }),
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Ratings Required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 to 5"),
  vaildatorMiddlware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        return Promise.reject(
          new Error(`There is no review for this id: ${val}`)
        );
      }
      if (review.user._id.toString() !== req.body.user.toString()) {
        return Promise.reject(
          new Error(`You are not allowedd to perform this action`)
        );
      }
    }),
  vaildatorMiddlware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        return Promise.reject(
          new Error(`There is no review for this id: ${val}`)
        );
      }
      if (review.user._id.toString() !== req.body.user.toString()) {
        return Promise.reject(
          new Error(`You are not allowedd to perform this action`)
        );
      }
    }),
  vaildatorMiddlware,
];
