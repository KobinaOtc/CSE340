const messageModel = require("../models/message-model");
const utilities = require("../utilities/");

const messageCont = {};

/* ***************************
 * Process New Client Inquiry
 * ************************** */
messageCont.processInquiry = async function (req, res) {
    const { message_subject, message_body, inv_id } = req.body;
    
    // account_from_id comes from the logged-in user 
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
        res.redirect("/inv/detail/" + inv_id);
    } else {
        req.flash(
            "notice",
            "Sorry, the inquiry submission failed. Please try again."
        );
        res.redirect("/inv/detail/" + inv_id);
    }
};

/* ***************************
 * Build the Employee/Admin Message Inbox View
 * ************************** */
messageCont.buildInbox = async function (req, res) {
    let nav = await utilities.getNav();
    const messageData = await messageModel.getMessages(); 

    // Use the utility function to build the table
    const inboxTable = await utilities.buildInboxTable(messageData); 

    res.render("message/inbox", {
        title: "Message Inbox",
        nav,
        inboxTable, 
        errors: null,
    });
};

/* ***************************
 * Build the Message Detail View
 * Route: /message/detail/:message_id
 * ************************** */
messageCont.buildMessageDetail = async function (req, res, next) {
    const message_id = parseInt(req.params.message_id);
    const messageData = await messageModel.getMessageById(message_id);

    if (!messageData) {
        return next({ status: 404, message: 'Sorry, no message found for that ID.' });
    }
    
    // Set message as read upon opening the detail view
    const is_read = true;
    await messageModel.markMessageRead(message_id, is_read); 

    let nav = await utilities.getNav();
    res.render("message/message-detail", {
        title: "Message Detail",
        nav,
        messageData,
        errors: null,
    });
};

/* ***************************
 * Handle Message Status Toggle
 * Route: /message/mark-read/:message_id
 * ************************** */
messageCont.markAsRead = async function (req, res, next) {
    const message_id = parseInt(req.params.message_id);
    const messageData = await messageModel.getMessageById(message_id);

    if (!messageData) {
        req.flash("notice", "Message not found.");
        return res.redirect("/message");
    }

    // Determine the new status (toggle the current status)
    const newStatus = !messageData.message_is_read; 

    const updateResult = await messageModel.markMessageRead(message_id, newStatus);

    if (updateResult) {
        const statusText = newStatus ? "read" : "unread";
        req.flash("notice", `Message "${messageData.message_subject}" marked as ${statusText}.`);
        res.redirect("/message");
    } else {
        req.flash("notice", "Sorry, the status update failed.");
        res.redirect("/message");
    }
};

/* ***************************
 * Build Delete Confirmation View
 * Route: /message/delete/:message_id
 * ************************** */
messageCont.buildDeleteConfirm = async function (req, res, next) {
    const message_id = parseInt(req.params.message_id);
    const messageData = await messageModel.getMessageById(message_id);

    if (!messageData) {
        return next({ status: 404, message: 'Sorry, no message found for deletion confirmation.' });
    }

    let nav = await utilities.getNav();
    res.render("message/delete-confirm", {
        title: "Delete Message",
        nav,
        messageData,
        errors: null,
    });
};

/* ***************************
 * Process Message Deletion
 * Route: POST /message/delete
 * ************************** */
messageCont.deleteMessage = async function (req, res, next) {
    const { message_id } = req.body; 
    const deleteResult = await messageModel.deleteMessage(message_id);

    if (deleteResult) {
        req.flash("notice", `The message was successfully deleted.`);
        res.redirect("/message");
    } else {
        req.flash("notice", "Sorry, the deletion failed.");
        res.redirect(`/message/delete/${message_id}`);
    }
};

module.exports = messageCont;