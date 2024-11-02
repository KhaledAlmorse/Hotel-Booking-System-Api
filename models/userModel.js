const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username Required"],
      unique: [true, "userName must be unique"],
      minlength: [6, "Too short userName"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email Required"],
    },
    password: {
      type: String,
      required: [true, "Password Required"],
      minlength: [6, "Too Short User Password"],
    },
    phone: {
      type: String,
      required: [true, "Phone Required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
