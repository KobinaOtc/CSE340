const invModel = require('../models/inventory-model')
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function(req, res, next) {
    let data = await invModel.getClassifications()
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += '<li>'
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            '</a>'
            list += '</li>'
    })
    list += '</ul>'
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildVehicleCard = async function (data) {
    // console.log(data)
    return `
    <div class="card-view-detail">
        <div class="image-column">
            <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
        </div>
        <div class = "info-column">
            <div class="text-container">
                <div class="detail-title">
                    <p>${data.inv_make}</p>
                </div>
                <div class="price-row">
                    <p>Price: <strong class="price-value">$${new Intl.NumberFormat('en-US').format(data.inv_price)}.00</strong></p>
                </div>
                <div class="description-row">
                    <p>Description: ${data.inv_description}</p>
                </div>
                <div class="detail-row">
                    <p>Color: ${data.inv_color}</p>
                </div>
                <div class="detail-row">
                    <p><span class="detail-row">Miles:</span> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</p>
                </div>
            </div>
        </div>
    </div>
    `
}

Util.buildClassList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classList = '<select name="classification_id" id="classificationList" required>'
    classList += '<option value="">Choose a Classification</option>'

    data.rows.forEach((row) => {
        classList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null 
            && row.classification_id == classification_id
        ) {
            classList + ' selected '
        }
        classList += '>' + row.classification_name + '</option>'
    })
    classList += '</select>'
    return classList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util