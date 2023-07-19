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
        res.redirect("/login")
        })
        .catch((error) => {
        if (error.code === 11000) {
          console.log("Username must be unique. Username is already used. "); 
          res.status(500).render("auth/signup.hbs", {errorMessage: "Username and/or email already exists."});
        } else {
          next(error);
        }
    });  
});

router.get('/login', (req, res, next) => {
    res.render('auth/login.hbs')
})

router.post('/login', (req, res, next) => {

    const { email, password } = req.body;
   
    if (!email || !password) {
      res.render('auth/login.hbs', {
        errorMessage: 'Please enter both email and password to login.'
      });
      return;
    }
   
    User.findOne({ email })
      .then(user => {
        if (!user) {
          console.log("Email not registered.");
          res.render('auth/login.hbs', { errorMessage: 'User not found and/or password is incorrect.' });
          return;
        } else if (
          bcrypt.compareSync(password, user.password)) {
          
          req.session.user = user  
  
          console.log("Session:", req.session)
  
          res.redirect('/')
        } else {
          console.log("Incorrect password.");
          res.render('auth/login.hbs', { errorMessage: 'User not found and/or password is incorrect.' });
        }
      })
      .catch(error => next(error));
  });

  router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/auth/login');
    });
    console.log("Session", req.session)
});

module.exports = router;