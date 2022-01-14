import express from 'express';
import { SchemaMember } from 'mongodb';
import { Document, Mongoose, Schema, SchemaType } from 'mongoose';
const useragent = require('useragent');
const LogMouse = require('../models/log-mouse');
const LogKeyboard = require('../models/log-keyboard');
const router = express.Router();

router.post("/logger/", (req, res) => {

  let logData: Document;

  if (req.body.logtype === "mouse") {
    logData = new LogMouse({
      userId: req.body.userId,
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

  }
  else if (req.body.logtype === "keyboard") {
    logData = new LogKeyboard ({
      userId    : req.body.userId,
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
  }
  else {
    res.status(200).json({message: "Unrecognized log type."});
  }

});

module.exports = router;