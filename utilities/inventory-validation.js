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
};

module.exports = validate