const express = require('express')
const router = new express.Router()
const vecController = require('../controllers/vehicleController')

router.get('/type/model/:inv_id', vecController.buildByInvId)

module.exports = router