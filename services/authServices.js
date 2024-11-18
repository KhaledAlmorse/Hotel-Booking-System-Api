const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handlr");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

/**
 * @description SignUp
 * @route Post /api/v1/auth/singup
 * @private public
 */

exports.signUp = (req, res, next) => {
  // Create user
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => {
      // Generate token
      const token = createToken(user._id);

      // Send response to client
      res.status(201).json({ data: user, token });
    })
    .catch((error) => next(error)); // Handle errors
};

/**
 * @description login
 * @route Post /api/v1/auth/login
 * @private public
 */

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // Check if email exists and retrieve the user
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // If user is not found, reject the promise
        return Promise.reject(new ApiError(`Incorrect Email or Password`, 401));
      }

      // Compare passwords
      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return Promise.reject(
            new ApiError(`Incorrect Email or Password`, 401)
          );
        }

        // Generate token
        const token = createToken(user._id);

        // Send response to client
        res.status(201).json({ data: user, token });
      });
    })
    .catch((error) => next(error));
};

//@desc make sure the user is logged in
exports.protect = async (req, res, next) => {
  //1-check if token exist,if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, please login to ger access this route",
        404
      )
    );
  }

  //2-Verify token (no change happens, expired)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //3-check if user exist
  const userId = decoded.userId;
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    return next(new ApiError(`NO User for this id:${userId}`, 401));
  }
  //4-check if user change his password after token created
  if (currentUser.passwordChangeAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10
    );
    //password change after token created
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          `User recently changed his password, please login again..`,
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
};

//@desc Authorization
//["admin","user"]
exports.allowedTo =
  (...roles) =>
  async (req, res, next) => {
    //1-access roles
    //2-access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(`You are not allowed to access this route`, 401)
      );
    }
    next();
  };

/**
 * @description forgot password
 * @route Post /api/v1/auth/forgotPassword
 * @private public
 */
exports.forgetPassword = async (req, res, next) => {
  //1-Check if user exist(req.body.email)
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`No user for this email: ${req.body.email}`, 404));
  }
  //2-if user exist , Generate hash resetCode random 6 digits  and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // console.log(resetCode);
  // console.log(hashResetCode);
  // Save hash password reset code into db
  user.passwordResetCode = hashResetCode;
  //*Add expiration time for password reset code(10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetverified = false;

  await user.save();

  //3-sent the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Yout password reset code(valide for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetverified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending Email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
};

/**
 * Verify Password Reset Code
 * @router Post /api/v2/auth/verifyResetCode
 * @access public
 */
exports.verifyPasswordResetCode = async (req, res, next) => {
  //1-get user based on reset code
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired", 404));
  }
  //2-Reset code Vaild
  user.passwordResetverified = true;

  await user.save();
  res.status(200).json({ status: "Reset Code Vaild" });
};

/**
 * Reset Password
 * @router Post /api/v2/auth/resetPassword
 * @access public
 */
exports.resetPassword = async (req, res, next) => {
  //1-get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no User For This Email ${req.body.email}`)
    );
  }
  //2-check if reset code verified
  if (!user.passwordResetverified) {
    return next(new ApiError(`Reset Code Not Verified`));
  }

  user.password = req.body.newPassword;

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetverified = undefined;

  await user.save();
  //3-if everything is okay ,generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
};
