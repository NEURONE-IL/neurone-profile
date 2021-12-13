"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var router = express_1.default.Router();
router.post("profile/number", function (req, res) {
    try {
        console.log("let's see...\n" + req.body.email + "\n" + req.body.number);
        var profileSchema = new mongoose_1.default.Schema({
            email: String,
            number: Number
        });
        var Profile = mongoose_1.default.model('Profile', profileSchema);
        var User = new Profile({
            email: req.body.email,
            number: req.body.number
        });
        User.save().then();
        res.status(201).json({ message: "created" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ err: err });
    }
});
router.post("/api/kitten", function (req, res) {
    //----------testing mongoose
    var kittySchema = new mongoose_1.default.Schema({
        name: String
    });
    // NOTE: methods must be added to the schema before compiling it with mongoose.model()
    kittySchema.methods.speak = function speak() {
        var greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name";
        console.log(greeting);
    };
    var Kitten = mongoose_1.default.model('Kitten', kittySchema);
    var silence = new Kitten({ name: 'Silence' });
    console.log("kitty name: " + silence.name); // 'Silence'
    var fluffy = new Kitten({ name: 'fluffy' });
    fluffy.save().then();
    fluffy.speak();
    //----------testing mongoose
    res.status(201).json({ message: "created" });
});
module.exports = router;