const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const utilities =require('../utilities')
const msgValidate = require('../utilities/message-validation') 

// Route to process a new client inquiry submission (POST)
router.post(
    "/send-inquiry",
    utilities.checkLogin, 
    msgValidate.inquiryRules(), 
    msgValidate.checkInquiryData, 
    utilities.handleErrors(messageController.processInquiry) 
)

// Route to build the Employee/Admin Message Inbox View (GET)
router.get(
    "/",
    utilities.checkLogin, 
    utilities.checkAccountType, 
    utilities.handleErrors(messageController.buildInbox) 
)

// NEW: Route to build Message Detail View
router.get(
    "/detail/:message_id",
    utilities.checkLogin, 
    utilities.checkAccountType, 
    utilities.handleErrors(messageController.buildMessageDetail)
)

// NEW: Route to handle message status update (Mark as Read/Unread)
router.get( 
    "/mark-read/:message_id",
    utilities.checkLogin, 
    utilities.checkAccountType, 
    utilities.handleErrors(messageController.markAsRead)
)

// NEW: Route to build Delete Confirmation View
router.get(
    "/delete/:message_id",
    utilities.checkLogin, 
    utilities.checkAccountType, 
    utilities.handleErrors(messageController.buildDeleteConfirm)
)

// NEW: Route to process the actual message deletion
router.post(
    "/delete",
    utilities.checkLogin, 
    utilities.checkAccountType, 
    utilities.handleErrors(messageController.deleteMessage)
)

module.exports = router