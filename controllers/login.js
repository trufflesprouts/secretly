// const rekognition = require('../models/rekognition');
// rekognition.viewFaces();

/**
 * GET /
 * Authentication Page.
 */

exports.index = (req, res) => {
  res.render('login', {log: ''});
};
