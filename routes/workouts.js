var express = require('express');
var router = express.Router();

const Workout = require('../models/Workout');

const isLoggedIn = require('../middleware/isLoggedIn');
const isOwner = require('../middleware/isOwner')


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
        duration,
        username: req.session.user._id
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

router.get('/details/:workoutId', isLoggedIn, (req, res, next) => {
    
    const routines = req.session.routines

    Workout.findById(req.params.workoutId)
    // .populate({
    //     path: 'comments', 
    //     populate: {path: 'user'}
    // })
    .populate('username')
    .then((foundWorkout) => {
        console.log("Found Workout Routine", {exercise: foundWorkout, routines})
        res.render('workouts/workout-details.hbs', foundWorkout)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get('/type/:type', (req, res, next) => {

    let id = req.params.type
    console.log("ID:", id)
    let type = id.slice(0, 1).toUpperCase() + id.slice(1)

    Workout.find({
        workoutType: req.params.type
     })
     .populate('username')
     .then((foundWorkouts) => {
        console.log("found workouts", foundWorkouts)
        res.render('workouts/workout-type.hbs', { type: type, exercises: foundWorkouts})
     })
     .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.get('/edit/:workoutId', isLoggedIn, isOwner, (req, res, next) => {

    Workout.findById(req.params.workoutId)
    .populate('username')
    .then((foundWorkout) => {
        console.log("Found Workout", foundWorkout)
        res.render('workouts/edit-workout.hbs', foundWorkout)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.post('/edit/:workoutId', isLoggedIn, isOwner, (req, res, next) => {

    const { workoutType, exerciseName, instructions, reps, sets, duration  } = req.body

    Workout.findByIdAndUpdate(
        req.params.workoutId,
        {
            workoutType, 
            exerciseName, 
            instructions, 
            reps, 
            sets,
            duration
        },
        {new: true}
    )
    .then((updatedWorkout) => {
        res.redirect(`/workouts/details/${updatedWorkout._id}`)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get('/delete/:workoutId', isLoggedIn, isOwner, (req, res, next) => {
    
    Workout.findByIdAndDelete(req.params.workoutId)
    .then((deletedWorkout) => {
        console.log("Deleted Workout:", deletedWorkout)
        res.redirect('/workouts')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

module.exports = router;