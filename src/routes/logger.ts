import express from 'express';
import { SchemaMember } from 'mongodb';
import { Document, Mongoose, Schema, SchemaType } from 'mongoose';
const useragent = require('useragent');
const LogMouse = require('../models/log-mouse');
const LogKeyboard = require('../models/log-keyboard');
const LogScroll = require('../models/log-scroll');
const LogSearchNav = require('../models/log-search-navigation');
const router = express.Router();

router.post("/logger/mouse", (req, res) => {

  let logData: Document;

  logData = new LogMouse({
    userId: req.body.userId,
    userEmail: req.body.userEmail,
    type: req.body.type,
    source: req.body.source,
    url   : req.body.url,
    dateClient: req.body.clientDate,
    dateServer: Date.now(),
    x_win : req.body.x_win,
    y_win : req.body.y_win,
    w_win : req.body.w_win,
    h_win : req.body.h_win,
    x_doc : req.body.x_doc,
    y_doc : req.body.y_doc,
    w_doc : req.body.y_doc,
    h_doc : req.body.h_doc
  });

  logData.save().then((result) => {
    res.status(201).json({message: "Logged mouse."});
  }).catch((error) => {
    console.error(error);
    res.status(500).json({message: "Error saving mouse log."});
  });

});

router.post("/logger/keyboard", (req, res) => {

  let logData: Document;

  logData = new LogKeyboard ({
    userId    : req.body.userId,
    userEmail: req.body.userEmail,
    type      : req.body.type,
    source    : req.body.source,
    target    : req.body.target,
    url       : req.body.url,
    dateClient: req.body.dateClient,
    dateServer: Date.now(),
    which     : req.body.which,
    keyCode   : req.body.keyCode,
    charCode  : req.body.charCode,
    key       : req.body.key
  });

  logData.save().then(() => {
    res.status(201).json({message: "Logged keyboard."});
  }).catch((error) => {
    console.error(error);
    res.status(500).json({message: "Error saving keyboard log."});
  });
});

router.post("/logger/scroll", (req, res) => {

  let logData: Document;

  logData = new LogScroll({
    userId: req.body.userId,
    userEmail: req.body.userEmail,
    type  : req.body.type,
    source: req.body.source,
    url   : req.body.url,
    dateClient: req.body.dateClient,
    dateServer: Date.now(),
    x_scr : req.body.x_scr,
    y_scr : req.body.y_scr,
    w_win : req.body.w_win,
    h_win : req.body.h_win,
    w_doc : req.body.w_doc,
    h_doc : req.body.h_doc
  });

  logData.save().then(() => {
    res.status(201).json({message: "Logged Scroll."});
  }).catch((error) => {
    console.error(error);
    res.status(500).json({message: "Error saving Scroll log."});
  });

});

// log for the search navigation of the user
router.post("/logger/search/", async (req, res) => {
  console.log("data:");
  console.log(req.body);

  const currDate = Date.now();

  const logData: Document = new LogSearchNav({
    userId: req.body.userId,
    userEmail: req.body.userEmail,
    dateClient: req.body.date || req.body.dateClient,
    dateServer: currDate,
    timestampClient: req.body.date || req.body.timestampClient,
    timestampServer: currDate,
    description: req.body.description,
    query: req.body.query,
    selectedPageName: req.body.selectedPageName,
    selectedPageUrl: req.body.selectedPageUrl,
    relevant: req.body.relevant,
    currentPageNumber: req.body.currentPageNumber,
    resultDocumentRank: req.body.resultDocumentRank,
    retultNumberTotal: req.body.resultNumberTotal,
    searchResults: req.body.searchResults
  });

  console.log("document to save in db:\n", logData);

  try{
    await logData.save();
    res.status(201).json({message: "Logged search"});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error while saving search navigation log in database"});
  }
})

module.exports = router;