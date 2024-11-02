const { check } = require("express-validator");
const vaildatorMiddlware = require("../../Middlware/validatorMiddlware");
const slugify = require("slugify");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];

exports.createUserValidator = [
  check("userName")
    .notEmpty()
    .withMessage("Username Required")
    .isLength({ min: 6 })
    .withMessage("Too Short Username")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Not Email Format"),
  check("password").notEmpty().withMessage("Password Required"),
  check("phone")
    .notEmpty()
    .withMessage("Phone Required")
    .isMobilePhone("ar-EG")
    .withMessage("Not Phone Format"),
  vaildatorMiddlware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid Id Format"),
  vaildatorMiddlware,
];
