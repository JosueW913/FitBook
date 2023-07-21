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

router.get('/routine-details/:routineId', isLoggedIn, (req, res, next) => {



    Routine.findById(req.params.routineId)
    .populate('exercises')
    .populate('username')
    .then((foundRoutine) => {
        let isOwner = false
        if (req.session.user._id === foundRoutine.username._id.toString()) {
            isOwner = true
        }
        console.log("Found Routine", foundRoutine)
        res.render('routines/routine-details.hbs', {routine: foundRoutine, isOwner})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get("/edit/:id", isLoggedIn, (req, res, next) => {

    Routine.findById(req.params.id)
    .populate('exercises')
    .populate('username')
    .then((foundRoutine) => {
        console.log("found routine", foundRoutine)
        let exercises = foundRoutine.exercises.map((exercise, i) => {
            return {...exercise._doc, routineId: req.params.id, index: i}
        })
        console.log("EXERCISES", exercises)
        // let routineId = foundRoutine._id.toString()
        res.render('routines/edit-routine.hbs', {routine: foundRoutine, exercises})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get("/remove-exercise/:index/:routineId", (req, res, next) => {
    console.log("Params", req.params)
    let index = Number(req.params.index)
    Routine.findById(req.params.routineId)
        .populate('exercises')
        .then((updatedRoutine) => {
            updatedRoutine.duration -= updatedRoutine.exercises[index].duration
            updatedRoutine.exercises.splice(index, 1)
            updatedRoutine.save()
            console.log("updated routine", updatedRoutine)
            res.redirect(`/routines/edit/${updatedRoutine._id}`)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

router.get('/delete/:id', isLoggedIn, (req, res, next) => {
    Routine.findByIdAndDelete(req.params.id)
        .then((deletedRoutine) => {
            console.log("deleted routine", deletedRoutine)
            res.redirect('/users/profile')
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
        
})

router.get('/all-routines', (req, res, next) => {
    Routine.find()
        .populate('username')
        .then((allRoutines) => {
            res.render('routines/routines.hbs', { routines: allRoutines})
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

module.exports = router;