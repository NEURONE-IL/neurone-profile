import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  formId: { type: String, required: true },
  clientDate: { type: Date },
  serverDate: { type: Date },
  questions: [{
    question: { type: String, required: true },
    formType: { type: String, required: true },
    answer: { type: String, required: true },
  }]

})

module.exports = mongoose.model('form-Answer', formSchema);