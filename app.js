const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1 - Global Middlewares

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// app.use(helmet())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
 
      baseUri: ["'self'"],
 
      fontSrc: ["'self'", 'https:', 'data:'],
 
      scriptSrc: ["'self'", 'https://*.cloudflare.com'],
 
      scriptSrc: ["'self'", 'https://*.stripe.com'],
 
      scriptSrc: ["'self'", 'http:', 'https://*.mapbox.com', 'data:'],
 
      frameSrc: ["'self'", 'https://*.stripe.com'],
 
      objectSrc: ["'none'"],
 
      styleSrc: ["'self'", 'https:', 'unsafe-inline'],
 
      workerSrc: ["'self'", 'data:', 'blob:'],
 
      childSrc: ["'self'", 'blob:'],
 
      imgSrc: ["'self'", 'data:', 'blob:'],
 
      connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],
 
      upgradeInsecureRequests: [],
    },
  })
);

// console.log(process.env.NODE_ENV);

// Development Looging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests from this IP, please try again after some time',
});
app.use('/api', limiter);


// Body parser, reading data from body into req.body
// app.use(express)

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
// Data sanitization against Nosql query Injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent paramerter pollution
app.use(hpp({
  whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
}));


// app.use((req, res, next) => {
  //   console.log('\nHello from the middleware ✋');
  //   next();
  // });
  
  // Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});


// Routes Mounting

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);


app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.url} on this server!`
  // });
  // const err = new Error(`Can't find ${req.url} on this server!`);
  // err.status  = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.url} on this server!`));
});

app.use(globalErrorHandler);

// 4 -  Start Sever
module.exports = app;
