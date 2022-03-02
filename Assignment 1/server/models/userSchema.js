import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//User Schema
//It will have an object
const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    trim: true,
    required: true,
    default: Date.now(),
  },
  description: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
    required: false,
  },
  password: {
    type: String,
    trim: true,
    minlength: 7,
    required: true,
  },
  friends: {
    type: Array,
    default: [],
  },
  friendRequestsSent: {
    type: Array,
    default: [],
  },
  friendRequestsReceived: {
    type: Array,
    default: [],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//We are hashing the password
//This is a middleware
userSchema.pre("save", async function (next) {
  try {
    // console.log("Hashing Method");
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
      this.confirmPassword = await bcrypt.hash(this.confirmPassword, 12);
    }
    next();
  } catch (err) {
    console.log(err.message);
  }
});

//Generating JWT Token
userSchema.methods.generateAuthToken = async function () {
  try {
    let generatedToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    // console.log("Token generated");
    this.tokens = this.tokens.concat({
      token: generatedToken,
    });
    await this.save();
    return generatedToken;
  } catch (err) {
    console.log(err.message);
  }
};

//Converting Schema to Model
const User = mongoose.model("USER", userSchema);

export default User;
