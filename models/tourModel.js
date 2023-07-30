const mongoose = require('mongoose');
const slugify = require('slugify');
const Review = require('./../models/reviewModel');

const validator = require('validator');
const User = require('./userModel')

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      requred: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have greater or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contains characters']  
      // also spaces not allowed in isAplha
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"],
        enum: {
          values: ['easy', 'medium', 'difficult'],
          message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.6666 => 5 
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
          validator: function(val) {
            // this only works for new documents
            return val < this.price; // 100 < 200 : true
          },
          message: 'Discount price ({VALUE}) should be below regular price'
        } 
    },
    summary: {
        type: String,
        required: [true, 'A tour must have a summary'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
      },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJson 
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number        
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
  });

  // tourSchema.index({ price: 1});
  tourSchema.index({ price: 1, ratingsAverage: -1});
  tourSchema.index({ slug: 1});
  tourSchema.index({ startLocation: '2dsphere'});


  tourSchema.virtual('durationWeeks').get(function() {
    return this.duration/7;
  })

  // Virtual Populate
  tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
  });
  
  // DOCUMENT MIDDLEWARE: runs before .save() and .create()
  tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true})
    next();
  })
  
  // Embedding the data
  // tourSchema.pre('save', async function(next) {
  //   const guidesPromises = this.guides.map(id => User.findById(id))
  //   this.guides = await Promise.all(guidesPromises);
  //   next();
  // })


  // tourSchema.pre('save', function(next) {
  //   console.log('Will save document...')
  //   next();
  // })

  // tourSchema.post('save', function(doc, next) {
  //   console.log(doc);
  //   next();
  // })
  
  // QUERY MIDDLEWARE
  // Get tour  and get all tours not show secretTour
  tourSchema.pre(/^find/, function(next) {
    // tourSchema.pre('find', function(next) {
    this.find({ secretTour: { $ne: true}});

    this.start = Date.now();
    next();
  });
  tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`)
    // console.log(docs);
    next();
  });

  tourSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'guides',
      select: '-__v -passwordChangedAt'
  });    
    next();
  })

// Aggresgation middleware
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true}}})
//   console.log(this.pipeline());
//   next();
// })


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;