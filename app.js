//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
// const _ = require("lodash");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/usersDB",{useNewUrlParser: true});
  }

  const userSchema= new mongoose.Schema({
    email: String,
    password: String
  });
  userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

  const User= mongoose.model("User",userSchema)

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save()
  .then(savedUser => {
    res.render("secrets");
    // or res.status(200).json({ message: 'User saved successfully' });
  })
  .catch(error => {
    console.log("Error occurred while saving user:", error);
    res.status(500).json({ error: 'An error occurred while saving the user' });
  });
})

app.post("/login",function(req,res){
    const username= req.body.username;
    const password= req.body.password;

    async function getUser() {
        try {
          const user = await User.findOne({ email: username });
          if(user){
            if(user.password === password){
                res.render("secrets");
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      getUser();
      
      
})













app.listen(3000, function() {
    console.log("Server started on port 3000");
  });