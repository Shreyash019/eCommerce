const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenToken  = require('../utils/authToken')

router.route('/userregister').post(userController.userRegistraion)
router.route('/userlogin').post(userController.loginUser)
router.route('/userlogout').get(userController.logoutUser)

router.route('/passwordupdate').put(authenToken.isAuthenticateUser, userController.userPasswordUpdate)
router.route('/password/forgot').post(userController.forgotPassword)
router.route('/password/reset/:token').put(userController.resetPassword)

router.route('/userprofile').get(authenToken.isAuthenticateUser, userController.getUserDetails)
router.route('/updateprofile').put(authenToken.isAuthenticateUser, userController.updateUserDetails)


router.route('/admin/users').get(authenToken.isAuthenticateUser, authenToken.isUserAdmin("admin"), userController.getAllUsersByAdmin)
router.route('/admin/user/:id')
    .get(authenToken.isAuthenticateUser, authenToken.isUserAdmin("admin"), userController.getSingleUserDetailByAdmin)
    .put(authenToken.isAuthenticateUser, authenToken.isUserAdmin("admin"), userController.updateUserRoleByAdmin)
    .delete(authenToken.isAuthenticateUser, authenToken.isUserAdmin("admin"), userController.deleteUserByAdmin)

module.exports = router;