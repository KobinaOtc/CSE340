const vecModel = require('../models/vehicle-model')
const utilities = require('../utilities')

const vecCont = {}

// Build vehicle by inventory view
vecCont.buildByInvId = async function (req, res, next) {
    const inventory_id = req.params.inv_id
    const data = await vecModel.getVehicleById(inventory_id)
    // Set up the grid and navs from the utils

    if (!data) {
        return next({status: 404, message: 'Sorry, no vehicle information found for that ID.'})
    }

    const vecMake = `${data.inv_year} ${data.inv_make}`
    let nav = await utilities.getNav()
    let card = await utilities.buildVehicleCard(data)
    res.render('./vehicle/vehicle', {
        title: vecMake,
        nav,
        // details of the page
        card,
        errors: null,
    })
}

module.exports = vecCont