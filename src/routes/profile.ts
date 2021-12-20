import express from 'express';
import mongoose, { Schema } from 'mongoose';
const Profile = require('../models/profile');
const FormQuestion = require('../models/formQuestion');
const neuroneCheckAuth = require('../middleware/check-neurone-auth');


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


  res.status(201).json({message: "created"});
});

router.post("/profile/number", neuroneCheckAuth, (req, res) => {

  try{

    console.log("let's see...\n" + req.body.email + "\n" + req.body.number)

      const User = new Profile({
        email: req.body.email,
            number: req.body.number
      });

      User.save().then( (result: any) => {
        console.log(result);
        res.status(201).json({message: "created", object: result})
      })
      .catch((err: any) => {
        console.error(err)
      });
        
  } catch(err) {
    console.error(err);
    res.status(500).json({err: err});
  }
});

router.post("/profile/form", neuroneCheckAuth, (req, res) => {

  //const currentDate = Date.now();

  const formQ = new FormQuestion({
    question: req.body.question,
    formType: req.body.formType,
    date: Date.now(),
    userId: req.body.userId,
    answerNum: req.body.answerNum,
    answerString: req.body.answerString
  });
  console.log("PRINT DE MODELO DE PREGUNTA: \n" + formQ);

  formQ.save().then((result:any) => {
    console.log(result);
    res.status(201).json({message: "Form answer saved successfully", result: result});
  })
  .catch( (err:any) => {
    console.error(err);
    res.status(500).json({error: err})
  })

  

});


module.exports = router;
