import express from 'express';
import mongoose from 'mongoose';
import exampleForm from '../../assets/neurone-form-example';
import FormAnswer from '../models/form-answer';
import Form from '../models/form'
import neuroneCheckAuth from "../middleware/check-neurone-auth";
import useragent from 'useragent';
import SearchBookmark from '../models/search-bookmark';
import searchSnippet from '../models/search-snippet';
import SynthesisAnswer from '../models/synthesis';


const router = express.Router();

router.get("/test", (req, res) => {

  const browser = useragent.parse(req.headers['user-agent']);
  res.status(200).json({message: "ok", youare: browser.toString()});

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


// search save data

// get all bookmarks that are currently marked as saved by the user
router.get("/search/bookmark/saved/:userId", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.params.userId)) {
    res.status(400).json({"message": "User Id (userId) is not a valid Mongo ID."});
    return;
  }

  try {

    const filter = {
      userId: req.params.userId,
      saved: true
    }

    // get bookmarks marked as saved and keep only website/websiteUrk routes
    const bookmarkDocs = await SearchBookmark.find(filter).select('website websiteUrl');
    console.log("BOOKMARKS:\n", bookmarkDocs);

    if (bookmarkDocs.length === 0) {
      res.status(200).json({message: "No bookmarks found.", data: []});
    }

    res.status(200).json({message: "Bookmarks found", data: bookmarkDocs});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while retrieving bookmarks for the user. See backend console for details."});
  }

});

// get all bookmarks, even marked as unsaved and their logs
router.get("/search/bookmark/all/:userId", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.params.userId)) {
    res.status(400).json({"message": "User Id (userId) is not a valid Mongo ID."});
    return;
  }

  try {

    const filter = {
      userId: req.params.userId,
    }

    const bookmarkDocs = await SearchBookmark.find(filter);
    console.log("BOOKMARKS:\n", bookmarkDocs);

    if (bookmarkDocs.length === 0) {
      res.status(200).json({message: "No bookmarks found.", data: []});
    }

    res.status(200).json({message: "Bookmarks found", data: bookmarkDocs});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while retrieving bookmarks for the user. See backend console for details."});
  }

});

// for new bookmarks, recommended to use if the put methods returns not found
router.post("/search/bookmark", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.body.userId)) {
    res.status(400).json({"message": "User Id (userId) is not a valid Mongo ID."});
    return;
  }

  try {

    const serverDate = Date.now();

    const bookmarkDoc = new SearchBookmark({
      userId: req.body.userId,
      log: [{
        saved: true,
        timestampClient: req.body.date,
        timestampServer: serverDate,
        dateClient: req.body.date,
        dateServer: serverDate,
      }],
      website: req.body.website,
      websiteUrl: req.body.websiteUrl,
      saved: true
    });

    const newBookmarkDoc = await bookmarkDoc.save();
    res.status(201).json({message: "Bookmark created.", data: newBookmarkDoc});

  } catch(err){
    console.error(err);
    res.status(500).json({ message: "Error while looking for document in database. See backend console for details."});
  }

});

// update a bookmark status for an user
router.put("/search/bookmark/:userId/:docId", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.params.userId)) {
    res.status(400).json({"message": "User Id is not a valid Mongo ID."});
    return;
  }

  try {

    const currentServerDate = Date.now();
    const filter = { userId: req.params.userId, website: req.params.docId };
    // update the saved state and add dates to the log
    const update = { 
      saved: req.body.saved,
      $push: { log: {
        saved: req.body.saved,
        timestampClient: req.body.date,
        timestampServer: currentServerDate,
        dateClient: req.body.date,
        dateServer: currentServerDate,
      }},
    }

    const doc = await SearchBookmark.findOneAndUpdate(filter, update, {new: true}); // note: this assumes this doc is unique (it should be with this API)
    console.log ("UPDATED DOC:\n", doc);

    // no docs found
    if (!doc) {
      console.log("Not found doc with this combination:\nuserID:  \t" + req.params.userId + "\ndoc name:\t" + req.body.website);
      res.sendStatus(200).json({message: "Document not found", data: []});
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while looking for document in database. See backend console for details."});
  }

});

// get user data from the search (bookmark and snippets)
router.get("/search/user/:userId", neuroneCheckAuth, async (req, res) => {
  
  try {
    const bookmarks = await SearchBookmark.find({userId: req.params.userId});
    const snippets = await searchSnippet.find({userId: req.params.userId});
    //console.log(bookmarks, snippets);
    if (bookmarks || snippets) {
      res.status(200).json({message: "Success", bookmarks: bookmarks, snippets: snippets});
    } else {
      res.status(200).json({message: "Success, but no bookmarks found for this user"});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error while getting user data"});
  }

});


// get snippets for user
router.get("/search/snippet/:userId", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.body.userId)) {
    res.status(400).json({"message": "User Id (userId) is not a valid Mongo ID."});
    return;
  }

  try {

    // get snippets
    const snippets = await searchSnippet.find({userId: req.params.userId});
    
    console.log("Found " + snippets.length + " snippets for the user " + req.params.userId);

    if (snippets){
      res.status(200).json({message: "Success", snippets: snippets});
    } else {
      res.status(200).json({message: "Success, but no snippets found for this user"});
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while getting search snippets." });
  }

});

// save a search snippet
router.post("/search/snippet", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.body.userId)) {
    res.status(400).json({"message": "User Id (userId) is not a valid Mongo ID."});
    return;
  }

  try {
    const queryOptions: mongoose.QueryOptions = {
      new: true
    }

    const serverDate = Date.now();

    const newSnippetData = new searchSnippet ({
      userId: req.body.userId,
      timestampClient: req.body.date,
      timestampServer: serverDate,
      dateClient: req.body.date,
      dateServer: serverDate,
      snippet: req.body.snippet,
      website: req.body.website,
      websiteUrl: req.body.websiteUrl,
      websiteTitle: req.body.websiteTitle // ESTOY EN ESTO: HACER QUE SE GUARDE ESTO
    });

    // save in database
    const newDocument = await newSnippetData.save(queryOptions);

    res.status(201).json({message: "Saved snippet successfully", document: newDocument});
  } catch(err){
    console.error(err);
    res.status(500).json({ message: "Error while saving snippet." });
  }
});

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
