// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);
router.get("/", invController.buildManagementView);
router.get("/add-classification", invController.buildAddClassificationView);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invController.addClassification
  );

router.get("/add-inventory", invController.buildAddInventoryView);

router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invController.addInventory
  );

module.exports = router;