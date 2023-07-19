const { Schema, model } = require('mongoose');

const workoutSchema = new Schema(
    {
        workoutType: {
            type: String,
            enum: ["chest", "back", "arms", "legs", "abs", "cardio"],
            required: [true, 'Exercise is required.'],
            unique: true
          },
          exerciseName: {
            type: String,
            required: [true, 'Username is required.'],
            unique: true
          },
          instructions: {
            type: String,
            required: [true, 'Instructions are required.']
          },
          reps: {
            type: Number,
            required: [true, 'Number of reps is required.']
          },
          sets: {
            type: Number,
            required: [true, 'Number of sets is required.']
          },
          duration: Number
    },
    {
      timestamps: true
    }
  );

module.exports = model('Workout', workoutSchema);