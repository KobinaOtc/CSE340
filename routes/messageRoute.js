const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const utilities =require('../utilities')
const msgValidate = require('../utilities/message-validation') // Import the new validation

// Route to process a new client inquiry submission (POST)
// Path resolves to /message/send-inquiry
router.post(
    "/send-inquiry",
    utilities.checkLogin, // Ensure user is logged in
    msgValidate.inquiryRules(), // Apply validation rules
    msgValidate.checkInquiryData, // Check validation results
    utilities.handleErrors(messageController.processInquiry) // Process the submission
)

// Route to build the Employee/Admin Message Inbox View (GET)
// Path resolves to /message/
router.get(
    "/",
    utilities.checkLogin, // Ensure user is logged in
    utilities.checkAccountType, // Only allow Employee/Admin access
    utilities.handleErrors(messageController.buildInbox) 
)

module.exports = router