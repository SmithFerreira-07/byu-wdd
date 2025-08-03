// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// GET route for My Account page
router.get("/", utilities.handleErrors(accountController.buildAccount));


// GET route for Login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));


// GET route for Registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));


// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;
