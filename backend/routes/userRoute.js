const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/userregister').post(userController.userRegistraion)
router.route('/userlogin').post(userController.loginUser)
router.route('/userlogout').get(userController.logoutUser)



module.exports = router;