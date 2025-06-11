const mongoose = require('mongoose')

//loading env variables -- MongoDB connection string
require('dotenv').config();
const dbUrl = process.env.DB_URL

//Connecting to MongoDB
mongoose.connect(dbUrl)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err)); //Log error if the connection fails


module.exports = mongoose;
