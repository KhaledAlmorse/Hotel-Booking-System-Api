const express = require("express");

const { signUp, login } = require("../services/authServices");

const {
  signUpValidator,
  loginValidator,
} = require("../utils/validator/authValidator");

const router = express.Router();

router.route("/singup").post(signUpValidator, signUp);
router.route("/login").post(loginValidator, login);

module.exports = router;
