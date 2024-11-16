const asyncHandler = require("express-async-handlr");
const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");

const ApiError = require("../utils/apiError");
const factory = require("./handlerFactory");

// Check Room Availability
// Helper function that checks if a room is available based on given dates.
// Returns true if the room is available, otherwise false.
const isRoomAvailable = async (roomId, checkInDate, checkOutDate) => {
  const overlappingBooking = await Booking.exists({
    room: roomId,
    status: { $in: ["pending", "confirmed"] },
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate },
  });
  return !overlappingBooking;
};

/**-------------------------------------------------------- */

// Create Booking
// @description Creates a booking for a user if the room is available
// @route POST /api/v1/booking
// @access Private (user)
exports.createUserBooking = asyncHandler(async (req, res, next) => {
  const { userId, roomId, checkInDate, checkOutDate } = req.body;

  // Check if room is available
  const isAvailable = await isRoomAvailable(roomId, checkInDate, checkOutDate);
  if (!isAvailable) {
    return next(
      new ApiError("Room is not available for the selected dates", 404)
    );
  }

  // Find room based on ID
  const room = await Room.findById(roomId);
  if (!room) {
    return next(new ApiError(`No Room Found For This Id:${room}`, 404));
  }

  // Validate the check-in and check-out dates
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return next(new ApiError(`Invalid check-in or check-out date`, 404));
  }
  if (checkOut <= checkIn) {
    return next(
      new ApiError(`Check-out date must be after check-in date`, 404)
    );
  }

  // Calculate total price based on nights
  const days = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
  const totalAmount = room.pricePerNight * days;

  // Create booking in database
  const booking = await Booking.create({
    user: userId,
    room: roomId,
    checkInDate,
    checkOutDate,
    totalAmount,
    status: "pending",
  });
  booking.save();

  return res.status(201).json({ data: booking });
});

// Confirm Booking
// @description Confirms a booking based on its ID, changing the status to "confirmed"
// @route GET /api/v1/booking/confirm/:id
// @access Private (user)
exports.confirmBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new ApiError(`No Booking For This Id: ${id}`, 404));
  }

  booking.status = "confirmed";
  booking.save();
  return res.status(200).json({ status: "Confirmed", data: booking });
});

// Cancel Booking
// @description Cancels a booking based on its ID, changing the status to "cancled"
// @route GET /api/v1/booking/cancled/:id
// @access Private (user)
exports.cancledBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new ApiError(`No Booking For This Id: ${id}`, 404));
  }

  booking.status = "cancled";
  booking.save();
  return res.status(200).json({ status: "Cancled", data: booking });
});

// Get Available Rooms
// @description Retrieves a list of available rooms based on specified dates
// @route GET /api/v1/rooms/available
// @access Private (user)
exports.getAvailableUserRooms = asyncHandler(async (req, res, next) => {
  const { checkInDate, checkOutDate } = req.query;

  // Validate dates
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return next(new ApiError("Invalid check-in or check-out date", 400));
  }
  if (checkOut <= checkIn) {
    return next(
      new ApiError("Check-out date must be after check-in date", 400)
    );
  }

  // Find all rooms that do not have overlapping bookings in the specified date range
  const unavailableRooms = await Booking.find({
    status: { $in: ["pending", "confirmed"] },
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate },
  }).distinct("room");
  //.distinct("room") ensures we only get the unique room IDs that match this condition, giving us a list of unavailableRooms.

  // Retrieve rooms that are not in the unavailable list
  const availableRooms = await Room.find({
    _id: { $nin: unavailableRooms },
  });
  //This query finds all rooms in the Room collection where the _id is not in the unavailableRooms list.

  return res.status(200).json({ data: availableRooms });
});

// Get All Bookings
// @description Retrieves all bookings in the system
// @route GET /api/v1/booking
// @access Private (admin)
exports.getAllBooking = factory.getAll(Booking);

// Get Specific Booking
// @description Retrieves a specific booking based on its ID
// @route GET /api/v1/booking/:id
// @access Private (admin)
exports.getSpecificBooking = factory.getOne(Booking);

// Update Specific Booking
// @description Updates a specific booking based on its ID
// @route PUT /api/v1/booking/:id
// @access Private (admin)
exports.updateSpecificBooking = factory.updateOne(Booking);

// Delete Specific Booking
// @description Deletes a specific booking based on its ID
// @route DELETE /api/v1/booking/:id
// @access Private (admin)
exports.deleteSpecificBooking = factory.deleteOne(Booking);
