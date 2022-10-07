import express from 'express';
import exampleForm from '../../assets/neurone-form-example';
import FormAnswer from '../models/form-answer';
import Form from '../models/form'
import neuroneCheckAuth from "../middleware/check-neurone-auth";
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Forms:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: the form ID in the Mongo database
 *          example: 633dfd3a28e1b1eabad40923
 *        formName:
 *          type: string
 *          description: the form's unique name in the Mongo database
 *          example: apiExampleForm
 *        __v:
 *          type: number
 *          description: "Mongoose version key https://mongoosejs.com/docs/guide.html#versionKey"
 *          example: 0
 *        questions:
 *          type: array
 *          description: The array with the questions of the form, each one is a different object.
 *          items:
 *            $ref: '#/components/schemas/FormQuestion'
 * 
 *    FormQuestion:
 *      type: object
 *      properties:
 *        type:
 *          type: string
 *          description: "The type of form of the question. Possible options: input, paragraph, checkbox, radio, dropdown, datepicker, scale, rating"
 *          example: input
 *        title:
 *          type: string
 *          description: The main title/text of the question of the form
 *          example: Please tell us about your experience.
 *        hint:
 *          type: string
 *          description: A helper text for the question
 *          example: It's personal! It could be anything you think.
 *        name:
 *          type: string
 *          description: A name that can be used as an ID to identify the question
 *          example: opinionQues
 *        rows:
 *          type: number
 *          description: FOR PARAGRAPH TYPE ONLY. The ammount of rows the paragraph will show by default, used to change its size
 *          example: 4
 *        stars:
 *          type: number
 *          description: FOR RATING ONLY. The ammount of stars the rating form should show.
 *          example: 5
 *        scaleOptions:
 *          type: object
 *          description: FOR SCALE ONLY. The range and steps that scale form should use.
 *          properties:
 *            minLabel:
 *              type: string
 *              description: The text to be attached next to the lowest number
 *              example: I don't agree
 *            maxLabel:
 *              type: string
 *              description: The text to be attached next to the highest number
 *              example: I agree completely
 *            min:
 *              type: number
 *              description: The lowest number of the scale
 *              example: 0
 *            max:
 *              type: number
 *              description: The highest number of the scale
 *              example: 100
 *            step:
 *              type: number
 *              description: >
 *                The step between each scale option. 
 *                For example: a step of 20, min of 0 and max of 100 should generate buttons to pick 0, 20, 40, 60, 80 and 100
 *              example: 20
 *        validators:
 *          type: object
 *          description: Validators for the current question, the tested ones will be listed.
 *          properties:
 *            required:
 *              type: boolean
 *              description: Whether the question HAS to be answered for the entire form to be valid.
 *              example: true
 *            minLength:
 *              type: number
 *              description: For the text input questions. The minimum ammount of letters for the answer to be valid.
 *              example: 10
 *            maxLength:
 *              type: number
 *              description: For the text input questions. The maximum ammount of letters for the answer to be valid.
 *              example: 100
 */

/**
 * @swagger
 * tags:
 *  name: Forms
 *  description: For managing forms, and user answers to them
 */


/**
 * @swagger
 * /form/{formName}:
 *  get:
 *    summary: Request a form using its unique name
 *    description: Note that an example form will be sent if the requested form is not found to help verify the front-end development
 *    tags: [Forms]
 *    parameters:
 *      - in: path
 *        name: formName
 *        schema:
 *          type: string
 *        required: true
 *        description: The unique form name of the form ('formName' in the database)
 *    responses:
 *      200:
 *        description: Search complete
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message describing the result
 *                  example: Form retrieved.
 *                form:
 *                  type: object
 *                  properties:
 *                    formName:
 *                      $ref: '#/components/schemas/Forms/properties/formName'
 *                    questions:
 *                      $ref: '#/components/schemas/Forms/properties/questions'
 *      500:
 *        description: Error in the server, look at the server console for details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small description of the error, look the server's console for details.
 *                
 */
 router.get("/form/:formName", neuroneCheckAuth, async (req, res) => {

  // search for the form by name, it should be unique in the database
  try {
    const form = await Form.findOne({formName: req.params.formName});

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
    res.status(500).json({message: "Error retrieving document."});
  }

});

// save a form for later use
/**
 * @swagger
 * '/form':
 *  post:
 *    summary: Save a form to the database
 *    description: The object inside
 *    tags: [Forms]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              formName:
 *                type: string
 *                description: a unique name to identify the form
 *              questions:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/FormQuestion'
 *    responses:
 *      200:
 *        description: Uploaded successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Message describing the result
 *                  example: Form saved successfully
 *                result:
 *                  $ref: '#/components/schemas/Forms'
 *      500:
 *        description: Error in the server, look at the server console for details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small description of the error, look the server's console for details.
 */
router.post("/form", neuroneCheckAuth, async (req, res) => {

  const form = new Form ({
    formName: req.body.formName,
    questions: req.body.questions
  });

  try {
    const result = await form.save();
    console.log("FORM SAVED: ", result);
    res.status(201).json({message: "Form saved successfully", result: result});
  } catch(err) {
    console.error(err);
    if (!res.headersSent){
      res.status(500).json({message: "Couldn't save form in database."});
    }
  }

});

/**
 * @swagger
 * /form:
 *  put:
 *    summary: Edit an already uploaded form, or create it if it isn't found
 *    description: Use "formName" to find the form, and use "questions" to send the new questions of the form
 *    tags: [Forms]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              formName:
 *                type: string
 *                description: a unique name to identify the form
 *              questions:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/FormQuestion'
 *    responses:
 *      200:
 *        description: Form updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message with the result description
 *                  example: Form updated successfully
 *      500:
 *        description: Error in the server, look at the server console for details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small description of the error, look the server's console for details.
 *                  example: Couldn't save form in database.
 */
router.put("/form/", neuroneCheckAuth, async (req, res) => {

  try {
    const result = await Form.updateOne({ formName: req.body.formName }, {$set: {questions: req.body.questions}}, {upsert: true})
    console.log("Document updated, result from database: ", result);
    res.status(200).json({ message: "Form updated successfully"});
  } catch(err) {
    console.error(err);
    res.status(500).json({message: "Couldn't save form in database."});
  }

});



/**
 * @swagger
 * /form/{formName}:
 *  delete:
 *    summary: Delete a form, using its formName
 *    description: Use "formName" to find the form
 *    tags: [Forms]
 *    parameters:
 *      - name: formName
 *        in: path
 *        description: The form's unique name in the database
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Operation completed successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message with the result description
 *                  example: Form deleted
 *      500:
 *        description: Error in the server, look at the server console for details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small description of the error, look the server's console for details.
 *                  example: Error while deleting the form.
 */
router.delete("/form/:formName", neuroneCheckAuth, async (req, res) => {

  try {
    const result = await Form.deleteOne({formName: req.params.formName});
    console.log(result);
    if (result.deletedCount > 0){
      res.status(200).json({ message: 'Form deleted.' });
    } else {
      res.status(200).json({ message: 'Could not find form.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error while deleting the form."
    });
  }

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
