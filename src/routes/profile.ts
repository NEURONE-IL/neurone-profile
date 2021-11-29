import express from 'express';
import mongoose, { Schema } from 'mongoose';

const router = express.Router();



router.post("/api/kitten", (req, res) => {


    //----------testing mongoose

    const kittySchema = new mongoose.Schema({
        name: String
    });

    // NOTE: methods must be added to the schema before compiling it with mongoose.model()
    kittySchema.methods.speak = function speak() {
        const greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name";
        console.log(greeting);
    };

    const Kitten = mongoose.model('Kitten', kittySchema);

    const silence = new Kitten({ name: 'Silence' });
    console.log("kitty name: " + silence.name); // 'Silence'

    const fluffy = new Kitten({ name: 'fluffy' });

    fluffy.save().then();
    fluffy.speak();

    //----------testing mongoose
});

module.exports = router;
