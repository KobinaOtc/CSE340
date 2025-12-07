// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities =require('../utilities')
const invVal = require("../utilities/inventory-validation")

// Get inventory JSON (protected)
router.get(
  "/getInventory/:classification_id",
//   utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Error route
router.get("/trigger-error", utilities.handleErrors(invController.throwError));

// Inventory management page route
router.get("/", utilities.handleErrors(invController.buildManagementView));

// New Classication page route
router.get("/new-classification", utilities.handleErrors(invController.buildNewClassificationView))

// New Classification post route
router.post(
    "/new-classification", 
    invVal.newClassificationRules(), 
    invVal.checkNewClassificationData,
    utilities.handleErrors(invController.newClass)
)

// New Vehicle page route
router.get("/new-vehicle", utilities.handleErrors(invController.buildNewVehicleView))

// New Vehicle post route
router.post(
    "/new-vehicle",
    invVal.newVehicleRules(),
    invVal.checkNewVehicleData,
    utilities.handleErrors(invController.newVehicle)
)

// Route to build edit view by inventory ID
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

// Process inventory update
router.post(
  "/update",
  utilities.checkAccountType,
  invVal.updateVehicleRules(),
  invVal.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Build delete confirmation view route
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirmView));

// POST request Route to process the deletion
router.post("/delete", utilities.handleErrors(invController.deleteInventory));

module.exports = router;