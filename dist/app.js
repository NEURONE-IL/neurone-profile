"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var mongoose_1 = __importDefault(require("mongoose"));
// Connect URL
var url = 'mongodb://127.0.0.1:27017/test';
var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    poolSize: parseInt(process.env.POOL_SIZE),
};
// Connect to MongoDB
mongoose_1.default.connect(url, {}, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("MongoDB Connected: ".concat(url));
    }
});
mongoose_1.default.connection.on('error', function (err) {
    console.error(err);
});
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded bodies
var port = 3002;
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
app.get('/', function (req, res) {
    res.send("This is the neurone-profile backend on port ".concat(port, "!"));
});
app.listen(port, function () {
    return console.log("server is listening on ".concat(port));
});
app.use(require('./routes/profile'));
