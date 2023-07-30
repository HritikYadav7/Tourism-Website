const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/appError')
const APIFeatures = require('./../utils/apiFeatures')


exports.deleteOne = Model => catchAsync( async (req, res, next) => {
    
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc) {
        return next(new appError('No document found with given ID', 404))
    }
    res.status(204).json({
        status: 'success',
        data: null
    }); 
});

exports.updateOne = Model => catchAsync( async (req, res, next) => {

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true // for checking validation rules
    }); 
    
    if(!doc) {
        return next(new appError('No document found with given ID', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
    
});

exports.createOne = Model =>  catchAsync(async (req, res, next) => {

    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success', 
        data: {
            data: doc
        }
    });
});

exports.getOne = (Model, popOptions) => catchAsync( async (req, res, next) => {
    // const tour = tours.find(el => el.id === id);
    let query = Model.findById(req.params.id);
    // console.log(popOptions);
    if(popOptions) query = query.populate(popOptions);

    const doc = await Model.findById(req.params.id);

    if(!doc) {
        return next(new appError('No tour found with given ID', 404))
    }
    res.status(200).json({
            status: 'success', 
            data: {
                data: doc
            }
        })
})

exports.getAll = Model => catchAsync( async (req, res, next) => {

        // To Allow for nested GET reviews on tour (hack)
        let filter = {};
        if(req.params.tourId) filter = {tour: req.params.tourId}
        
        const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .sort()
            .fieldsLimiting()
            .pagination();

        // const doc = await features.query.explain();
        const doc = await features.query;

        res.status(200).json({
                status: 'success', 
                requestedAt: req.requestTime,
                results: doc.length,
                data: {
                    data: doc
                }
            })
    
})