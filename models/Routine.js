const { Schema, model } = require('mongoose');

const routineSchema = new Schema(
    {
        routineName: {
            type: String,
            required: [true, 'Routine name is required.']
        },
        duration: {type: Number, default: 0},
        exercises: [{type: Schema.Types.ObjectId, ref: "Workout"}],
        username: {type: Schema.Types.ObjectId, ref: "User"},
    },
    {
      timestamps: true
    }
  );

module.exports = model('Routine', routineSchema);