
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI?.replace(
      "<db_password>",
      process.env.MONGODB_PASSWORD || "1qaz2WSX3edc"
    );
    
    console.log('Attempting to connect to MongoDB with URI:', uri);
    
    // Set strictQuery to false to suppress deprecation warning
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test the connection by checking database name
    console.log(`Connected to database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Full error stack:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
