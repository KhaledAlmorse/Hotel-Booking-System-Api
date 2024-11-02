const User = require("../models/userModel");

const factory = require("./handlerFactory");

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

exports.updateUser = factory.updateOne(User);

/**
 * @description Delete Specific  User
 * @route Delete /api/v1/users/:id
 * @private admin
 */
exports.deleteUser = factory.deleteOne(User);
