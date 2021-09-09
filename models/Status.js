const mongoose = require('mongoose')

const statusSchema = new mongoose.Schema({
  caseid: {
    type: String,
    required: true
  },
  stati: {
    type: String,
    required: true
  },
  zek: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  statusdate: {
    type: Date,
    default: Date.now
  }
})
const Status = mongoose.model('Status', statusSchema)
module.exports = Status