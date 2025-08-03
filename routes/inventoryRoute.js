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


router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventoryView));
router.get("/add-inventory", invController.buildAddInventoryView);

// Route to process the update inventory request
router.post(
    "/update",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
  );

router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
  );

module.exports = router;