const express = require("express");

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
