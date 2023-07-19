var express = require('express');
var router = express.Router();

const Routine = require('../models/Routine');
const isLoggedIn = require('../middleware/isLoggedIn');

router.post('/create-routine', isLoggedIn, (req, res, next) => {

    Routine.create({
        routineName: req.body.routineName,
        username: req.session.user._id
    })
    .then((createdRoutine) => {
        console.log("created routine:", createdRoutine)
        res.redirect('/users/profile')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

module.exports = router;