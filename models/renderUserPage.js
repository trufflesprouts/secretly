const Users = require('../models/DB/usersModel');

const renderUserPage = function(userId,res) {
  Users.find({userId: userId},
  function(err, data) {
    if (err) throw err;
    res.render('notes', {data: data})
  })
}

module.exports = renderUserPage;
