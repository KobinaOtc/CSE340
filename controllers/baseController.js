const utilities = require('../utilities/')
const { renderContent, renderReviews } = require("../public/js/script");
const baseController = {}

baseController.buildHome = async function(req, res) {
    const nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render('index', {
        title: 'Home',
        nav,
        content: renderContent(),
        reviews: renderReviews(),
        errors: null,
    })
}

/* ***************************
 * Intentional 500 Error Generator
 * ************************** */
baseController.throwError = async function(req, res, next) {
    // This intentionally throws an error to test the error handler middleware
    throw new Error("Intentional 500 Error: You broke the server!")
}

module.exports = baseController