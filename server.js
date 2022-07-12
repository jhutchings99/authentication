// Pull in express
const express = require("express");
const app = express();

// Tell server to use json
app.use(express.json());

// Serve ui to backend
app.use(express.static(`${__dirname}/public`));

// Pull in user model
const { User, Workout } = require("./persist/model");

// Create new user
app.post("/user", async (req, res) => {
    try {
        let user = await User.create ({
            username: req.body.username,
            password: req.body.password,
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({
            message: "Failed to create user",
            error: err
        });
    }
});

// Workout list
app.get("/workouts", (req, res) => {
    res.json(["Preacher Curl", "Incline Curl", "Chest Press", "Bench Press", "Calf Raise", "Leg Press", "Hammer Curl"])
});

// Post workout
app.post("/workouts", async (req, res) => {
    try {
        let workout = await Workout.create ({
            workout: req.body.workout,
            reps: req.body.reps,
            user: req.body.user,
        });
        res.status(201).json(workout);
    } catch (err) {
        res.status(500).json({
            message: "Failed to create workout",
            error: err
        });
    }
});

// Get workout by id
app.get("/workouts/:id", async (req, res) => {
    let workout;
    // Get workout by id
    try {
        workout = await Workout.findById(req.params.id);
        if (!workout) {
            res.status(404).json({
                message: "workout not found"
            });
            return;
        }
    } catch (err) {
        res.status(500).json({
            message: `get request failed to get workout`,
            error: err,
        });
        return;
    }
    res.status(200).json(workout)
});


// Export app
module.exports = app;