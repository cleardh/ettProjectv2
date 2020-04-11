const mongoose = require('mongoose');
const db = require('./keys').mongodb.dbURI;

const connectDB = () => {
  try {
    mongoose.set('useCreateIndex', true);
    mongoose
      .connect(db, {
        useFindAndModify: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log('MongoDB connected...'));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
