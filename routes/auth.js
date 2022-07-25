const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const router = express.Router();
const AUTH_SECRET = "$Cloudbook$Mern";

// POST METHOD for /cloudbook/auth/createuser. No login required
router.post(
  "/createuser",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("name", "Name should be at least 3 character").isLength({ min: 3 }),
    body("password", "Password should be at least 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //Check Validations and show errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Checks if a email exists already
    try {
      let check = await User.findOne({ email: req.body.email });
      if (check) {
        return res.status(400).json({ error: "Error! Email exist already" });
      }
      //Adding Salt to password and hashing it using bcyrptJS
      const saltPass = await bcrypt.genSalt(10);
      const securedPass = await bcrypt.hash(req.body.password, saltPass);

      //Creates a new user
      let user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPass,
      });

      //Making JWT Token
      const tokenData = {
        email: user.email,
      };
      let authToken = jwt.sign(tokenData, AUTH_SECRET);
      //Sending JWT Token to user to authenticate
      res.json({ authToken });

      // res.json(user);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", message: err.message });
      console.error(err.message);
    }
  }
);

// POST METHOD for /cloudbook/auth/login. No login required
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
    //Check Validations and show errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      //Check Email exists in dataBase
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Incorrect Email or Password" });
      }
      //Converts pass to hash and compare hash to Check the correct password
      let passCheck = await bcrypt.compare(password, user.password);
      if (!passCheck) {
        return res.status(400).json({ error: "Incorrect Email or Password" });
      }
      //If both credentials are correct then sending the payload(tokenData)

      //Making JWT Token
      const tokenData = {
        email: user.email,
      };
      let authToken = jwt.sign(tokenData, AUTH_SECRET);

      //Sending JWT Token to user to authenticate
      res.json({ authToken });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error", message: err.message });
      console.error(err.message);
    }
  }
);
module.exports = router;
