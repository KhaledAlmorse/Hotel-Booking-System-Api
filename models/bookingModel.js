const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to userId.."],
    },
    room: {
      type: mongoose.Schema.ObjectId,
      ref: "Room",
      required: [true, "Booking must belong to roomId.."],
    },

    checkInDate: {
      type: Date,
      required: [true, "Check in date required"],
    },
    checkOutDate: {
      type: Date,
      required: [true, "Check out date required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total Price of room are required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancled"],
    },
  },
  { timestamps: true }
);

// bookingSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "room",
//     select: "roomNumber typeOfRoom ",
//   }),
//     this.populate({
//       path: "user",
//       select: "userName ",
//     });
//   next();
// });

module.exports = mongoose.model("Booking", bookingSchema);
