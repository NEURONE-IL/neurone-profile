import mongoose from 'mongoose';

const logKeyboardSchema = new mongoose.Schema({
  userId    : { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  userEmail : { type: String }, 
  type      : { type: String },
  source    : { type: String },
  target    : { type: String },
  url       : { type: String },
  dateClient: { type: Date },
  dateServer: { type: Date },
  which     : { type: String },
  keyCode   : { type: String },
  charCode  : { type: String },
  key       : { type: String },
});

export default mongoose.model('log-keyboard', logKeyboardSchema);