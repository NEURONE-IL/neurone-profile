import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({

  question: { type: String, required: true },
  formType: { type: String, required: true },
  date: { type: Date },
  answerNum: { type: Number },
  answerString: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true } 

})

module.exports = mongoose.model('form', formSchema);