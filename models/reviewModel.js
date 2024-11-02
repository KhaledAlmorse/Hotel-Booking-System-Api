const mongoose = require("mongoose");

const Hotle = require("./hotelModel");

const reveiwSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min ratings value is 1.0"],
      max: [5, "Max ratings value is 5.0"],
      required: [true, "Review Rating Required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must blong to user"],
    },
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: [true, "Review must belong to hotel"],
    },
  },
  { timestamps: true }
);

reveiwSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "userName ",
  }),
    next();
});

reveiwSchema.statics.calcAverageRatingAndQuantity = async function (hotelId) {
  const result = await this.aggregate([
    //1-stage 1 => get all reviews on specific hotel
    {
      $match: { hotel: hotelId },
    },
    //2- stage 2 => Grouping reviews based on hotelId and cal avgRatings, ratingsQuantinty
    {
      $group: {
        _id: "hotel",
        avgRating: { $avg: "$ratings" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await Hotle.findByIdAndUpdate(hotelId, {
      ratingAvarge: result[0].avgRating,
      ratingQuantity: result[0].ratingQuantity,
    });
  } else {
    await Hotle.findByIdAndUpdate(hotelId, {
      ratingAvarge: 0,
      ratingQuantity: 0,
    });
  }
};

reveiwSchema.post("save", async function () {
  await this.constructor.calcAverageRatingAndQuantity(this.hotel);
});

reveiwSchema.post("findOneAndDelete", async function ({ hotel }) {
  await this.model.calcAverageRatingAndQuantity(hotel);
});

module.exports = mongoose.model("Review", reveiwSchema);
