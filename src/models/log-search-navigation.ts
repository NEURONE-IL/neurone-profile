import mongoose from 'mongoose';

const logSearchNavigationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  userEmail: { type: String },
  timestampClient: { type: Number },
  timestampServer: { type: Number },
  dateClient: { type: Date },
  dateServer: { type: Date },
  description: { type: String }, // description of navigation, could be a query, a page enter, a page exit
  query: { type: String }, // the current query being made
  selectedPageName: { type: String }, // document name of the page in database
  selectedPageUrl: { type: String }, // url/masked url of the page
  relevant: { type: Boolean },
  currentPageNumber: { type: Number }, // current page number in SERP
  resultDocumentRank: { type: Number }, // position of webpage/document in the results
  retultNumberTotal: { type: Number }, // total # of pages
  searchResults: [{ type: String }] // name of all the documents currently visibles in the serp
});

module.exports = mongoose.model('log-search-navigation', logSearchNavigationSchema);