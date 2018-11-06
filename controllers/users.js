const Users = require('../models/DB/usersModel');

/**
 * POST /notes
 * Update notes.
 */

exports.updateNotes = (req, res) => {
  Users.update({userId:req.body.userId}, {
    notes: req.body.notes
  }, function(err) {
    if (err) throw err;
    res.send('success');
  });
};
