const { check } = require("express-validator");
const vaildatorMiddlware = require("../../Middlware/validatorMiddlware");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Username Required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Not Email Format")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error(`Email already in used`));
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("Password Required")
    .isLength({ min: 6 })
    .withMessage("Too short user password"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        return Promise.reject(new Error(`Password confirmation Incorrect `));
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number only accepted Egy phone numbers"),

  check("role").optional(),
  vaildatorMiddlware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  check("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Not Email Format")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error(`Email already in used`));
      }
    }),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number only accepted Egy phone numbers"),

  check("role").optional(),
  vaildatorMiddlware,
];
exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("you must enter your current password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter the password confirm"),
  check("password")
    .notEmpty()
    .withMessage("you must enter the password ")
    .custom(async (val, { req }) => {
      //1-Verify Current Password
      const user = await User.findById(req.params.id);
      if (!user) {
        return Promise.reject(
          new Error(`there is no user for this id:${req.params.id}`)
        );
      }

      const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) {
        return Promise.reject(new Error(`InCorrect current Password`));
      }
      //2-Verify password Confirm

      if (val !== req.body.passwordConfirm) {
        return Promise.reject(new Error(`Password confirmation Incorrect `));
      }
    }),

  vaildatorMiddlware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];
