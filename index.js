/**
 * Module dependencies.
 */
const fs = require('fs');
const express = require('express');
const multer  = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const configDB = require('./models/DB');

/**
 * Controllers (route handlers).
 */
const loginController = require('./controllers/login');
const loginErrorController = require('./controllers/loginError');
const authController = require('./controllers/auth');
const usersController = require('./controllers/users');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(configDB.getDbConnectionString());

/**
 * Configure multer upload.
 */
const upload = multer({
  dest: 'uploads/',
  fileFilter: function(req, file, cb) {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
  }
});

/**
 * Express configuration.
 */
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

/**
 * Primary app routes.
 */

// const Users = require('./models/DB/usersModel');
// Users.find({userId: '28875b3e-471c-46f5-a936-10ae5ca25217'},
//   function(err, data) {
//     if (err) throw err;
//     console.log(data);
// });

userData = [ { _id: '58f3b9085c2c74486965c39c',
    userId: '28875b3e-471c-46f5-a936-10ae5ca25217',
    notes:
     { '1493479625478': 'Please Work 😭',
       '1493479615625': 'I like burgers 🍔🍔',
       '1493479583227': 'I hate seeing the Strilondes (Dirk, Dave, Roxy, and Rose) drawn with dark skin 😡. It looks ugly as hell when they have white/light blonde hair alongside it. It’s also ugly when people draw them (especially Dave) with the sides shaved and the character just has a curly poof of hair atop their head. It just doesn’t look good in my opinion.',
       '1493479564486': 'The tumblr art style is seriously one of the ugliest things ever. With the overuse of pastel colors, “progressive kawaii” crap, bad anatomy, scribbly shit, drooped eyes and red noses, it’s become a warning against bad art.' },
    __v: 0 } ];

app.get('/test', (req, res) => {
  res.render('notes', {data: userData})
});
app.get('/error', loginErrorController.index);
app.get('*', loginController.index);
app.post('/auth', upload.single('file'), authController.index);
app.post('/notes', usersController.updateNotes);


/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
