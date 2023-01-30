const productModel = require('../model/productModel')
const ErrorHandler = require('../utils/errorHandler')
const CatchAsync = require('../middleware/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');


// Create Product
exports.createProduct = CatchAsync(async (req, res, next)=>{
    const product = await productModel.create(req.body);

    res.status(200).json({
        status: true,
        product
    })
})

// Updating product
exports.updateAProducts = CatchAsync(async (req, res, next)=>{
    const fetchProduct = await productModel.findById(req.params.id)
    if(!fetchProduct){
        return next(new ErrorHandler(`Product doesn't exist`, 500))
    }
    const productToUpdate = await productModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
    res.status(200).json({
        status: "Success",
        data: {
            productToUpdate
        }
    })
})


// Deleting a product
exports.deleteSingleProduct = CatchAsync(async (req, res, next)=>{
    const fetchProduct = await productModel.findById(req.params.id)
    if(!fetchProduct){
        return next(new ErrorHandler(`Product doesn't exist`, 500))
    }
    const productToDelete = await productModel.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: "Success",
        data: {
            productToDelete
        }
    })
})


// Getting all product
exports.getAllProducts = CatchAsync(async (req, res, next)=>{

    const resultPerPage = 5;

    // Product count for frontend to show
    const productCount = await productModel.countDocuments();
    
    const apiFeature = new ApiFeatures(productModel.find(), req.query).search().filter().pagination(resultPerPage)
    const fetchAllProduct = await apiFeature.query;

    // const fetchAllProduct = await productModel.find()
    if(!fetchAllProduct){
        return next(new ErrorHandler(`Product doesn't exist`, 500))
    }
    res.status(200).json({
        status: "Success",
        length: fetchAllProduct.length,
        Number_of_Products: productCount,
        data: {
            fetchAllProduct
        }
    })
})

// Getting single product
exports.getSinlgeProduct = CatchAsync(async (req, res, next)=>{
    const fetchAProduct = await productModel.findById(req.params.id)
    
    if(!fetchAProduct){
        return next(new ErrorHandler(`Product doesn't exist`, 500))
    }
    res.status(200).json({
        status: "Success",
        fetchAProduct
    })
})
