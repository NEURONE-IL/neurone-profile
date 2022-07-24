import mongoose from 'mongoose';

// log for the saved user bookmarks and snippets (save and remove)
const logUserDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  description: { type: String }, // description (add or remove data)
  data: { type: String }, // text / webpage saved
  timestampClient: { type: Number },
  timestampServer: { type: Number },
  dateClient: { type: Date },
  dateServer: { type: Date },
});

export default mongoose.model('log-user-data', logUserDataSchema);