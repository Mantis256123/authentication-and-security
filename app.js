//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption") 

const app = express();
 
const port = process.env.PORT || 3000;
 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) =>{
    res.render("home.ejs");
});

app.get("/login", (req, res) =>{
    res.render("login.ejs");
});

app.get("/register", (req, res) =>{
    res.render("register.ejs");
});

app.post("/register", (req, res) =>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
    .then(()=>{
        res.render("secrets.ejs");
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.post("/login", (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username})
    .then((foundUser)=>{
        if(foundUser){
            if(password === foundUser.password){
                res.render("secrets.ejs");
            }else{
                console.log("Wrong password");
            }
            
        }else{
            console.log("Wrong email");
        }
        
    })
    .catch((err)=>{
        console.log(err);
    })
});
 
app.listen(port, () => console.log(`Server started at port: ${port}`)
);