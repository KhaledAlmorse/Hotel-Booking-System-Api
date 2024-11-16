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

const AuthServices = require("../services/authServices");

const {
  getRoomValidator,
  createRoomValidator,
  updateRoomValidator,
  deleteRoomValidator,
} = require("../utils/validator/roomValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    AuthServices.protect,
    AuthServices.allowedTo("admin"),
    setHotelIdToBody,
    createRoomValidator,
    createRoom
  )
  .get(AuthServices.protect, AuthServices.allowedTo("admin", "user"), getRooms);

router
  .route("/:id")
  .get(
    AuthServices.protect,
    AuthServices.allowedTo("admin", "user"),
    createFilterObj,
    getRoomValidator,
    getRoom
  )
  .put(
    AuthServices.protect,
    AuthServices.allowedTo("admin"),
    updateRoomValidator,
    updateRoom
  )
  .delete(
    AuthServices.protect,
    AuthServices.allowedTo("admin"),
    deleteRoomValidator,
    deleteRoom
  );

module.exports = router;
