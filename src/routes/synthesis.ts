import express from 'express';
import mongoose from 'mongoose';
import neuroneCheckAuth from "../middleware/check-neurone-auth";
import SynthesisAnswer from '../models/synthesis';

const router = express.Router();


// synthesis text save
router.post("/synthesis", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.body.userId)) {
    res.status(400).json({"message": "User Id (userId) is not a valid Mongo ID."});
    return;
  }

  try {

    const serverDate = Date.now();

    const newSynthAnswer = new SynthesisAnswer({
      userId: req.body.userId,
      username: req.body.username,
      startTime: req.body.startTime,
      startTimeDate: req.body.startTime,
      question: req.body.question,
      answer: req.body.answer,
      answerHTML: req.body.answerHTML,
      completeAnswer: req.body.completeAnswer,
      clientDate: req.body.clientDate,
      serverDate: serverDate,
      clientTimestamp: req.body.clientDate,
      serverTimestamp: serverDate
    });

    const newDocument = await newSynthAnswer.save();

    res.status(201).json({message: "Synthesis answer saved.", document: newDocument});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error while saving answer"});
  }

});

module.exports = router;
