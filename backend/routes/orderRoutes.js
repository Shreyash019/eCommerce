const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenToken  = require('../utils/authToken');

router.route('/order/new').post(authenToken.isAuthenticateUser, orderController.newOrder);
router.route('/order/:id').get(authenToken.isAuthenticateUser, orderController.getSingleOrder);
router.route('/orders').get(authenToken.isAuthenticateUser, orderController.getMyOrders)

router.route('/admin/orders').get(authenToken.isAuthenticateUser, authenToken.isUserAdmin("admin"), orderController.getAllOrdersByAdmin);

router.route('/admin/orders/:id')
    .put(authenToken.isAuthenticateUser, authenToken.isUserAdmin("admin"), orderController.updateOrderStatusByAdmin)
    .delete(authenToken.isAuthenticateUser, authenToken.isUserAdmin("admin"), orderController.deleteOrderByAdmin)

module.exports = router;