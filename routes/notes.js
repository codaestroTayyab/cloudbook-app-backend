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
      let { title, description, tag } = req.body;
      //Creates new note and save in database
      const note = await Note.create({
        title,
        description,
        tag,
        user: req.user.id,
      });

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

//ENDPOINT 3: Patch Method for /cloudbook/notes/updatenote. Login required
router.patch("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    //Get notes details using destructing from request body
    let { title, description, tag } = req.body;
    //Create a newNote using the details passed
    let newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Checks if the note exist the one user trying to access
    let note = await Note.findOne({ _id: req.params.id });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    //Checks if the note's user is same as the logged-in user
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not allowed to update this note" });
    }
    //Updates the note by finding it's id
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    //Send the updated note as json response
    res.json(note);
  } catch (error) {
    //If any error occurs, Bad Request 500 and custom message
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
    console.error(error.message);
  }
});

//ENDPOINT 4: Delete Method for /cloudbook/notes/deletenote. Login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {

    //Checks if the note exist the one user trying to delete
    let note = await Note.findOne({ _id: req.params.id });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    //Checks if the note's user is same as the logged-in user
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not allowed to update this note" });
    }
    //Deletes the note by finding it's id
    note = await Note.findByIdAndDelete(req.params.id);
    //Send success message and deleted note as json response
    res.json({
      message: "Success: Note has been deleted",
      note: note
    });
  } catch (error) {
    //If any error occurs, Bad Request 500 and custom message
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
    console.error(error.message);
  }
});

module.exports = router;
