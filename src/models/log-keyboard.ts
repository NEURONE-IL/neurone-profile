import mongoose from 'mongoose';

const logKeyboardSchema = new mongoose.Schema({
  userId    : { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  userEmail : { type: String }, 
  type      : { type: String },
  source    : { type: String },
  url       : { type: String },
  timestampClient: { type: Number },
  timestampServer: { type: Number },
  dateClient: { type: Date },
  dateServer: { type: Date },
  target    : { type: String },
  key       : { type: String },
  code      : { type: String },
  keyCode   : { type: Number },
  which     : { type: Number },
  charCode  : { type: Number },
});

export default mongoose.model('log-keyboard', logKeyboardSchema);