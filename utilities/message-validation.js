const utilities = require(".");
const { body, validationResult } = require("express-validator");
// Import the model needed to re-render the vehicle page on error
const invModel = require("../models/inventory-model"); 

const validate = {};

/* ******************************
 * New Inquiry Data Validation Rules
 * ***************************** */
validate.inquiryRules = () => {
    return [
        // message_subject is required and must be a string of reasonable length
        body("message_subject")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 5, max: 100 })
            .withMessage("Please provide a subject between 5 and 100 characters."),

        // message_body is required and must be a string of reasonable length
        body("message_body")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage("Please provide a detailed inquiry message (min 10 characters)."),

        // inv_id is required and must be a valid integer ID
        body("inv_id")
            .trim()
            .isInt()
            .withMessage("Vehicle ID is missing or invalid."),
    ];
};

/* ******************************
 * Check data and return errors or continue to controller
 * ***************************** */
validate.checkInquiryData = async (req, res, next) => {
    const { message_subject, message_body, inv_id } = req.body;
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const itemData = await invModel.getInventoryById(inv_id); // Fetch vehicle data for re-render

        if (!itemData) {
             // If vehicle data is missing, something is fundamentally wrong
             return next({status: 404, message: 'Vehicle not found for inquiry form.'});
        }
        
        // Rebuild necessary view components
        const card = await utilities.buildVehicleCard(itemData);
        const vecMake = `${itemData.inv_year} ${itemData.inv_make}`;
        
        // Re-render the vehicle detail page with errors and old input values
        res.render("vehicle/vehicle", {
            title: vecMake,
            nav,
            card,
            errors,
            inv_id,
            // Pass back submitted data to re-fill form fields
            message_subject, 
            message_body, 
        });
        return;
    }
    next();
};

module.exports = validate;