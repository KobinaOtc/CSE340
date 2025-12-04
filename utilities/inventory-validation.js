const utilities = require(".")
const { body, validationResult } = require("express-validator");

const validate = {}


/* ******************************
 * New Classification Data Validation Rules
 * ***************************** */
validate.newClassificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage(
            "Classification name must contain only letters and numbers, no spaces or special characters."
        ),
    ]
}

/* ******************************
 * New Vehicle Data Validation Rules
 * ***************************** */
validate.newVehicleRules = () => {
    return [
        // inv_make is a required string
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a vehicle make."), 
        // inv_model is a required string
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a vehicle model."), 
        // inv_year is a required valid year
        body("inv_year")
        .trim()
        .notEmpty()
        .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
        .withMessage("Please provide a valid vehicle year."), 
        // classification_id is required and must be a valid id
        body("classification_id")
        .trim()
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage("Please provide a valid classification."), 
        // inv_description is a required string
        body("inv_description")
        .trim()
        .notEmpty()
        .isLength({ min: 10 })
        .withMessage("Please provide a vehicle description."), 
        // image path is required
        body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Please provide an image path."), 
        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Please provide a thumbnail path."), 
        // inv_price is a required valid decimal
        body("inv_price")
        .trim()
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Please provide a valid price."), 
        // inv_miles is a required valid decimal
        body("inv_miles")
        .trim()
        .notEmpty()
        .isInt({ min: 0 })
        .withMessage("Please provide a valid mileage."), 
        // inv_color is a required string
        body("inv_color")
        .trim()
        .notEmpty()
        .withMessage("Please provide a vehicle color."), 
    ]
}

/* ******************************
 * Update Inventory Data Validation Rules
 * ***************************** */
// This should be nearly identical to newVehicleRules but ensures inv_id exists
validate.updateVehicleRules = () => {
    return [
        // inv_id is required
        body("inv_id")
            .trim()
            .isInt()
            .withMessage("Inventory ID is missing."),
        // inv_make is required and must meet pattern
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Make must be at least 3 characters."),
        // inv_model is a required string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a vehicle model."), 
        // inv_year is a required valid year
        body("inv_year")
            .trim()
            .notEmpty()
            .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
            .withMessage("Please provide a valid vehicle year."),
        // inv_description is a required string
        body("inv_description")
            .trim()
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage("Please provide a vehicle description."), 
        // image path is required
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Please provide an image path."), 
            body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Please provide a thumbnail path."), 
        // inv_price is a required valid decimal
        body("inv_price")
            .trim()
            .notEmpty()
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price."), 
        // inv_miles is a required valid decimal
        body("inv_miles")
            .trim()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide a valid mileage."), 
        // inv_color is a required string
        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Please provide a vehicle color."),
        // classification_id is required and must be selected
        body("classification_id")
            .trim()
            .isInt()
            .withMessage("Classification is required."),
    ]
}

/* ******************************
 * Check data and return errors or continue to next function
 * ***************************** */
validate.checkNewClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;
    res.render("inventory/new-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
}

/* ******************************
 * Check vehicle data and return errors or continue to next function
 * ***************************** */
validate.checkNewVehicleData = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next();
    }

    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body;
    let nav = await utilities.getNav();
    // Use the submitted classification_id to re-select the correct option
    const selectClass = await utilities.buildClassList(classification_id);

    res.render("inventory/new-vehicle", {
        errors,
        title: "Add New Vehicle",
        nav,
        selectClass,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        // All submitted values are passed back to keep fields filled
    });
    return;
}

/* ******************************
 * Check data on update and return errors or continue to next function
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Vehicle",
      nav,
      classificationSelect,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};


module.exports = validate