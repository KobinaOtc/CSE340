const messageModel = require("../models/message-model");
const utilities = require("../utilities/");

const messageCont = {};

/* ***************************
 * Process New Client Inquiry
 * Route: /inv/detail/send-inquiry
 * ************************** */
messageCont.processInquiry = async function (req, res) {
    const { message_subject, message_body, inv_id } = req.body;
    
    // account_from_id comes from the logged-in user (res.locals.accountData set by checkJWTToken)
    const account_from_id = res.locals.accountData.account_id;

    const result = await messageModel.addInquiry(
        message_subject,
        message_body,
        inv_id,
        account_from_id
    );

    if (result) {
        req.flash(
            "notice",
            `Thank you for your inquiry! We will respond shortly.`
        );
        // Redirect back to the specific vehicle detail page
        res.redirect("/inv/detail/" + inv_id);
    } else {
        req.flash(
            "notice",
            "Sorry, the inquiry submission failed. Please try again."
        );
        // Redirect back to the specific vehicle detail page
        res.redirect("/inv/detail/" + inv_id);
    }
};

/* ***************************
 * Build the Employee/Admin Message Inbox View
 * Route: /message/
 * ************************** */
messageCont.buildInbox = async function (req, res) {
    let nav = await utilities.getNav();
    const messageData = await messageModel.getMessages();
    let inboxTable = '<h2>Your Inbox</h2>';
    if (messageData.length > 0) {
        inboxTable += '<p>Message data retrieved, table rendering coming soon!</p>';
    } else {
        inboxTable += '<p>Your inbox is currently empty.</p>';
    }

    res.render("message/inbox", {
        title: "Message Inbox",
        nav,
        inboxTable,
        errors: null,
    });
};

messageCont.buildInbox = async function (req, res) {
    let nav = await utilities.getNav();
    const messageData = await messageModel.getMessages(); 

    // Use the new utility function to build the table
    const inboxTable = await utilities.buildInboxTable(messageData); 

    res.render("message/inbox", {
        title: "Message Inbox",
        nav,
        inboxTable, // Pass the rendered HTML table
        errors: null,
    });
};

module.exports = messageCont;