const URL = "http://localhost:8080"

var app = new Vue({
    el: "#app",
    data: {
        currentPage: "login-page",

        signupUsername: "",
        signupPassword: "",

        loginUsername: "",
        loginPassword: "",

        errorMessage: "",

        currentUser: null,

        workouts: [],

        trackedWorkouts: [],
        selectedWorkout: "",
        selectedReps: "1",
        currentWorkout: "",
    },
    methods: {
        changePage: function (page) {
            this.currentPage = page;
        },

        // GET /login - Ask server if we are logged in
        getLogin: async function () {
            let response = await fetch(`${URL}/login`, {
                method: "GET",
                credentials: "include"
            });

            // Check if logged in
            if (response.status == 200) {
                // logged in
                console.log("logged in");
                let data = await response.json();
                this.currentUser = data.username;
                this.currentPage = "home-page"
            } else if (response.status == 401) {
                // not logged in
                console.log("not logged in");
                let data = await response.json();
                console.log(data);
            } else {
                console.log("error GETTING /login", response.status, response);
            }
        },

        // POST /login - Attempt to login
        postLogin: async function () {
            let loginCredentials = {username: this.loginUsername, password: this.loginPassword}
            let response = await fetch(`${URL}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginCredentials)
            }); 

            // Parse response body
            let body = response.json();
            console.log(body);

            // Check if login was successful
            if (response.status == 201) {
                console.log("Successful login attempt");

                // Take user to new page and clear inputs
                this.currentPage = "home-page";
                this.loginUsername = "";
                this.loginPassword = "";

            } else if (response.status == 401) {
                console.log("Unsuccessful login attempt")
                this.errorMessage = "Unsuccessful login attempt. Check email and password"
                setInterval(() => {
                    this.errorMessage = "";
                }, 5000);
                // Let user know login failed and clear password input
                this.loginPasswordInput = "";
            } else {
                console.log("error POSTING /login", response.status, response);
                this.errorMessage = "Ensure all fields are filled out and email is valid"
                setInterval(() => {
                    this.errorMessage = "";
                }, 5000);
            }
        },

        // POST /users - Create new user
        postUser: async function () {
            let newUser = {
                username: this.signupUsername,
                password: this.signupPassword,
            }
            let response = await fetch(`${URL}/user`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            }); 

            // Parse response body
            let body = response.json();
            console.log(body);

            // Check if user was created
            if (response.status == 201) {
                console.log("Successful user creation");

                // Take user to new page and clear inputs
                this.currentPage = "login-page";
                this.signupUsername = "";
                this.signupPassword = "";

            } else if (response.status == 400) {
                console.log("Unsuccessful user creation");
                this.errorMessage = "Unsuccessful user creation"
                setInterval(() => {
                    this.errorMessage = "";
                }, 5000);

                // Let user know user creation failed and clear inputs
                this.signupUsername = "";
                this.signupPassword = "";
            } else {
                console.log("error POSTING /user", response.status, response);
                this.errorMessage = "Ensure all fields are filled out and email is valid"
                setInterval(() => {
                    this.errorMessage = "";
                }, 5000);
            }
        },

        // GET /workouts - Get all workouts
        getWorkouts: async function () {
            let response = await fetch(`${URL}/workouts`)

            // Check if workouts were retrieved
            if (response.status == 200) {
                console.log("Successful workout retrieval");
                let data = await response.json();
                this.workouts = data;
            } else if (response.status == 401) {
                console.log("Unsuccessful workout retrieval");
            } else {
                console.log("error GETTING /workouts", response.status, response);
            }
        },

        // POST /workouts - Create new workout
        postWorkout: async function () {
            let newWorkout = {
                workout: this.currentWorkout,
                reps: parseInt(this.selectedReps),
                user: this.currentUser,
            }
            let response = await fetch(`${URL}/workouts`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newWorkout)
            });

            if (response.status == 201) {
                console.log("Successful workout creation");
                this.getWorkouts();
            } else {
                console.log("error POSTING /workouts", response.status, response);
            }
        },

        // // Track selected workout
        // addWorkout: function () {
        //     let workout = {
        //         workout: this.selectedWorkout,
        //         reps: parseInt(this.selectedReps),
        //     }
        //     if (this.trackedWorkouts.length == 0) {
        //         this.trackedWorkouts.push(workout);
        //     } else {
        //         for (let i = 0; i < this.trackedWorkouts.length; i++) {
        //             if (this.trackedWorkouts[i].workout == this.selectedWorkout) {
        //                 this.trackedWorkouts[i].reps += parseInt(this.selectedReps);
        //                 return;
        //             }
        //         }
        //         this.trackedWorkouts.push(workout);
        //     }

        //     this.selectedWorkout = "";
        //     this.selectedReps = "1";
        // },

        workoutPage: function () {
            this.currentPage = "workout-page";
        },

        // GET single workout by id
        getSingleWorkout: async function (id) {
            let response = await fetch(`${URL}/workouts/${id}`)

            // Check if workout was retrieved
            if (response.status == 200) {
                this.currentWorkout = await response.json();
                this.currentPage = "workout-page";
            } else if (response.status == 401) {
                console.log("Unsuccessful workout retrieval");
            } else {
                console.log("error GETTING /workouts", response.status, response);
            }
        }
    },
    created: function () {
        this.getLogin();
        this.getWorkouts();
    }
})