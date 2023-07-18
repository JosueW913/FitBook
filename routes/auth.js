var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const salt = 10;
const User = require('../models/User');

router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')
});

router.post("/signup", (req, res, next) => {
    const { username, email, fullName, password } = req.body;
  
    if (!username || !email || !password ) {
      res.render("auth/signup", {errorMessage: "All fields are mandatory. Please provide your username, email and password."});
      return;
    }
  
    bcrypt
        .genSalt(salt)
        .then((salts) => {
        return bcrypt.hash(password, salts);
        })
        .then((hashedPass) =>{
        return User.create({ username, email, fullName, password: hashedPass })
        })
        .then((createdUser) => {
        console.log("Created user:", createdUser)
        res.redirect("/")
        })
        .catch((error) => {
        if (error.code === 11000) {
          console.log("Username must be unique. Username is already used. "); 
          res.status(500).render("auth/signup.hbs", {errorMessage: "User already exists."});
        } else {
          next(error);
        }
    });  
});

module.exports = router;