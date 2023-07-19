var express = require('express');
var router = express.Router();

const Workout = require('../models/Workout');

const isLoggedIn = require('../middleware/isLoggedIn');


router.get('/', (req, res, next) => {

    Workout.find()
    .then((foundWorkouts) => {       
        res.render('workouts/workouts.hbs', { workouts: foundWorkouts })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
 
});

router.get('/create', isLoggedIn, (req, res, next) => {
    res.render('workouts/create-workout.hbs')
});

router.post('/create', isLoggedIn, (req, res, next) => {

    const { workoutType, exerciseName, instructions, reps, sets, duration  } = req.body

    Workout.create({
        workoutType, 
        exerciseName, 
        instructions, 
        reps, 
        sets,
        duration
    })
    .then((createdWorkout) => {
        console.log("Created Workout Routine:", createdWorkout)
        res.redirect('/workouts')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

});

router.get('/details/:workoutId', (req, res, next) => {

    Workout.findById(req.params.workoutId)
    // .populate({
    //     path: 'comments', 
    //     populate: {path: 'user'}
    // })
    .then((foundRoom) => {
        console.log("Found Room", foundRoom)
        res.render('rooms/room-details.hbs', foundRoom)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

module.exports = router;