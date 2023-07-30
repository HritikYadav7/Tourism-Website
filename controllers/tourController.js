const { findByIdAndDelete } = require('./../models/tourModel');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/appError')
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
    next();
};

exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync( async (req, res, next) => {
//     // console.log(req.requestTime);
//         // Execute Query
//         const features = new APIFeatures(Tour.find(), req.query)
//             .filter()
//             .sort()
//             .fieldsLimiting()
//             .pagination();

//         const tours = await features.query;
//         // const tours = await Tour.find()
//         //     .where('duration')
//         //     .equals(5)
//         //     .where('difficulty')
//         //     .equals('easy');

//         // Send Response
//         res.status(200).json({
//                 status: 'success', 
//                 requestedAt: req.requestTime,
//                 results: tours.length,
//                 data: {
//                     tours
//                 }
//             })
// })

// exports.getTour = factory.getOne(Tour, 'reviews');
exports.getTour = factory.getOne(Tour, {path: 'reviews'});

// exports.getTour = catchAsync( async (req, res, next) => {
//     // const tour = tours.find(el => el.id === id);
//     const tour = await Tour.findById(req.params.id).populate('reviews')
//     // Tour.findOne({ _id: req.param.id});
//     if(!tour) {
//         return next(new appError('No tour found with given ID', 404))
//     }
//     res.status(200).json({
//             status: 'success', 
//             data: {
//                 tour
//             }
//         })
// })


exports.createTour = factory.createOne(Tour);
// exports.createTour =  catchAsync(async (req, res, next) => {

//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//         status: 'success', 
//         data: {
//             tour: newTour
//         }
//     });
//     // try {
//     //     const newTour = new Tour({});
//     //     newTour.save();
    
//     // }
//     // catch(err) {
//     //     res.status(400).json({
//     //         status: 'failed',
//     //         message: err
//     //     })
//     // }
// })

exports.updateTour = factory.updateOne(Tour);
// exports.updateTour = catchAsync( async (req, res, next) => {

//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true // for checking validation rules
//     }); 
    
//     if(!tour) {
//         return next(new appError('No tour found with given ID', 404))
//     }
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
    
// });

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync( async (req, res, next) => {
    
//     const tour = await Tour.findByIdAndDelete(req.params.id);
//     if(!tour) {
//         return next(new appError('No tour found with given ID', 404))
//     }
    
    
//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
    
    
// })

exports.getTourStats = catchAsync( async (req, res, next) => {
    
        const stats  = await Tour.aggregate([
            {
                $match: { ratingsAverage : {$gte: 4.5}}
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty'},
                    numTours: { $sum: 1},
                    numRating: { $sum: '$ratingsQuantity'},
                    avgRating: { $avg: '$ratingsAverage'},
                    avgPrice: { $avg: '$price'},
                    minPrice: { $min: '$price'},
                    maxPrice: { $max: '$price'},
                }
            },
            {
                $sort: {
                    avgPrice: 1
                }
            }
            // {
            //     $match: { _id: { $ne: 'EASY'}}
            // }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    
})

exports.getMonthlyPlan = catchAsync( async (req, res, next) => {
   
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: { 
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates'},
                    numTourStarts: { $sum : 1},
                    tours: { $push : '$name'}
                }
            }, 
            {
                $addFields: { month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1}
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    
})


// /tours-within?distance=233&center=20,45&unit=mi
// /tours-within/233/center/23.179191, 80.027713/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if(!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng', 400))
    }
    console.log(distance, lat, lng, unit);

    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius]}}});

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    })
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const {latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if(!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng', 400))
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng*1, lat*1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ])

    res.status(200).json({
        status: 'success',
        results: distances.length,
        data: {
            data: distances
        }
    })
});