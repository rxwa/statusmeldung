require('dotenv').config()
const User = require("../models/User");
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { name: '', surname: '', phone: '', company: '', email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'Diese Emailadresse existiert nicht.';
  }
  
  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'Diese Emailadresse ist bereits registriert.';
    return errors;
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'Das Passwort ist inkorrekt.';
  }


  // incorrect phone number
  if (err.message === 'user validation failed') {
    errors.phone = 'Bitte geben Sie eine gültige Handynummer an.'
  }
  
  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 12 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { name, surname, phone, company, email, password } = req.body;

  try {
    const user = await User.create({ name, surname, phone, company, email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}