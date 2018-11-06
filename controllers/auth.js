const fs = require('fs');
const uuid = require('node-uuid');
const path = require('path');
const sharp = require('sharp');
const appDir = path.dirname(require.main.filename);

const h = require('../helpers');
const rekognition = require('../models/rekognition');
const userExsits = require('../models/userExsits');
const renderUserPage = require('../models/renderUserPage');

/**
 * POST /auth
 * Authentication Page.
 */

exports.index = (req, res) => {
  const authCallback = function(faceFound, data, fileNameToDelete, imageBuffer) {
    if (faceFound) {
      if (userExsits(data).status) {
        renderUserPage(userExsits(data).userId, res);
      } else {
        rekognition.createUser(imageBuffer, function(userId) {
          renderUserPage(userId, res);
        });
      }
    } else {
      res.redirect('/error');
    }
    if (fileNameToDelete) {
      fs.unlink(fileNameToDelete);
    }
  }

  if (req.file) {
    const fileName = appDir + '/' + req.file.path;
    sharp(fileName).resize(null, 700).toBuffer(function (err, buf) {
      rekognition.faceAuth(buf, authCallback, fileName);
    });
  } else {
    const imageBuffer = h.decodeBase64(req.body.image);
    rekognition.faceAuth(imageBuffer.data, authCallback, false);
  }
};
