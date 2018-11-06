// const rekognition = require('../models/rekognition');
// rekognition.viewFaces();

/**
 * GET /error
 * Authentication Page Error.
 */

exports.index = (req, res) => {
  res.render('login', {log: "We Can't See Your Face"});
};
