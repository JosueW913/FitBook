// const Routine = require('../models/Routine')
const Workout = require('../models/Workout')

const isOwner = (req, res, next) => {

    Workout.findById(req.params.workoutId)
    .populate('username')
    .then((foundWorkout) => {
        if(foundWorkout.username._id.toString() === req.session.user._id) {
            next()
        } else {
            res.redirect('/workouts')
        }
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

}

// const isOwner = (req, res, next) => {

//     Routine.findById(req.params.routineId)
//     .populate('username')
//     .then((foundRoutine) => {
//         if(foundRoutine.username._id.toString() === req.session.user._id) {
//             next()
//         } else {
//             res.redirect('/routines')
//         }
//     })
//     .catch((err) => {
//         console.log(err)
//         next(err)
//     })

// }

module.exports = isOwner