const express = require("express");

const AuthServices = require("../services/authServices");

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setHotelIdToBody,
} = require("../services/reviewServices");

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validator/reviewValidator");

const router = express.Router({ mergeParams: true });

router.use(AuthServices.protect, AuthServices.allowedTo("user"));

router
  .route("/")
  .get(getReviews)
  .post(setHotelIdToBody, createReviewValidator, createReview);

router
  .route("/:id")
  .get(createFilterObj, getReviewValidator, getReview)
  .put(updateReviewValidator, updateReview)
  .delete(deleteReviewValidator, deleteReview);

module.exports = router;
