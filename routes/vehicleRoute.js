const express = require('express')
const router = new express.Router()
const vecController = require('../controllers/vehicleController')
const utilities =require('../utilities')

router.get('/:inv_id', utilities.handleErrors(vecController.buildByInvId))

module.exports = router