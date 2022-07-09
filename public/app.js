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
                console.log(data);
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
    },
    created: function () {
        this.getLogin();
    }
})