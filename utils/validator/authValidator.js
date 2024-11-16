const { check } = require("express-validator");
const vaildatorMiddlware = require("../../Middlware/validatorMiddlware");
const slugify = require("slugify");

const User = require("../../models/userModel");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required..")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email Required..")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error(`Email already in used`));
      }
    }),

  check("password").notEmpty().withMessage("Password required"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        return Promise.reject(new Error(`Password confirmation Incorrect `));
      }
      return true;
    }),

  vaildatorMiddlware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Required..")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password").notEmpty().withMessage("Password required"),

  vaildatorMiddlware,
];
