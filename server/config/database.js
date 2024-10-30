const mongoose = require('mongoose');
require('dotenv').config();

const { MONGODB_URL } = process.env;

const connectDB = async () => {
  try {
    await mongoose
        .connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    });
    console.log('Database connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
