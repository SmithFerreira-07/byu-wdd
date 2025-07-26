// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// GET route for My Account page
router.get("/", utilities.handleErrors(accountController.buildAccount));


// GET route for Login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));


// GET route for Registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// POST route for Registration form submission
router.post('/register', utilities.handleErrors(accountController.registerAccount));

module.exports = router;
