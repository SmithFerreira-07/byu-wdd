// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);
router.get("/", utilities.checkAccountType, invController.buildManagementView);
router.get("/add-classification", utilities.checkAccountType, invController.buildAddClassificationView);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.post(
    "/add-classification",
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invController.addClassification
  );


router.get("/edit/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView));
router.get("/delete/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventoryView));
router.get("/add-inventory", utilities.checkAccountType, invController.buildAddInventoryView);

router.post(
    "/update",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
  );

router.post(
    "/delete",
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
  );

router.post(
    "/add-inventory",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
  );

module.exports = router;