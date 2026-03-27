import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Teacher', 'Admin'], default: 'Student' },
  studentId: { type: String },
  program: { type: String },
  skills: [{ type: String }],
  interests: [{ type: String }],
  reputation: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  profilePicture: { type: String },
  preferences: {
    darkMode: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
