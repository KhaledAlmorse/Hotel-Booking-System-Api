const express = require("express");

const AuthServices = require("../services/authServices");

const {
  signUp,
  login,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
} = require("../services/authServices");

const {
  signUpValidator,
  loginValidator,
} = require("../utils/validator/authValidator");

const router = express.Router();

router.route("/singup").post(signUpValidator, signUp);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgetPassword);
router.route("/verifyResetCode").post(verifyPasswordResetCode);
router.route("/resetPassword").post(resetPassword);

module.exports = router;
