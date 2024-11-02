const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword,
} = require("../services/userServices");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validator/userValidator");

const router = express.Router();

router.route("/").get(getUsers).post(createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router
  .route("/changePassword/:id")
  .put(changeUserPasswordValidator, changeUserPassword);

module.exports = router;
