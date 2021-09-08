const mongoose = require('mongoose');
const { isEmail } = require('validator');
const { isMobilePhone } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Der Name muss mindestens 2 Zeichen lang sein.'],
    required: [true, 'Bitte geben Sie Ihren Namen an.']
  },
  surname: {
    type: String,
    minlength: [3, 'Der Nachname muss mindestens 3 Zeichen lang sein.'],
    required: [true, 'Bitte geben Sie Ihren Nachnamen an.']
  },
  phone: {
    type: String,
    required: [true, 'Bitte geben Sie Ihre Handynummer an.'],
    minlength: [10, 'Bitte geben Sie eine gültige Handynummer an.'],
    validate: [isMobilePhone, 'Bitte geben Sie eine gültige Handynummer an']
  },
  company: {
    type: String,
    required: [true, 'Bitte geben Sie Ihren Ortsverein/Kreisverband/Landesverband an.'],
    minlength: [3, 'Bitte geben Sie Ihren Ortsverein/Kreisverband/Landesverband an.']
  },
  email: {
    type: String,
    required: [true, 'Bitte geben Sie Ihre Emailadresse an.'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Bitte geben Sie eine gültige Emailadresse an.']
  },
  password: {
    type: String,
    required: [true, 'Bitte wählen Sie ein Passwort.'],
    minlength: [6, 'Das Passwort muss mindestens 6 Zeichen lang sein.'],
  },
  regdate: {
    type: Date,
    default: Date.now
  }
})

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  // const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('User', userSchema);

module.exports = User;