import express from 'express';
import mongoose from 'mongoose';
import neuroneCheckAuth from "../middleware/check-neurone-auth";
import SynthesisAnswer from '../models/synthesis';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Synthesis
 *  description: Routes for the Neurone-Synthesis component
 */

/**
 * @swagger
 * /synthesis:
 *  post:
 *    summary: Save text for the Neurone-Synthesis component
 *    tags: [Synthesis]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *                description: The Mongo ID of the user
 *                example: 633329cce9d7d30ef7fe68b2
 *              username:
 *                type: string
 *                description: The username of the account posting the text
 *                example: Neurone Admin
 *              dateClient: 
 *                type: number
 *                description: >
 *                  The date in milliseconds of the client when it called the API. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
 *                example: 1665182096409
 *              startTime:
 *                type: number
 *                description: The date in milliseconds when the user was shown the question for of the synthesis component
 *                example: 1664492903961
 *              question:
 *                type: string
 *                description: The question/activity text
 *                example: This is the Synthesis component! Please enter text here.
 *              answer:
 *                type: string
 *                description: The answer the user gave
 *                example: This is my  answer 
 *              answerHTML:
 *                type: string
 *                description: The answer the user gave with its html format flavor
 *                example: his is my <b>answer</b>
 *              completeAnswer:
 *                type: boolean
 *                description: True if the user input the answer manually, false if it was saved automatically.
 *                example: true
 *    responses:
 *      201:
 *        description: Saved the log successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message describing the result
 *                  example: Synthesis answer saved.
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
 *                  example: Error while saving answer.
 *              
 */
router.post("/synthesis", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.body.userId)) {
    res.status(400).json({"message": "User Id (userId) is not a valid Mongo ID."});
    return;
  }

  try {

    const dateServer = Date.now();

    const newSynthAnswer = new SynthesisAnswer({
      userId: req.body.userId,
      username: req.body.username,
      timestampClient: req.body.dateClient,
      timestampServer: dateServer,
      dateClient: req.body.dateClient,
      dateServer: dateServer,
      startTime: req.body.startTime,
      startTimeDate: req.body.startTime,
      question: req.body.question,
      answer: req.body.answer,
      answerHTML: req.body.answerHTML,
      completeAnswer: req.body.completeAnswer,
    });

    const newDocument = await newSynthAnswer.save();

    res.status(201).json({message: "Synthesis answer saved.", document: newDocument});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error while saving answer."});
  }

});

module.exports = router;
