const dotenv = require("dotenv").config();

let port = process.env.PORT || 5050;

module.exports = {
    port: port,
    username: process.env.USER,
    password: process.env.PASS,
    secret: process.env.SECRET,
}