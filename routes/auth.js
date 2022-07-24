const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

const router = express.Router();

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
      res.json(user);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Some error occured", message: err.message });
      console.error(err.message);
    }
  }
);

module.exports = router;
