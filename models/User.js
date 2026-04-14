const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//defines what a user will look like in the database
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

//hashes password before saveed to database
userSchema.pre('save', async function() {
  // only hash if passward was changed
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// method that checks if password is correct
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
