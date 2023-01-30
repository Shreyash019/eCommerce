const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.route('/').get(productController.getAllProducts)
router.route('/newproduct').post(productController.createProduct).get(productController.getSinlgeProduct)
router.route('/product/:id')
    .get(productController.getSinlgeProduct)
    .put(productController.updateAProducts)
    .delete(productController.deleteSingleProduct)

module.exports = router;