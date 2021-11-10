///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// Import dotenv
require("dotenv").config()
// Pull port from .env give it a default of 3000 (object destructuring)
const {PORT = 3002, DATABASE_URL} = process.env
// Import express
const express = require("express");
// Application object
const app = express()
//Import mongoose
const mongoose = require("mongoose")
//Import middleware
const cors = require("cors")
// Import morgan
const morgan = require("morgan")

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////

// Establish Connection 
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
// Connection Events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

///////////////////////////////
// MODEL
////////////////////////////////

const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model("Cheese", CheeseSchema)

///////////////////////////////
// MiddleWare
////////////////////////////////
// Prevent cors errors, opens up access to frontend
app.use(cors())
// Error logging
app.use(morgan("dev"))
//parse json bodies
app.use(express.json())

///////////////////////////////
// ROUTES
////////////////////////////////

// Home/Test Route
app.get("/", (req, res) => {
    res.send("Hello Queso!")
})

// Index Route for Cheese in json
app.get("/cheese", async (req, res) => {
    try{
        res.json(await Cheese.find({}))
    }catch(error){
        res.status(400).json(error)
    }
})

// Create Route
app.post("/cheese", async (req, res) => {
    try{
        res.json(await Cheese.create(req.body))
    }catch(error){
        res.status(400).json(error)
    }
})

// Update Route
app.put("/cheese/:id", async (req, res) => {
    try{
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    }catch(error){
        res.status(400).json(error)
    }
})

app.delete("/cheese/:id", async (req, res) => {
    try{
        res.json(await Cheese.findByIdAndDelete(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => {console.log(`Listening on PORT ${PORT}`)})