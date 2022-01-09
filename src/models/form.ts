import mongoose from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');

const formSchema = new mongoose.Schema({

  formName: { type: String, required: true, unique: true },
  questions: [{
    title: { type: String },
    hint: { type: String },
    name: { type: String },
    value: { type: String },
    choices: [{type: String}],
    stars: { type: Number },
    scaleOptions: {
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      minLabel: { type: String },
      maxLabel: { type: String },
    },
    type: { type: String, required: true },
    validators: {
      required: { type: Boolean },
      minLength: { type: Number },
      maxLength: { type: Number },
    }
  }]

});

formSchema.plugin(uniqueValidator);

module.exports = mongoose.model('form', formSchema);