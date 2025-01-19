const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    profileImage: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 200,
    },
    profession: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Reset password token and expiry fields
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hashing password
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  console.log("Hashing password for user:", user.email);
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

const User = model("User", userSchema);
module.exports = User;
