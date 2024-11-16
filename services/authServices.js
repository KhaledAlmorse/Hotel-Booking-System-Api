const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handlr");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

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
