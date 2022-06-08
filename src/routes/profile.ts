import express from 'express';
const Profile = require('../models/profile');
const FormAnswer = require('../models/form-answer');
const Form = require('../models/form');
const neuroneCheckAuth = require('../middleware/check-neurone-auth');
const useragent = require('useragent');


const router = express.Router();

const exampleForm = {
  "formName": "questionnaire_example",
  "controls": [
    {
      "title": "Example Title",
      "hint": "Example Hint",
      "name": "inputExample",
      "value": "",
      "type": "input",
      "validators": {
        "required": true,
        "minLength": 10
      }
    },
    {
      "title": "Example Title",
      "hint": "Example Hint",
      "name": "paraExample",
      "value": "",
      "type": "paragraph",
      "validators": {
        "required": false,
        "minLength": 1
      }
    },
    {
      "title": "Example Checkboxes",
      "hint": "Example Hint",
      "name": "checkboxExample",
      "choices": ["Example 1", "Option 2", "Select 3"],
      "type": "checkbox",
      "validators": {
        "required": false
      }
    },
    {
      "title": "Example Title",
      "hint": "Example Hint",
      "name": "radioExample",
      "type": "radio",
      "choices": ["Example 1", "Example 2", "Example 3"],
      "validators": {
        "required": false
      }
    },
    {
      "title": "Pick An option",
      "hint": "Example Hint",
      "name": "dropdownExample",
      "type": "dropdown",
      "choices": ["Example 1", "Example 2", "Example 3"],
      "validators": {
        "required": true
      }
    },
    {
      "title": "Choose a Date",
      "hint": "Could be your birthday!",
      "name": "dateExample",
      "type": "datepicker",
      "choices": ["Example 1", "Example 2", "Example 3"],
      "validators": {
        "required": true
      }
    },
    {
      "title": "Rate this question",
      "hint": "Pick anything!",
      "name": "scaleExample",
      "type": "scale",
      "scaleOptions": {
        "min": 0,
        "max": 100,
        "step": 50,
        "minLabel": "Bad",
        "maxLabel": "Great"
      },
      "validators": {
        "required": true
      }
    },
    {
      "title": "How many stars?",
      "hint": "Pick anything!",
      "name": "ratingExample",
      "type": "rating",
      "stars": 6,
      "validators": {
        "required": true
      }
    }
  ]
}


/*
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
*/

router.get("/test", (req, res) => {

  const browser = useragent.parse(req.headers['user-agent']);
  res.status(200).json({message: "ok", youare: browser.toString()});

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

// for form answers linked to a profile
router.post("/profile/form", neuroneCheckAuth, (req, res) => {

  const currentDate = Date.now();

  const form = new FormAnswer({
    userId: req.body.userId,
    username: req.body.username,
    formId: req.body.formId,
    clientDate: req.body.clientDate,
    serverDate: currentDate,
    questions: req.body.questions
  });
/*
  console.log("---------------SAVING TO DB-----------------------");
  console.log(form);
*/
  form.save().then((result:any) => {
    console.log(result);
    res.status(201).json({message: "Form answer saved successfully", result: result});
  })
  .catch( (err:any) => {
    console.error(err);
    res.status(500).json({error: err})
  });

});

router.get("/form/:name", neuroneCheckAuth, (req, res) => {

  let retrievedForm;
  let finalForm;

  // search for the form by name, it should be unique in the database
  Form.find({formName: req.params.name}).then( (forms: any) => {
    retrievedForm = forms[0]
    console.log({forms});
    console.log("FINAL FORM:");
    console.log(retrievedForm);

    // if retrieval is successful
    if (retrievedForm){

      finalForm = {
        formName: retrievedForm.formName,
        controls: retrievedForm.questions
      }

      res.status(200).json({message: "Form retrieved.", form: finalForm});

    } 
    // if retrieval fails and the example file was requested then it is saved in the database
    else if (!retrievedForm && req.params.name === "questionnaire_example"){

      // create the form to be saved in database
      const form = new Form({
        formName: req.params.name,
        questions: exampleForm.controls
      });

      // save new form and send it to client
      form.save().then((result:any) => {
        console.log(result);
        res.status(200).json({message: "Form retrieved.", form: exampleForm});
      })
      .catch( (error: any) => {
        console.error(error);
        res.status(500).json({error: error})
      });

      
    }
    // if retrieval fails because it isn't in the database
    else {
      res.status(404).json({message: "Form not found."});
    }
  }).catch((error: any) => {
    console.error(error);
    res.status(500).json({message: "Error retrieving document.", error: error});
  })

});

router.post("/form", neuroneCheckAuth, (req, res) => {

  console.log("----------------------FORM PRINT START");
  console.log(req.body.name);
  console.log(req.body.questions);
  console.log("----------------------FORM PRINT END");

  const form = new Form ({
    formName: req.body.formName,
    questions: req.body.questions
  });

  form.save().then((result:any) => {
    console.log(result);
    res.status(201).json({message: "Form saved successfully", result: result});
  })
  .catch( (err:any) => {
    console.error(err);
    if (!res.headersSent){
      res.status(500).json({message: "Couldn't save form in database.", error: err});
    }
  });

});

router.put("/form/:id", neuroneCheckAuth, (req, res) => {

  // update form in database or create it
  Form.updateOne({ formName: req.body.formName }, {$set: {questions: req.body.questions}}, {upsert: true}).then((result: any) => {
    console.log(result);
    res.status(200).json({ message: "Form updated successfully" });
  }).catch((err: any) => {
    console.error(err);
    res.status(500).json({message: "Couldn't save form in database.", error: err});
  })

});

router.delete("/form/:formName", neuroneCheckAuth, (req, res) => {

  Form.deleteOne({formName: req.params.formName}).then( (result: any) => {
    console.log(result);
    if (result.deletedCount > 0){
      res.status(200).json({ message: 'Form deleted.' });
    } else {
      res.status(404).json({ message: 'Could not delete form.' });
    }
  }).catch((error: any) => {
    console.error(error);
    res.status(500).json({
      message: "Deleting the form failed."
    });
  });

});


module.exports = router;
