var express = require('express');
var router = express.Router();

const Routine = require('../models/Routine');
const Workout = require('../models/Workout')
const isLoggedIn = require('../middleware/isLoggedIn');

router.post('/create-routine', isLoggedIn, (req, res, next) => {

    Routine.create({
        routineName: req.body.routineName,
        username: req.session.user._id
    })
    .then((createdRoutine) => {
        req.session.routines.push(createdRoutine)
        console.log("created routine:", createdRoutine)
        res.redirect('/users/profile')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.post('/add-exercise/:id/:duration', (req, res, next) => {

    const duration = Number(req.params.duration)
    const thisRoutine = req.session.routines.find((routine) => routine._id == req.body.routineName)

    const newDuration = thisRoutine.duration + duration
    thisRoutine.duration = newDuration

    Routine.findByIdAndUpdate(
        req.body.routineName,
        {
            $push: {exercises: req.params.id},
            duration: newDuration
        },
        {new: true})
        .then((updatedRoutine) => {
            console.log("New exercise", updatedRoutine)

            // res.redirect(`/routine-details/${updatedRoutine._id}`)
            res.redirect('/users/profile')
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.get('/routine-details/:routineId', (req, res, next) => {



    Routine.findById(req.params.routineId)
    .populate('exercises')
    .then((foundRoutine) => {
        console.log("Found Routine", foundRoutine)
        res.render('routines/routine-details.hbs', foundRoutine)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

module.exports = router;