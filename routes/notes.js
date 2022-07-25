const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note");
const fetchUser = require("../middleware/fetchUser");

//ENDPOINT 1: Get Method for /cloudbook/notes/getallnotes. Login required
router.get("/getallnotes", fetchUser, async (req, res) => {
  try {
    //Finding all notes using the user id (foreign key)
    const notes = await Note.find({ user: req.user.id });
    //sending all notes as json response
    res.json(notes);
  } catch (error) {
    //If any error occurs, Bad Request 500 and custom message
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
    console.error(error.message);
  }
});

//ENDPOINT 2: Post Method for /cloudbook/notes/addnote. Login required
router.post(
  "/addnote",
  fetchUser,
  [
    //Validating notes field using express validator
    body("title", "Titile should be at least 3 character").isLength({ min: 3 }),
    body("description", "Description should be at least 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      //Check Validations and show errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //Getting notes details using destructuring from request body
      let {title, description, tag} = req.body;
      //Create new note and save in database
      const note =  await Note.create({
        title, description, tag, user: req.user.id
      })
      
      res.json(note);
    } catch (error) {
      //If any error occurs, Bad Request 500 and custom message
      res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
      console.error(error.message);
    }
  }
);

module.exports = router;
