const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const connectToMongoDB = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to MongoDB!")
    })
}

module.exports = connectToMongoDB;