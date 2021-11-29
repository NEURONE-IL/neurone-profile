import express from 'express';
import { MongoClientOptions } from 'mongodb';
import mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
import mongoose, { Schema } from 'mongoose';

// Connect URL
const url = 'mongodb://127.0.0.1:27017/test';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    poolSize: parseInt(process.env.POOL_SIZE!),
};

// Connect to MongoDB
mongoose.connect(url, {}, (err) => {
    
    if (err) {
        console.log(err);
    }

    // Specify database you want to access
    //const db = client.db('neurone');

    console.log(`MongoDB Connected: ${url}`);
});

mongoose.connection.on('error', err => {
    console.error(err);
});






const app = express();
const port = 3002;
app.get('/', (req, res) => {
    res.send(`This is the neurone-profile backend on port ${port}!`);
});
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});


app.use(require('./routes/profile') );