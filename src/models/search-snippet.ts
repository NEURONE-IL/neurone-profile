import mongoose from 'mongoose';

const SearchSnippet = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  timestampClient: { type: Number },
  timestampServer: { type: Number },
  dateClient: { type: Date },
  dateServer: { type: Date },
  snippet: { type: String },
  website: { type: String }, // saved snippet's webpage name
  websiteUrl: { type: String }, 
})

export default mongoose.model('search-snippet', SearchSnippet);