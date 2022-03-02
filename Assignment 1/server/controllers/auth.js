import User from "../models/userSchema.js";
import bcrypt from "bcrypt";

const isValidEmail = (value) => {
  //RegEx for email validation
  const regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return regx.test(value);
};

export const postUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  //Validation
  if (!name || !email || !password || !confirmPassword) {
    return res
      .status(409)
      .json({ error: "Please fill all the fields correctly!" });
  } else if (password != confirmPassword) {
    return res.status(409).json({ error: "Passwords do not match!" });
  } else if (!isValidEmail(email)) {
    return res.status(409).json({ error: "Please enter a valid Email" });
  }

  const userDetails = req.body;

  try {
    // //Find existing user
    const user = await User.find({ email: email });

    if (user.length != 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newUser = new User(userDetails);
    
    //Hashing Middleware is used here
    await newUser.save();

    res.status(201).json(newUser); //201 - Successful creation
    console.log("User creation successful");
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  let token;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("email or password null");
      return res.status(400).json({ error: "Invalid Credentials" });
    } else if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }

    const user = await User.findOne({ email: email });//Finding an existing user through email
    console.log(user);

    //First is user verification
    if (user == null) {
      return res.status(404).json({ error: "User does not exist" });
    }
    //Next is password vertification
    else {
      //Comparing the user password with the password stored in the database
      const isMatch = await bcrypt.compare(password, user.password);
      // console.log(isMatch);

      if (!isMatch) {
        //If passwords do not match
        console.log("Password mismatch");
        return res.status(400).json({ error: "Invalid Credentials" });
      } else {
        //Create a JWT Token
        token = await user.generateAuthToken();
        console.log(token);

        res.cookie("jwtToken", token, {
          expires: new Date(Date.now() + 2592000000),
          httpOnly: true,
        });

        res.status(200).json({ message: "User logged in successfully" });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
};
