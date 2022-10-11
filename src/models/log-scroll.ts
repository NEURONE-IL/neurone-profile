import mongoose from 'mongoose';

const logScrollSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  userEmail: { type: String },
  type  : { type: String },
  source: { type: String },
  url   : { type: String },
  timestampClient: { type: Number },
  timestampServer: { type: Number },
  dateClient: { type: Date },
  dateServer: { type: Date },
  x_scr : { type: Number },
  y_scr : { type: Number },
  w_win : { type: Number },
  h_win : { type: Number },
  w_doc : { type: Number },
  h_doc : { type: Number },

});

export default mongoose.model('log-scroll', logScrollSchema);