/**
 * Module dependencies.
 */
const AWS = require('aws-sdk');
const uuid = require('node-uuid');
const Users = require('../DB/usersModel');

/**
 * Configure and start AWS Rekognition.
 */
AWS.config.loadFromPath(__dirname +'/secret-config.json');
const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});


/**
 * Functions.
 */
exports.faceAuth = function (imageBuffer, cb, fileNameToDelete) {
  var params = {
    CollectionId: 'secretsUsers',
    Image: {
      Bytes: imageBuffer
    },
    FaceMatchThreshold: 90,
    MaxFaces: 1
  };
  rekognition.searchFacesByImage(params, function(err, data) {
    if (data && !err) {
      cb(true, data, fileNameToDelete, imageBuffer);
    } else {
      cb(false, {}, fileNameToDelete);
    }
  });
}

exports.createUser = function(imageBuffer, cb) {
  const newUserId = uuid.v4();
  const newUser = [{
    userId: newUserId,
    notes: {}
  }]
  console.log(newUser);
  Users.create(newUser, function() {
    cb(newUserId);
  })

  const params = {
    CollectionId: "secretsUsers",
    DetectionAttributes: [
    ],
    ExternalImageId: newUserId,
    Image: {
     Bytes: imageBuffer
    }
   };

  rekognition.indexFaces(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

exports.viewFaces = function() {
  var params = {
    CollectionId: 'secretsUsers',
    MaxResults: 10
  };
  rekognition.listFaces(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

exports.deleteFaces = function() {
  var params = {
    CollectionId: 'secretsUsers', /* required */
    FaceIds: [ /* required */
      '0c17717c-7201-5e08-a1eb-200350dfe656',
      '16bf1cae-8e79-54d7-8e3d-4a07264fa3a7',
      '32bc9ecd-de29-536e-81e2-70e52689dd9a',
      '44847f01-329e-5a4b-9744-0db48b3391ae',
      '6c66c465-b6cf-554f-af7d-28f57d08cbe1',
      'dfd0f2c0-3e77-52a2-9cea-a0342c8526fc'
      /* more items */
    ]
  };
  rekognition.deleteFaces(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}



// var params = {
//   CollectionId: "secretsUsers"
// };
// rekognition.createCollection(params, function(err, data) {
//   if (err)
//     console.log(err, err.stack); // an error occurred
//   else
//     console.log(data); // successful response
//   }
// );

// const targetImageBase64 = h.encodeBase64('target.jpg');

// const params = {
//   SimilarityThreshold: 90,
//   SourceImage: {
//     Bytes: sourceImageBase64
//   },
//   TargetImage: {
//     Bytes: targetImageBase64
//   }
// };

// const params = {
//   CollectionId: "secretsUsers",
//   DetectionAttributes: [
//   ],
//   ExternalImageId: "3",
//   Image: {
//    Bytes: alexa
//   }
//  };
//
// rekognition.indexFaces(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

// var params = {
// };
// rekognition.listCollections(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

// var params = {
//   CollectionId: 'secretsUsers',
//   MaxResults: 10
// };
// rekognition.listFaces(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });
//
// var params = {
//   CollectionId: 'secretsUsers',
//   Image: {
//     Bytes: car
//   },
//   FaceMatchThreshold: 88,
//   MaxFaces: 1
// };
// rekognition.searchFacesByImage(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });
