const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

const MAX_REVIEW_LENGTH = 500

validate.reviewRules = () => {
  return [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5."),
    body("comment")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a comment.")
      .isLength({ max: MAX_REVIEW_LENGTH })
      .withMessage(`Comment must be ${MAX_REVIEW_LENGTH} characters or fewer.`)
  ]
}

validate.checkReviewData = async (req, res, next) => {
  const { vehicle_id, rating, comment } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("reviews/add", {
      errors,
      title: "Leave a Review",
      nav,
      vehicle_id,
      rating,
      comment,
      accountData: req.accountData
    })
    return
  }
  next()
}

validate.checkAlreadyReviewed = async (req, res, next) => {
  const { vehicle_id } = req.body
  const account_id = req.accountData.account_id
  const alreadyReviewed = await require("../models/review-model").hasUserReviewed(vehicle_id, account_id)
  if (alreadyReviewed) {
    req.flash("notice", "You have already reviewed this vehicle.")
    return res.redirect(`/inv/detail/${vehicle_id}`)
  }
  next()
}

module.exports = validate
