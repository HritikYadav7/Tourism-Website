const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
// console.log(app.get('env'));
// console.log(process.env);

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


// .connect(DB, {
  

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connection);
    console.log('DB connection successful ...');
  });
  // .catch((err) => {
  //   console.log('Not Connected to Database ERROR! ', err);
  // });

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 497
// });
// testTour.save().then(doc => {
//   console.log(doc)
// }).catch(err => {
//   console.log('ERROR 🔥: ', err)
// })

// console.log(process.env);
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
