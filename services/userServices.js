const asyncHandler = require("express-async-handlr");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const factory = require("./handlerFactory");
const ApiError = require("../utils/apiError");

/**
 * @description Create User
 * @route Post /api/v1/users
 * @private admin
 */

exports.createUser = factory.CreateOne(User);

/**
 * @description Get List of Users
 * @route Get /api/v1/users
 * @private admin
 */

exports.getUsers = factory.getAll(User);

/**
 * @description Get Specific  User
 * @route Get /api/v1/users/:id
 * @private admin
 */

exports.getUser = factory.getOne(User);

/**
 * @description Update Specific  User
 * @route Put /api/v1/users/:id
 * @private admin
 */

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
    },
    { new: true }
  );
  if (!document) {
    return next(new ApiError(`No document for this id :${id}`, 404));
  }
  //trigger "save" event when update doucment
  document.save();
  res.status(200).json({ status: "Sucsess", data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await User.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.password, 12),
    },
    { new: true }
  );
  if (!document) {
    return next(new ApiError(`No document for this id :${id}`, 404));
  }
  //trigger "save" event when update doucment
  document.save();
  res.status(200).json({ status: "Sucsess", data: document });
});

/**
 * @description Delete Specific  User
 * @route Delete /api/v1/users/:id
 * @private admin
 */
exports.deleteUser = factory.deleteOne(User);
