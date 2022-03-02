import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import loginRoute from "./routes/login.js";
import signUpRoute from "./routes/signup.js";
import uploadRoute from "./routes/upload.js";
import profileRoute from "./routes/profile.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Assingment 1");
});

app.use("/upload", uploadRoute);

app.use("/login", loginRoute);

app.use("/signup", signUpRoute);

app.use("/profile", profileRoute);

//Special character to check for other routes that are not defined
app.use("*", (req, res) => {
  res.send("Error 404 Page Not Found");
});

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port : ${PORT}`))
  )
  .catch((error) => console.log(error.message));

// app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
