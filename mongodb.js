const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/cloudbook"

const connectToMongoDB = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to MongoDB!")
    })
}

module.exports = connectToMongoDB;