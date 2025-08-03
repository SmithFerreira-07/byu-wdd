const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()

  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(account_password, 10)

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult && regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    messages: req.flash("notice"),
  })
}

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  
  try {
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      messages: req.flash("notice"),
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  } catch (error) {
    req.flash("notice", "Error loading account information.")
    res.redirect("/account/")
  }
}

/* ****************************************
*  Process account update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  
  try {
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updateResult) {
      req.flash("notice", "Account information updated successfully.")
      const accountData = await accountModel.getAccountById(account_id)
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 * 24 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 * 24 })
      res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, updating account information failed.")
      res.redirect("/account/update/" + account_id)
    }
  } catch (error) {
    req.flash("notice", "Sorry, updating account information failed.")
    res.redirect("/account/update/" + account_id)
  }
}

/* ****************************************
*  Process password update
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body
  
  if (!account_password || account_password.length === 0) {
    req.flash("notice", "Password is required.")
    return res.redirect("/account/update/" + account_id)
  }

  try {
    let hashedPassword = await bcrypt.hash(account_password, 10)
    
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, password update failed.")
      res.redirect("/account/update/" + account_id)
    }
  } catch (error) {
    req.flash("notice", "Sorry, password update failed.")
    res.redirect("/account/update/" + account_id)
  }
}

/* ****************************************
*  Process logout
* *************************************** */
async function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccount, 
  buildAccountUpdate, 
  updateAccount, 
  updatePassword,
  logout 
}
