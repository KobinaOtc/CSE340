// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities =require('../utilities')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Error route
router.get("/trigger-error", utilities.handleErrors(invController.throwError));

// Inventory management page route
router.get("/", utilities.handleErrors(invController.buildManagementView));

// New vehicle page route
router.get("/new-classification", utilities.handleErrors(invController.buildNewClassificationView))
module.exports = router;