import express from 'express';
import mongoose from 'mongoose';
import neuroneCheckAuth from "../middleware/check-neurone-auth";
import useragent from 'useragent';
import SearchBookmark from '../models/search-bookmark';
import searchSnippet from '../models/search-snippet';


const router = express.Router();


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

module.exports = router;
