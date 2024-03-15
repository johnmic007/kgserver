const express = require('express');
const mongoose = require('mongoose');
const { connectToMongoDB, closeMongoDBConnection } = require('./database/DbConnection');
const cors = require('cors'); 
const mainRouter = require('./routes/index')
const morgan =require('morgan');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))



connectToMongoDB()
  .then(() => {
    console.log('Connected to MongoDB');

    // Start the Express server after connecting to MongoDB
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      
      // Students.insertMany(dummyStudentsData)
      //   .then((result) => {
      //     console.log('Dummy data inserted successfully:', result);
      //   })
      //   .catch((error) => {
      //     console.error('Error inserting dummy data:', error);
      //   });

    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); 
  });


  app.use(mainRouter)