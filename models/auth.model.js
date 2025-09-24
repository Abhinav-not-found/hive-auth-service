import mongoose from "mongoose";
import bcrypt from "bcryptjs";

function generateRandomUsername(name) {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const cleanName = name.toLowerCase().replace(/\s+/g, "");
  return `${cleanName}_${randomNum}`;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxlength: [150, "Name cannot exceed 150 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    username: {
      type: String,
      unique: true,
      maxlength: [150, "Username cannot exceed 150 characters"],
    },
    bio: {
      type: String,
      maxlength: [150, "Bio cannot exceed 150 characters"],
      default: ''
    },
    profileImage: {
      type: String,
      default: ''
    },
    followers: {
      type: [String],
      default: []
    },
    following: {
      type: [String],
      default:[]
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  if (!this.username) {
    let newUsername;
    let exists = true;
    while (exists) {
      newUsername = generateRandomUsername(this.name);
      const user = await mongoose.models.User.findOne({
        username: newUsername,
      });
      if (!user) exists = false;
    }
    this.username = newUsername;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
