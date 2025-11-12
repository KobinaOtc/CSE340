const utilities = require('../utilities/')
const { renderContent, renderReviews } = require("../public/js/script");
const baseController = {}

baseController.buildHome = async function(req, res) {
    const nav = await utilities.getNav()
    res.render('index', {
        title: 'Home',
        nav,
        content: renderContent(),
        reviews: renderReviews(),
    })
}

module.exports = baseController