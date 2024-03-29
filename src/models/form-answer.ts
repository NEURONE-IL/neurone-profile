import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  username: { type: String },
  formId: { type: String, required: true },
  clientDate: { type: Date },
  serverDate: { type: Date },
  questions: [{
    question: { type: String, required: true },
    formType: { type: String, required: true },
    answer: { type: String },
    answerArray: [{ // for answers like checkbox answers that include many different answers
      question: { type: String, required: true },
      answer: { type: Boolean, required: true }
    }]
  }]
})

export default mongoose.model('form-answer', formSchema);