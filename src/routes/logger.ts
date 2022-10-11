import express from 'express';
import { Document } from 'mongoose';
import LogMouse from '../models/log-mouse';
import LogKeyboard from '../models/log-keyboard';
import LogScroll from '../models/log-scroll';
import LogSearchNav from '../models/log-search-navigation';
import neuroneCheckAuth from "../middleware/check-neurone-auth";
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Logger
 *  description: The log of the user behaviour, like mouse movement, keyboard presses and window scroll 
 */

/**
 * @swagger
 * /logger/mouse:
 *  post:
 *    summary: Log the user's mouse movement
 *    tags: [Logger]
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
 *              userEmail:
 *                type: string
 *                description: The email of the user
 *                example: example@asdf.com
 *              type:
 *                type: string
 *                description: A string describing the type of mouse log, could be a click, a movement, a window enter etc
 *                example: MouseMove
 *              source:
 *                type: string
 *                description: A string showing the source of the log call, it's the front-end's work to use this properly
 *                example: Neurone Mouse Logger
 *              url:
 *                type: string
 *                description: The URL that called the logger
 *                example: http://localhost:4200/
 *              dateClient: 
 *                type: number
 *                description: >
 *                  The date in milliseconds of the client when it called the API. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
 *                example: 1665182096409
 *              x_win:
 *                type: number
 *                description: >
 *                  The coordinate X of the mouse in the viewport. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX
 *                example: 1262
 *              y_win:
 *                type: number
 *                description: >
 *                  The coordinate Y of the mouse in the viewport. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY
 *                example: 334
 *              w_win:
 *                type: number
 *                description: >
 *                  The interior width of the window in pixels. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
 *                example: 1278
 *              h_win:
 *                type: number
 *                description: >
 *                  The interior height of the window in pixels. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight
 *                example: 980
 *              x_doc:
 *                type: number
 *                description: >
 *                  The X (horizontal) coordinate (in pixels) at which the mouse was clicked. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX
 *                example: 1097
 *              Y_doc:
 *                type: number
 *                description: >
 *                  The Y (vertical) coordinate (in pixels) at which the mouse was clicked. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY
 *                example: 428
 *              w_doc:
 *                type: number
 *                description: >
 *                  The width of the elemt that called the mouse event. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollWidth
 *                example: 428
 *              h_doc:
 *                type: number
 *                description: >
 *                  The height of the elemt that called the mouse event. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
 *                example: 2847
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
 *                  example: Logged mouse.
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
 *                  example: Error saving mouse log.
 *              
 */
router.post("/logger/mouse", neuroneCheckAuth, async (req, res) => {

  let logData: Document;

  const currDate = Date.now();

  logData = new LogMouse({
    userId: req.body.userId,
    userEmail: req.body.userEmail,
    type: req.body.type,
    source: req.body.source,
    url   : req.body.url,
    timestampClient: req.body.dateClient,
    timestampServer: currDate,
    dateClient: req.body.dateClient,
    dateServer: currDate,
    x_win : req.body.x_win,
    y_win : req.body.y_win,
    w_win : req.body.w_win,
    h_win : req.body.h_win,
    x_doc : req.body.x_doc,
    y_doc : req.body.y_doc,
    w_doc : req.body.y_doc,
    h_doc : req.body.h_doc
  });

  try{
    await logData.save();
    res.status(201).json({message: "Logged mouse."});
  } catch(err) {
    console.error(err);
    res.status(500).json({message: "Error saving mouse log."});
  };

});


/**
 * @swagger
 * /logger/keyboard:
 *  post:
 *    summary: Log the user's mouse movement
 *    tags: [Logger]
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
 *              userEmail:
 *                type: string
 *                description: The email of the user
 *                example: example@asdf.com
 *              type:
 *                type: string
 *                description: A string describing the type of mouse log, could be a click, a movement, a window enter etc
 *                example: Key Down
 *              source:
 *                type: string
 *                description: A string showing the source of the log call, it's the front-end's work to use this properly
 *                example: Neurone Keyboard Logger
 *              url:
 *                type: string
 *                description: The URL that called the logger
 *                example: http://localhost:4200/
 *              dateClient: 
 *                type: number
 *                description: >
 *                  The date in milliseconds of the client when it called the API. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
 *                example: 1665182096409
 *              target:
 *                type: string
 *                description: The HTML element ID where the input is occurring.
 *                example: mat-input-6
 *              key:
 *                type: string
 *                description: >
 *                  The value of the key pressed by the user. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
 *                example: Alt
 *              code:
 *                type: string
 *                description: >
 *                  A value that isn't altered by keyboard layout or the state of the modifier keys. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
 *                example: AltLeft
 *              keyCode:
 *                type: number
 *                description: >
 *                  Represents a system and implementation dependent numerical code identifying the unmodified value of the pressed key
 *                  (deprecated, ignore if not needed, will be saved as -1). 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
 *                example: 18
 *              which:
 *                type: number
 *                description: >
 *                  Which button was pressed on the keyboard (deprecated, ignore if not needed, will be saved as -1). 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/which
 *                example: 18
 *              charCode:
 *                type: number
 *                description: >
 *                  The Unicode value of a character key (deprecated, ignore if not needed, will be saved as -1). 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode
 *                example: 0
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
 *                  example: Logged keyboard.
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
 *                  example: Error saving keyboard log.
 *              
 */
router.post("/logger/keyboard", neuroneCheckAuth, async(req, res) => {

  let logData: Document;

  const currDate = Date.now();

  logData = new LogKeyboard ({
    userId    : req.body.userId,
    userEmail: req.body.userEmail,
    type      : req.body.type,
    source    : req.body.source,
    url       : req.body.url,
    timestampClient: req.body.dateClient,
    timestampServer: currDate,
    dateClient: req.body.dateClient,
    dateServer: currDate,
    target    : req.body.target,
    key       : req.body.key,
    code      : req.body.code,
    keyCode   : req.body.keyCode ? req.body.keyCode : -1,
    which     : req.body.which ? req.body.which : -1,
    charCode  : req.body.charCode ? req.body.charCode : -1,
  });

  try {
    await logData.save();
    res.status(201).json({message: "Logged keyboard."});
  } catch(err) {
    console.error(err);
    res.status(500).json({message: "Error saving keyboard log."});
  };
});


/**
 * @swagger
 * /logger/scroll:
 *  post:
 *    summary: Log the user's window scroll movement
 *    tags: [Logger]
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
 *              userEmail:
 *                type: string
 *                description: The email of the user
 *                example: example@asdf.com
 *              type:
 *                type: string
 *                description: A string describing the type of scroll log
 *                example: Scroll
 *              source:
 *                type: string
 *                description: A string showing the source of the log call, it's the front-end's work to use this properly
 *                example: Neurone Scroll Logger
 *              url:
 *                type: string
 *                description: The URL that called the logger
 *                example: http://localhost:4200/
 *              dateClient: 
 *                type: number
 *                description: >
 *                  The date in milliseconds of the client when it called the API. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
 *                example: 1665182096409
 *              x_scr:
 *                type: number
 *                description: >
 *                  The number of pixels that the document is currently scrolled horizontally. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX
 *                example: 0
 *              y_scr:
 *                type: number
 *                description: >
 *                  The number of pixels that the document is currently scrolled vertically. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
 *                example: 954
 *              w_win:
 *                type: number
 *                description: >
 *                  The interior width of the window in pixels. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
 *                example: 1278
 *              h_win:
 *                type: number
 *                description: >
 *                  The interior height of the window in pixels. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight
 *                example: 980
 *              w_doc:
 *                type: number
 *                description: >
 *                  The width of the elemt that called the mouse event. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollWidth
 *                example: 428
 *              h_doc:
 *                type: number
 *                description: >
 *                  The height of the elemt that called the mouse event. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
 *                example: 2847
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
 *                  example: Logged Scroll.
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
 *                  example: Error saving scroll log.
 */
router.post("/logger/scroll", neuroneCheckAuth, async (req, res) => {

  let logData: Document;

  const currDate = Date.now();

  logData = new LogScroll({
    userId: req.body.userId,
    userEmail: req.body.userEmail,
    type  : req.body.type,
    source: req.body.source,
    url   : req.body.url,
    timestampClient: req.body.dateClient,
    timestampServer: currDate,
    dateClient: req.body.dateClient,
    dateServer: currDate,
    x_scr : req.body.x_scr,
    y_scr : req.body.y_scr,
    w_win : req.body.w_win,
    h_win : req.body.h_win,
    w_doc : req.body.w_doc,
    h_doc : req.body.h_doc
  });

  try {
    await logData.save()
    res.status(201).json({message: "Logged Scroll."});
  } catch(err) {
    console.error(err);
    res.status(500).json({message: "Error saving scroll log."});
  }

});

// log for the search navigation of the user
/**
 * @swagger
 * /logger/search:
 *  post:
 *    summary: Log the user's search activities in a SERP
 *    description: Some fields in the payload can be empty if they don't fit with the current log
 *    tags: [Logger]
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
 *              userEmail:
 *                type: string
 *                description: The email of the user
 *                example: example@asdf.com
 *              dateClient: 
 *                type: number
 *                description: >
 *                  The date in milliseconds of the client when it called the API. 
 *                  Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
 *                example: 1665182096409
 *              description:
 *                type: string
 *                description: Description of navigation, could be a query, a page enter, a page exit
 *                example: Search Query Made
 *              query:
 *                type: string
 *                description: The current query being made
 *                example: milky
 *              selectedPageName:
 *                type: string
 *                description: Document name of the page in database (docName)
 *                example:   
 *              selectedPageUrl:
 *                type: string
 *                description: Url / Masked Url of the current opened page
 *                example:   
 *              relevant:
 *                type: boolean
 *                description: Whether the current opened page has the relevant bool or not
 *                example: false
 *              currentPageNumber:
 *                type: number
 *                description: Current page number in SERP
 *                example: 0
 *              resultDocumentRank:
 *                type: number
 *                description: Position of webpage/document in the results, could be -1 if there is no page opened
 *                example: -1
 *              retultNumberTotal:
 *                type: number
 *                description: Total number of pages
 *                example: 4
 *              searchResults:
 *                type: array
 *                items:
 *                  type: string
 *                description: Name of all the documents currently visibles in the serp
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
 *                  example: Logged search navigation.
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
 *                  example: Error while saving search navigation log.
 */
router.post("/logger/search/", neuroneCheckAuth,  async (req, res) => {

  const currDate = Date.now();

  const logData: Document = new LogSearchNav({
    userId: req.body.userId,
    userEmail: req.body.userEmail,
    timestampClient: req.body.dateClient,
    timestampServer: currDate,
    dateClient: req.body.dateClient,
    dateServer: currDate,
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

  try {
    await logData.save();
    res.status(201).json({message: "Logged search navigation"});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error while saving search navigation log in database"});
  }
});

module.exports = router;