// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities =require('../utilities')
const regValidate = require('../utilities/account-validation')

// Default route for account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

router.get('/login', utilities.handleErrors(accountController.buildLogin));
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin),
)
router.get('/register', utilities.handleErrors(accountController.buildRegister));
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;