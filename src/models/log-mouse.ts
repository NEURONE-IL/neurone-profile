import mongoose from 'mongoose';

const logMouseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  userEmail: { type: String },
  type  : { type: String },
  source: { type: String },
  url   : { type: String },
  timestampClient: { type: Number },
  timestampServer: { type: Number },
  dateClient: { type: Date },
  dateServer: { type: Date },
  x_win : { type: Number },
  y_win : { type: Number },
  w_win : { type: Number },
  h_win : { type: Number },
  x_doc : { type: Number },
  y_doc : { type: Number },
  w_doc : { type: Number },
  h_doc : { type: Number },
});

export default mongoose.model('log-mouse', logMouseSchema);