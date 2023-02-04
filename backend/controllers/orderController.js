const OrderModel = require('../model/orderModel');
const ProductModel = require('../model/productModel');
const ErrorHandler = require('../utils/errorHandler');
const CatchAsync = require('../middleware/catchAsync');

exports.newOrder = CatchAsync( async(req, res, next)=>{
    const {shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;

    const order = await OrderModel.create({
        shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice,
        paidAt: Date.now(),
        user:req.user._id
    });

    res.status(200).json({
        success: true,
        order
    })
})

// Get Single Order
exports.getSingleOrder = CatchAsync( async(req, res, next)=>{
    const order = await OrderModel.findById(req.params.id).populate({
        path: "User",
        strictPopulate: false,
        select: "name email",
      });

    if(!order){
        return next(new ErrorHandler(`Order not found with Id`, 404));
    }

    res.status(200).json({
        success: true,
        order,
    })
})


// Get logged In user orders
exports.getMyOrders = CatchAsync( async(req, res, next)=>{
    const order = await OrderModel.find({user: req.user._id})

    if(!order){
        return next(new ErrorHandler(`Orders not found.`, 404));
    }

    res.status(200).json({
        success: true,
        order,
    })
});


// Get All Orders for Admin
exports.getAllOrdersByAdmin = CatchAsync( async(req, res, next)=>{
    const orders = await OrderModel.find()

    if(!orders){
        return next(new ErrorHandler(`Orders not found.`, 404));
    }

    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount+=order.totalPrice
    })

    res.status(200).json({
        success: true,
        Total_Amount: totalAmount,
        orders,
    })
})


// Update Order Status by Admin
exports.updateOrderStatusByAdmin = CatchAsync( async(req, res, next)=>{
    const orders = await OrderModel.findById(req.params.id);
    if(!orders){
        return next(new ErrorHandler(`Orders not found.`, 404));
    }
    if(orders.orderStatus === "Delivered"){
        return next(new ErrorHandler(`You have already delivered this order.`, 404));
    }
    orders.orderItems.forEach(async (order)=>{
        await updateStocks(order.product, order.quantity);
    });
    orders.orderStatus = req.body.status;
    if(req.body.status === "Delivered"){
        orders.deliverdAt = Date.now();
    }
    
    await orders.save({validateBeforSave: false});

    res.status(200).json({
        success: true,
        orders,
    })
})

async function updateStocks(id, quantity){
    const product = await ProductModel.findOne(id);
    product.stock -= quantity
    await product.save({validateBeforeSave: false}).then(()=>console.log('Yes')).catch(err=>console.log(err))
}


// Delete Order for Admin
exports.deleteOrderByAdmin = CatchAsync( async(req, res, next)=>{
    const order = await OrderModel.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler(`Orders not found.`, 404));
    }

    await order.remove()

    res.status(200).json({
        success: true,
    })
})