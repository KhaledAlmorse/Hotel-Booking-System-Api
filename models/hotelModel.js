const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name are required"],
      unique: [true, "Hotel name must be unique"],
      maxlength: [20, "Too long hotel name"],
    },
    location: {
      type: String,
      required: [true, "Hotel Location Is Required"],
    },

    amenities: {
      type: [String],
    },

    description: {
      type: String,
    },
    ratingAvarge: {
      type: Number,
    },
    ratingQuantity: {
      type: Number,
    },
    numberOfRoom: {
      type: Number,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

hotelSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "hotel",
  localField: "_id",
});

hotelSchema.virtual("rooms", {
  ref: "Room",
  foreignField: "hotel",
  localField: "_id",
});

module.exports = mongoose.model("Hotel", hotelSchema);
