import mongoose from 'mongoose';

const SynthesisAnswer = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  username: { type: String },
  timestampClient: { type: Number },
  timestampServer: { type: Number },
  dateClient: { type: Date },
  dateServer: { type: Date },
  startTime: { type: Number }, // time when the synth component was loaded
  startTimeDate: { type: Date },
  question: { type: String },
  answer: { type: String },
  answerHTML: { type: String },
  completeAnswer: { type: Boolean }, // true if manual submission, false if auto saved
});

export default mongoose.model('synthesis-answer', SynthesisAnswer);