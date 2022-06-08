import express from 'express';
import { SchemaMember } from 'mongodb';
import { Document, Mongoose, Schema, SchemaType } from 'mongoose';
const useragent = require('useragent');
const LogMouse = require('../models/log-mouse');
const LogKeyboard = require('../models/log-keyboard');
const LogScroll = require('../models/log-scroll');
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

module.exports = router;