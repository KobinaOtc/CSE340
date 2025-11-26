const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
//   console.log("this is the data: ", data)
//   console.log("this is the classification Id", classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 * Intentional 500 Error Generator
 * ************************** */
invCont.throwError = async function(req, res, next) {
    // This intentionally throws an error to test the error handler middleware
    throw new Error("Intentional 500 Error: You broke the server!")
}

module.exports = invCont