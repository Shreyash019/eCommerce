const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenToken  = require('../utils/authToken')

router.route('/product').get(productController.getAllProducts)
router.route('/newproduct').post(authenToken.isAuthenticateUser, authenToken.isUserAdmin("admin"), productController.createProduct)
router.route('/product/:id')
    .get(productController.getSinlgeProduct)
    .put(authenToken.isAuthenticateUser, authenToken.isUserAdmin("admin"), productController.updateAProducts)
    .delete(authenToken.isAuthenticateUser, authenToken.isUserAdmin("admin"),productController.deleteSingleProduct)

router.route('/review')
    .get(authenToken.isAuthenticateUser, productController.getProductReviews)
    .put(productController.createProductReview)
    .delete(authenToken.isAuthenticateUser, productController.deleteProductReviews)


module.exports = router;