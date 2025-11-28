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
 *  Build Vehicle management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const selectClass = await utilities.buildClassList()
  res.render("./inventory/vehicle-management", {
    title: "Vehicle Management",
    nav,
    selectClass,
    errors: null,
  })
}

/* ***************************
 *  Build New Classification View
 * ************************** */
invCont.buildNewClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/new-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build New Vehicle View
 * ************************** */
invCont.buildNewVehicleView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const selectClass = await utilities.buildClassList()
  res.render("./inventory/new-vehicle", {
    title: "Add New Vehicle",
    nav,
    selectClass,
    errors: null,
  })
}

/* ***************************
 *  Process New Classification data
 * ************************** */
invCont.newClass = async function (req, res, next) {
  const { classification_name } = req.body;
  const regResult = await invModel.registerClassification(
    classification_name
  );
  if (regResult) {
    req.flash("success", `New classification added successfully.`);
    res.redirect("/inv");
  } else {
    let nav = await utilities.getNav();
    res.render("./inventory/new-classification", {
      title: "Add New Classification",
      nav,
      errors: "Failed to add new classification. Please try again.",
    });
  }
}

invCont.newVehicle = async function (req, res, next) {
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
  const regResult = await invModel.registerVehicle(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );
  if (regResult) {
    req.flash("success", `New vehicle added successfully.`);
    res.redirect("/inv");
  } else {
    const classificationSelect = await utilities.buildClassificationList();
    let nav = await utilities.getNav();
    res.render("./inventory/new-vehicle", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: "Failed to add new vehicle. Please try again.",
    });
  }
}

/* ***************************
 * Intentional 500 Error Generator
 * ************************** */
invCont.throwError = async function(req, res, next) {
    // This intentionally throws an error to test the error handler middleware
    throw new Error("Intentional 500 Error: You broke the server!")
}

module.exports = invCont