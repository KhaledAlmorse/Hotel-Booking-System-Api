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

exports.updateUser = (req, res, next) => {
  const { id } = req.params;

  User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
    },
    { new: true }
  )
    .then((document) => {
      if (!document) {
        return next(new ApiError(`No document for this id :${id}`, 404));
      }
      // Trigger "save" event when updating the document
      document
        .save()
        .then(() => {
          res.status(200).json({ status: "Success", data: document });
        })
        .catch((err) => next(err)); // Handle save error
    })
    .catch((err) => next(err)); // Handle findByIdAndUpdate error
};

exports.changeUserPassword = (req, res, next) => {
  const { id } = req.params;

  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPassword) => {
      return User.findByIdAndUpdate(
        id,
        {
          password: hashedPassword,
          passwordChangeAt: Date.now(),
        },
        { new: true }
      );
    })
    .then((document) => {
      if (!document) {
        return next(new ApiError(`No document for this id :${id}`, 404));
      }
      // Trigger "save" event when updating the document
      return document.save().then(() => {
        res.status(200).json({ status: "Success", data: document });
      });
    })
    .catch((err) => next(err)); // Handle errors
};

/**
 * @description Delete Specific  User
 * @route Delete /api/v1/users/:id
 * @private admin
 */
exports.deleteUser = factory.deleteOne(User);
