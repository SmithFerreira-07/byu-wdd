const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

async function deleteReview(req, res) {
  const { vehicle_id } = req.body
  const account_id = req.accountData.account_id
  try {
    await reviewModel.deleteReview(vehicle_id, account_id)
    req.flash("notice", "Review deleted successfully.")
  } catch (error) {
    req.flash("notice", "Error deleting review.")
  }
  res.redirect(`/inv/detail/${vehicle_id}`)
}

async function addReview(req, res) {
  const { vehicle_id, rating, comment } = req.body
  const account_id = req.accountData.account_id

  if (!rating || rating < 1 || rating > 5 || !comment) {
    req.flash("notice", "Invalid review data.")
    return res.redirect(`/inv/detail/${vehicle_id}`)
  }

  try {
    await reviewModel.addReview(vehicle_id, account_id, rating, comment)
    req.flash("notice", "Review added successfully.")
  } catch (error) {
    req.flash("notice", "Error adding review.")
  }
  res.redirect(`/inv/detail/${vehicle_id}`)
}

async function updateReview(req, res) {
  const { vehicle_id, rating, comment } = req.body
  const account_id = req.accountData.account_id

  if (!rating || rating < 1 || rating > 5 || !comment) {
    req.flash("notice", "Invalid review data.")
    return res.redirect(`/inv/detail/${vehicle_id}`)
  }

  try {
    await reviewModel.updateReview(vehicle_id, account_id, rating, comment)
    req.flash("notice", "Review updated successfully.")
  } catch (error) {
    req.flash("notice", "Error updating review.")
  }
  res.redirect(`/inv/detail/${vehicle_id}`)
}

module.exports = { addReview, deleteReview, updateReview }
