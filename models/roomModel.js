const mongoose = require("mongoose");
const Hotle = require("./hotelModel");

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: [true, "Room must belong to hotel"],
    },
    roomNumber: {
      type: Number,
      required: [true, "Room number are required"],
    },
    typeOfRoom: {
      type: String,
      enum: ["single", "double", "suite"],
      required: [true, "Type Of room are Required"],
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price Per night are required"],
    },

    maxOccupancy: {
      type: Number,
      required: [true, "Max number of pepole on room"],
    },
    isAvalible: {
      type: Boolean,
      required: [true, "Room availability is required"],
    },
    amenities: {
      type: [String],
    },
  },
  { timestamps: true }
);

roomSchema.statics.calcNumberOfRoom = async function (hotelId) {
  const result = await this.aggregate([
    //1-stage 1 => get all reviews on specific hotel
    {
      $match: { hotel: hotelId },
    },
    //2- stage 2 => Grouping reviews based on hotelId and cal avgRatings, ratingsQuantinty
    {
      $group: {
        _id: "hotel",
        countHotelRoom: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await Hotle.findByIdAndUpdate(hotelId, {
      numberOfRoom: result[0].countHotelRoom,
    });
  } else {
    await Hotle.findByIdAndUpdate(hotelId, {
      numberOfRoom: 0,
    });
  }
};

roomSchema.post("save", async function () {
  await this.constructor.calcNumberOfRoom(this.hotel);
});

roomSchema.post("findOneAndDelete", async function ({ hotel }) {
  await this.model.calcNumberOfRoom(hotel);
});

module.exports = mongoose.model("Room", roomSchema);
