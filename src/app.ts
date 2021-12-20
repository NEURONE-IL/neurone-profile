import express from 'express';
import { MongoClientOptions } from 'mongodb';
import mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
import mongoose from 'mongoose';

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
    } else {
        console.log(`MongoDB Connected: ${url}`);
    }
    
});

mongoose.connection.on('error', err => {
    console.error(err);
});






const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies
const port = 3002;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS" )
    next();
});

app.get('/', (req, res) => {
    res.send(`This is the neurone-profile backend on port ${port}!`);
});
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});


app.use(require('./routes/profile') );