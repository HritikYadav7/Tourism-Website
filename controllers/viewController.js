const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getOverview = catchAsync( async (req, res, next) => {
    // 1) Get tour data
    const tours = await Tour.find();

    // 2) Build Template
    // 3) Render that template using tour data from 1)
    // console.log(tours);
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
});

// exports.getTour = catchAsync( async(req, res, next) => {
//     // 1) Get tour data of reqested tour
//     const tour = await Tour.findOne({slug: req.params.slug}).populate({
//         path: 'reviews',
//         fields: 'review rating user'
//     });

//     // 2) Build Template
//     // 3) Render that template using tour data from 1)
//     res.status(200).render('tour', {
//         title: `${tour.name} Tour`,
//         tour
//     })
// })

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'reviews rating user'
  });
  if(!tour) {
    return next(new AppError('There is no tour with that name.',404))
  }
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: `${tour.name}`,
      tour
    });
});

exports.getLogin = catchAsync(async (req, res, next) => {
    res.status(200).render('login', {
        title: `Log into your account`,
    })
})


// exports.getLoginForm = (req, res) => {
//     res.status(200)
//         .set(
//             'Content-Security-Policy',
//             "connect-src 'self' http://127.0.0.1:3000/"
//         )
//         .render('login', {
//             title: 'Log into your account',
//         });
// };

exports.getSignUp = catchAsync(async (req, res, next) => {
    res.status(200).render('signup', {
        title: `Sign Up`,
    })
})

exports.getAccount = catchAsync(async(req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  })
})

exports.updateUserData = catchAsync(async(req, res) => {
  console.log('Updataing user', res.body);
  // res.status(200).render('account', {
  //   title: 'Your account'
  // })
})