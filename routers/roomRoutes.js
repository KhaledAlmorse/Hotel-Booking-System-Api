const express = require("express");

const {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
  createFilterObj,
  setHotelIdToBody,
} = require("../services/roomServices");

const {
  getRoomValidator,
  createRoomValidator,
  updateRoomValidator,
  deleteRoomValidator,
} = require("../utils/validator/roomValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setHotelIdToBody, createRoomValidator, createRoom)
  .get(getRooms);

router
  .route("/:id")
  .get(createFilterObj, getRoomValidator, getRoom)
  .put(updateRoomValidator, updateRoom)
  .delete(deleteRoomValidator, deleteRoom);

module.exports = router;
