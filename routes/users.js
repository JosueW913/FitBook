var express = require('express');
var router = express.Router();

const User = require('../models/User');
const Routine = require('../models/Routine')
const isLoggedIn = require('../middleware/isLoggedIn');

/* GET users listing. */
router.get('/profile', isLoggedIn, (req, res, next) => {

  User.findById(req.session.user._id)
  .then((foundUser) => {
    return foundUser
  })
  .then((user) => {
    Routine.find({username: user._id})
    .then((routines) => {
        
        res.render('user-profile/user-profile.hbs', {user, routines})
      })
      .catch((err) => {
        console.log(err)
        next(err)
      })
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })

  
});

module.exports = router;
