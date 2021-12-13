import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    email: { type: String },
    number: { type: Number }
});

module.exports = mongoose.model('profile', profileSchema);