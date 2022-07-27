import mongoose from 'mongoose';

const SynthesisAnswer = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  username: { type: String },
  startTime: { type: Number }, // time when the synth component was loaded
  startTimeDate: { type: Date },
  question: { type: String },
  answer: { type: String },
  answerHTML: { type: String },
  completeAnswer: { type: Boolean }, // true if manual submission, false if auto saved
  clientDate: { type: Date },
  serverDate: { type: Date },
  clientTimestamp: { type: Number },
  serverTimestamp: { type: Number }
});

export default mongoose.model('synthesis-answer', SynthesisAnswer);