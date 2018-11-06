const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  userId: String,
  notes: Object
})

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
