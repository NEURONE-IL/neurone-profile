import express from 'express';
import mongoose from 'mongoose';
import neuroneCheckAuth from "../middleware/check-neurone-auth";
import SearchBookmark from '../models/search-bookmark';
import searchSnippet from '../models/search-snippet';


const router = express.Router();


/**
 * @swagger
 * components:
 *  schemas:
 *    Bookmark:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: The Mongo ID of the bookmark
 *          example: 634578cf77065a1e177f2b86
 *        userId:
 *          type: string
 *          description: The Mongo ID of the user associated with the bookmark
 *          example: 633329cce9d7d30ef7fe68b1
 *        log:
 *          description: An array with all the user changes to the bookmark, their state and their date
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              saved:
 *                type: boolean
 *                description: True if the user marked the bookmark as saved
 *                example: true
 *              timestampClient: 
 *                type: number
 *                description: The date in milliseconds (epoch) when the event happened in the client
 *                example: 1665497295570
 *              timestampServer:
 *                type: number
 *                description: The date in milliseconds (epoch) when the server received the request
 *                example: 1665497295570
 *              dateClient: 
 *                type: string
 *                description: The date in text when the event happened in the client
 *                example: 2022-10-11T14:08:15.570Z
 *              dateServer:
 *                type: string
 *                description: The date in text when the server received the request
 *                example: 2022-10-11T14:08:15.630Z
 *              _id:
 *                type: string
 *                description: The Mongo ID of the bookmark
 *                example: 634578cf77065a1e177f2b87
 *        website:
 *          type: string
 *          description: The docName field of the saved website on the database
 *          example: milky-way
 *        websiteTitle:
 *          type: string
 *          description: The title saved for the website
 *          example: The Milky Way
 *        websiteUrl:
 *          type: string
 *          description: The original URL of the website
 *          example: 'https://imagine.gsfc.nasa.gov/milky-way'
 *        saved:
 *          type: boolean
 *          description: The current save status of the bookmark
 *          example: true
 *        __v:
 *          type: number
 *          description: "Mongoose version key https://mongoosejs.com/docs/guide.html#versionKey"
 *          example: 0
 *    Snippet:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: The Mongo ID of the bookmark
 *          example: 634578cf77065a1e177f2b86
 *        userId:
 *          type: string
 *          description: The Mongo ID of the user associated with the bookmark
 *          example: 633329cce9d7d30ef7fe68b1
 *        timestampClient: 
 *          type: number
 *          description: The date in milliseconds (epoch) when the event happened in the client
 *          example: 1665497295570
 *        timestampServer:
 *          type: number
 *          description: The date in milliseconds (epoch) when the server received the request
 *          example: 1665497295570
 *        dateClient: 
 *          type: string
 *          description: The date in text when the event happened in the client
 *          example: 2022-10-11T14:08:15.570Z
 *        dateServer:
 *          type: string
 *          description: The date in text when the server received the request
 *          example: 2022-10-11T14:08:15.630Z
 *        snippet:
 *          type: string
 *          description: The text to be saved from the search snippet
 *          example: Our Sun (a star) and all the planets around it are part of a galaxy known as the Milky Way Galaxy.
 *        website:
 *          type: string
 *          description: The docName field of the saved website on the database
 *          example: milky-way
 *        websiteUrl:
 *          type: string
 *          description: The original URL of the website
 *          example: 'https://imagine.gsfc.nasa.gov/milky-way'
 *        __v:
 *          type: number
 *          description: "Mongoose version key https://mongoosejs.com/docs/guide.html#versionKey"
 *          example: 0
 */

/**
 * @swagger
 * tags:
 *  name: Search
 *  description: The search save data management
 */

/**
 * @swagger
 * /search/bookmark/saved/{userId}:
 *  get:
 *    summary: Get all website bookmarks that are currently marked as saved by the user
 *    tags: [Search]
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: The Mongo ID of the user
 *    responses:
 *      200:
 *        description: Bookmark search complete, returned found bookmarks
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A description of the result
 *                  example: Bookmarks found
 *                data:
 *                  description: The data of the bookmarks in an array
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: The Mongo ID of the bookmark
 *                        example: 634578cf77065a1e177f2b86
 *                      website:
 *                        type: string
 *                        description: The docName field of the website
 *                        example: milky-way
 *                      websiteUrl:
 *                        type: string
 *                        description: The URL of the website
 *                        example: 'https://imagine.gsfc.nasa.gov/milky-way'
 *      400:
 *        description: The Mongo ID parameter is not valid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: User Id in parameter is not a valid Mongo ID.
 *      500:
 *        description: Server error while searching the bookmarks, look at the server's console for details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: Error while retrieving bookmarks for the user. See backend console for details.
 *    
 */
router.get("/search/bookmark/saved/:userId", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.params.userId)) {
    res.status(400).json({"message": "User Id in parameter is not a valid Mongo ID."});
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
      return;
    }

    if(!res.headersSent){
      res.status(200).json({message: "Bookmarks found", data: bookmarkDocs});
      return;
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while retrieving bookmarks for the user. See backend console for details."});
  }

});



/**
 * @swagger
 * /search/bookmark/all/{userId}:
 *  get:
 *    summary: Get all website bookmarks, even marked as unsaved, and their logs
 *    tags: [Search]
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: The Mongo ID of the user
 *    responses:
 *      200:
 *        description: Bookmark search complete, returned found bookmarks
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A description of the result
 *                  example: Bookmarks found
 *                data:
 *                  $ref: '#/components/schemas/Bookmark'
 *      400:
 *        description: The Mongo ID parameter is not valid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: User Id in parameter is not a valid Mongo ID.
 *      500:
 *        description: Server error while searching the bookmarks, look at the server's console for details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: Error while retrieving bookmarks for the user. See backend console for details.
 */
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
      return;
    }

    res.status(200).json({message: "Bookmarks found", data: bookmarkDocs});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while retrieving bookmarks for the user. See backend console for details."});
  }

});


/**
 * @swagger
 * /search/bookmark:
 *  post:
 *    summary: Save a NEW bookmark for a user
 *    tags: [Search]
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
 *                example: 633329cce9d7d30ef7fe68b1
 *              date:
 *                type: number
 *                description: The date in milliseconds (epoch) when the event happened in the client
 *                example: 1665497295630
 *              website:
 *                type: string
 *                description: The docName field of the website in the database
 *                example: milky-way
 *              websiteTitle:
 *                type: string
 *                description: The website title from the database
 *                example: The Milky Way
 *              websiteUrl: 
 *                type: string
 *                description: The original website URL  
 *                example: 'https://imagine.gsfc.nasa.gov/milky-way'
 *            
 *            
 *    responses:
 *      201:
 *        description: Upload complete
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message describing the result
 *                  example: Bookmark created.
 *                data:
 *                  $ref: '#/components/schemas/Bookmark'
 *      400:
 *        description: The Mongo ID parameter is not valid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: User Id in parameter is not a valid Mongo ID.
 *      500:
 *        description: Server error while posting the bookmarks, look at the server's console for details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: Error while saving bookmarks for the user. See backend console for details.
 */
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
      websiteTitle: req.body.websiteTitle,
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

/**
 * @swagger
 * /search/bookmark/{userId}/{docId}:
 *  put:
 *    summary: Change the status of a bookmark, and return all the SAVED documents once it's done
 *    tags: [Search]
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: The Mongo ID of the user
 *        example: 633329cce9d7d30ef7fe68b1
 *      - in: path
 *        name: docId
 *        schema:
 *          type: string
 *        required: true
 *        description: The webpage's docName field in the database to identify it
 *        example: milky-way
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              saved:
 *                type: boolean
 *                description: The new save status
 *                example: true
 *              date:
 *                type: number
 *                description: The date in milliseconds (epoch) when the event happened in the client
 *                example: 1665497295630
 *    responses:
 *      200:
 *        description: Upload complete
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message describing the result
 *                  example: Bookmark edited successfully
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Bookmark'
 *      400:
 *        description: The Mongo ID parameter is not valid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: User Id in parameter is not a valid Mongo ID.
 *      500:
 *        description: Server error while editing the bookmark, look at the server's console for details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: Error while saving bookmarks for the user. See backend console for details.
 */
router.put("/search/bookmark/:userId/:docId", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.params.userId)) {
    res.status(400).json({message: "User Id is not a valid Mongo ID."});
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
    //console.log ("UPDATED DOC:\n", doc);

    // no docs found
    if (!doc) {
      console.log("</search/bookmark/:userId/:docId>: Did not find doc with this combination:\nuserID:  \t" + req.params.userId + "\ndoc name:\t" + req.body.website);
      res.status(200).json({message: "Document not found", data: []});
      return;
    }

    const allDocs = await SearchBookmark.find({ userId: req.params.userId, saved: true });

    res.status(200).json({message: "Bookmark edited successfully", data: allDocs});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while looking for document in database. See backend console for details."});
  }

});


/**
 * @swagger
 * /search/user/{userId}:
 *  get:
 *    summary: Get user data for the search activities (bookmark and snippets)
 *    tags: [Search]
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: The Mongo ID of the user
 *        example: 633329cce9d7d30ef7fe68b1
 *    responses:
 *      200:
 *        description: Complete
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message describing the result
 *                  example: Success
 *                bookmarks:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Bookmark'
 *                  description: An array with all the bookmarks of the user, note that both saved and unsaved bookmarks are sent.
 *                snippets:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Snippet'
 *                  description: All the snippets saved by the user
 *      400:
 *        description: The Mongo ID parameter is not valid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: User Id in parameter is not a valid Mongo ID.
 *      500:
 *        description: Server error while getting the data, look at the server's console for details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: Error while getting user data
 *    
 */
router.get("/search/user/:userId", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.params.userId)) {
    res.status(400).json({message: "User Id is not a valid Mongo ID."});
    return;
  }
  
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


/**
 * @swagger
 * /search/snippet/{userId}:
 *  get:
 *    summary: Get all the snippets saved by the user
 *    tags: [Search]
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: The Mongo ID of the user
 *        example: 633329cce9d7d30ef7fe68b1
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
 *                  example: Success
 *                snippets:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Snippet'
 *                  description: Array with the snippets
 *      400:
 *        description: The Mongo ID parameter is not valid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: User Id in parameter is not a valid Mongo ID.
 *      500:
 *        description: Server error while getting the snippets, look at the server's console for details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: Error while getting search snippets.
 */
router.get("/search/snippet/:userId", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.params.userId)) {
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


/**
 * @swagger
 * /search/snippet:
 *  post:
 *    summary: Save a search snippet
 *    tags: [Search]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *                description: The Mongo ID of the user associated with the bookmark
 *                example: 633329cce9d7d30ef7fe68b1
 *              date: 
 *                type: number
 *                description: The date in milliseconds (epoch) when the event happened in the client
 *                example: 1665497295570
 *              snippet:
 *                type: string
 *                description: The snippet text to save
 *                example: Our Sun (a star) and all the planets around it are part of a galaxy
 *              website:
 *                type: string
 *                description: The docName field of the webpage saved in the database
 *                example: milky-way
 *              websiteUrl:
 *                type: string
 *                description: The original URL of the website
 *                example: 'https://imagine.gsfc.nasa.gov/milky-way'
 *              websiteTitle:
 *                type: string
 *                description: The title saved for the website
 *                example: The Milky Way
 *    responses:
 *      201:
 *        description: Save complete
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Small message describing the result
 *                  example: Saved snippet successfully
 *                document:
 *                  description: The saved snippet in the database
 *                  $ref: '#/components/schemas/Snippet'
 * 
 *      400:
 *        description: The Mongo ID parameter is not valid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: User Id in parameter is not a valid Mongo ID.
 *      500:
 *        description: Server error while saving the snippet, look at the server's console for details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A small message describing the error
 *                  example: Error while saving snippet
 *                
 */
router.post("/search/snippet", neuroneCheckAuth, async (req, res) => {

  if (!mongoose.isValidObjectId(req.body.userId)) {
    res.status(400).json({"message": "User Id (userId) is not a valid Mongo ID."});
    return;
  }

  try {

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
      websiteTitle: req.body.websiteTitle
    });

    // save in database
    const newDocument = await newSnippetData.save();

    res.status(201).json({message: "Saved snippet successfully", document: newDocument});
  } catch(err){
    console.error(err);
    res.status(500).json({ message: "Error while saving snippet." });
  }
});

module.exports = router;
