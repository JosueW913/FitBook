const isNotOwner = (req, res, next) => {

    if(req.params.usernameId !== req.session.user._id) {
        next()
    } else {
        res.redirect('/workouts')
    }

}

// const isNotOwner = (req, res, next) => {

//     if(req.params.usernameId !== req.session.user._id) {
//         next()
//     } else {
//         res.redirect('/routines')
//     }

// }

module.exports = isNotOwner