import mongoose from 'mongoose';

const searchSavedData = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  bookmarks: [{ type: String }], // saved webpages
  snippets: [{
    text: { type: String },
    website: { type: String }
  }] // saved text from webpages
})

export default mongoose.model('search-saved-data', searchSavedData);