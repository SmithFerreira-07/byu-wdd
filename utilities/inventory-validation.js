const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classification_name is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name.")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Classification name cannot contain spaces or special characters."),
    ]
  }

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
      // classification_id is required and must be string
      body("classification_id")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification."),

      // inv_make is required and must be string
      body("inv_make")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a make."),

      // inv_model is required and must be string
      body("inv_model")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a model."),

      // inv_year is required and must be a 4-digit number
      body("inv_year")
        .trim()
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide a 4-digit year."),

      // inv_description is required and must be string
      body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a description."),

      // inv_image is required and must be string
      body("inv_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide an image path."),

      // inv_thumbnail is required and must be string
      body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a thumbnail path."),

      // inv_price is required and must be a number
      body("inv_price")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a price."),

      // inv_miles is required and must be a number
      body("inv_miles")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide miles."),

      // inv_color is required and must be string
      body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a color."),
    ]
    }

module.exports = validate