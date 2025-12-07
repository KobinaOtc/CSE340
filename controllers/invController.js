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

/* ***************************
 *  Process New Vehicle data
 * ************************** */
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
    req.flash("notice", `New vehicle added successfully.`);
    res.redirect("/inv");
  } else { 
    const selectClass = await utilities.buildClassList(classification_id); 
    let nav = await utilities.getNav();
    
    res.render("./inventory/new-vehicle", {
      title: "Add New Vehicle",
      nav,
      selectClass,
      errors: "Failed to add new vehicle. Please try again. Check your database constraints for detailed errors.",
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
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
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

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
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
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  
  // FIX: Safely check if the array has content before accessing the first element.
  if (invData.length > 0) { 
    return res.json(invData)
  } else {
    // Instead of calling next(new Error(...)) which returns HTML, 
    // return an empty JSON array, which is standard for an API with no results.
    return res.json([])
  }
}

/* ***************************
* Build edit inventory view
* ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassList(itemData.classification_id)
  
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id, // Pass the ID back for re-selection
  })
}

/* ***************************
 *  Build Delete Vehicle View
 * ************************** */
invCont.buildDeleteConfirmView = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inventory_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
  })
}

/* ***************************
 *  Process Vehicle Deletion
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model } = req.body;
  const deleteResult = await invModel.deleteInventory(inv_id);
  if (deleteResult) {
    req.flash("notice", `The deletion was successful.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect("/inv/delete/" + inv_id);
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