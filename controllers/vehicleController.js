const vecModel = require('../models/vehicle-model')

const vecCont = {}

// Build vehicle by inventory view
vecCont.buildByInvId = async function (req, res, next) {
    const inventory_id = req.params.inv_id
    const data = await vecModel.getVehicleById(inventory_id)
    // Set up the grid and navs from the utils

    const className = data[0].inv_make
    res.render('./inventory/vehicle', {
        title: className,
        // details of the page
    })
}

module.exports = vecCont