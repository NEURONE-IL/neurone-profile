import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  email: { type: String },
  number: { type: Number }
});

export default mongoose.model('profile', profileSchema);