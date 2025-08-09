const express = require("express")
const router = express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const reviewValidation = require("../utilities/review-validation")

router.get("/new", utilities.checkLogin, async (req, res) => {
	const vehicle_id = req.query.vehicle_id
	let nav = await utilities.getNav()
	res.render("reviews/add", {
		title: "Leave a Review",
		nav,
		vehicle_id,
		accountData: req.accountData,
	})
})

router.get("/edit", utilities.checkLogin, async (req, res) => {
	const vehicle_id = req.query.vehicle_id
	const account_id = req.accountData.account_id
	let nav = await utilities.getNav()
	// Fetch user's review for this vehicle
	const reviewResult = await require("../models/review-model").getReviewsByVehicle(vehicle_id)
	const userReview = reviewResult.rows.find((r) => r.account_id === account_id)
	res.render("reviews/edit", {
		title: "Edit Review",
		nav,
		vehicle_id,
		accountData: req.accountData,
		userReview,
	})
})

router.post("/add", utilities.checkLogin, reviewValidation.checkAlreadyReviewed, reviewValidation.reviewRules(), reviewValidation.checkReviewData, reviewController.addReview)
router.post("/delete", utilities.checkLogin, reviewController.deleteReview)
router.post("/update", utilities.checkLogin, reviewValidation.reviewRules(), reviewValidation.checkReviewData, reviewController.updateReview)

module.exports = router
