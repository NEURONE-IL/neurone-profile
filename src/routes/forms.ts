import express from 'express';
import exampleForm from '../../assets/neurone-form-example';
import FormAnswer from '../models/form-answer';
import Form from '../models/form'
import neuroneCheckAuth from "../middleware/check-neurone-auth";
const router = express.Router();

/**
 * request a form using its name (unique)
 */
 router.get("/form/:name", neuroneCheckAuth, async (req, res) => {



  // search for the form by name, it should be unique in the database
  try {
    const form = await Form.findOne({formName: req.params.name});

    // if retrieval is successful
    if (form){
      res.status(200).json({message: "Form retrieved.", form: form});
    } 
    // if form is not found send an example form
    else if (!form){
      res.status(200).json({ message: "Form not found, sending example form instead." , form: exampleForm});
    }
  } catch(err) {
    console.error(err);
    res.status(500).json({message: "Error retrieving document.", error: err});
  }

});

// save a form for later use
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

// 
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
      res.status(200).json({ message: 'Could not delete form.' });
    }
  }).catch((error: any) => {
    console.error(error);
    res.status(500).json({
      message: "Deleting the form failed."
    });
  });

});

// for form answers linked to a profile
router.post("/profile/form", neuroneCheckAuth, async (req, res) => {

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
  try {
    const result = await form.save();
    console.log(result);
    res.status(201).json({message: "Form answer saved successfully", result: result});
  } catch(err) {
    console.error(err);
    res.status(500).json({message: "Error while saving form.", error: err})
  };

});

module.exports = router;
