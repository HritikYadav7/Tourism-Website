const Review = require('./../models/reviewModel');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');


exports.setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

// exports.getAllReviews = catchAsync( async (req, res, next) => {

//     let filter = {};
//     if(req.params.tourId) filter = {tour: req.params.tourId}

//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: 'success',
//         requestedAt: req.requestTime,
//         results: reviews.length,
//         data: {
//             reviews
//         }
//     });
// });

// exports.createReview = catchAsync( async (req, res, next) => {

//     const newReview = await Review.create(req.body);
    
//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     });
// });

// exports.getReviews = catchAsync( async (req, res, next) => {
//     const review = await Review.findById(req.params.id);
//     if(!review) {
//         return next(new appError('No review found with given ID', 404))
//     }
//     res.status(200).json({
    //         status: 'success',
//         requestedAt: req.requestTime,
//         data: {
//             review
//         }
//     });
// });