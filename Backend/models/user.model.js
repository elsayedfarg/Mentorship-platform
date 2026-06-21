const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password_hash: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false, // Never return password by default
    },
    role: {
      type: String,
      enum: ["admin", "mentor", "student"],
      default: "student",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "users", timestamps: false },
);

// Hash password before saving
userSchema.pre("save", async function () {
  // if the password has not been modified skip the hashing logic and continue saving
  if (!this.isModified("password_hash")) return;

  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = mongoose.model("User", userSchema);
