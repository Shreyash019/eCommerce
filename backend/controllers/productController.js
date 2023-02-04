const productModel = require('../model/productModel')
const ErrorHandler = require('../utils/errorHandler')
const CatchAsync = require('../middleware/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');


// Create Product
exports.createProduct = CatchAsync(async (req, res, next)=>{

    req.body.createdByUser= req.user.id

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
        useFindAndModify: false
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


// Create a review and update a review
exports.createProductReview = CatchAsync( async(req, res, next)=>{
    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const product = await productModel.findById(productId);

    const isReviewed = product.reviews.find(rev=> rev.user.toString() === req.user._id.toString())

    if(isReviewed){
        product.reviews.forEach(rev=> {
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = rating,
                rev.comment=comment
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach(rev=>{
        avg+= rev.rating
    })
    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success: true
    })
})


// Get All reviews of a Product
exports.getProductReviews = CatchAsync( async(req, res, next)=>{
    const product = await productModel.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler(`Product not found`, 404))
    }
    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
})

// Delete Review
exports.deleteProductReviews = CatchAsync( async(req, res, next)=>{
    const product = await productModel.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler(`Product not found`, 404))
    }

    const reviews = product.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString())

    let avg = 0;

    reviews.forEach(rev=>{
        avg+= rev.rating
    })
    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length

    await productModel.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false

    }
    )

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success:true,
    })
})