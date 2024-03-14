const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017/mydb';


const connectToMongoDB = async () => {
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log('Connected to MongoDB');
      return mongoose.connection;
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw err;
    }
  };


  const closeMongoDBConnection = async () => {
    try {
      await mongoose.connection.close();
      console.log('Closed MongoDB connection');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
  };

  module.exports = { connectToMongoDB, closeMongoDBConnection };
