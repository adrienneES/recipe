import express from 'express';
import path  from 'path';
import open  from 'open';
import webpack from 'webpack';
import config from '../webpack.config.dev';
var bodyParser = require('body-parser');
// import
//var pinterestAPI = require('pinterest-api');

/* eslint-disable no-console */

const port = process.argv[2] || 5000;
var app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo:true,
  publicPath: config.output.publicPath
}));

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
var url = 'mongodb://localhost:27017/tempDatabase';
var mongodb = require('mongodb').MongoClient;
mongodb.connect(url, function(err, db) {
  if (err) {
    console.log(err);
  } else  if (!db) {
    console.log('no db');
  }else {
  }});
//app.use(express.static('src/js'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  {link: '/ingredients', text: 'ingredients'},
  {link: '/recipes', text: 'recipes'},
  {link: '/shopping', text: 'shopping'},
  {link: '/data', text: 'data'}
]
var mainController = require('../src/controllers/mainController')(nav);
app.get('/', mainController.getData);

app.get('/shopping', function (req, res) {
  res.send('hi shopping');
});

var recipeRouter = require('../src/routes/recipeRouter')(nav);
var ingredientRouter = require('../src/routes/ingredientsRouter')(nav);
var authRouter = require('../src/routes/authRouter')(nav);
var dataRouter = require('../src/routes/dataRouter')(nav);
app.use('/auth', authRouter);
app.use('/ingredients', ingredientRouter);
app.use('/recipes', recipeRouter);
app.use('/data', dataRouter);

app.listen(port, function(err) {
  if(err) {
      console.log(err);
  } else {
      open('http://localhost:' + port);
  }
});

/*
var mailgun = require("mailgun-js");
var api_key = 'secret - in notepad++';
var DOMAIN = 'secret - in notepad++';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

var data = {
  from: 'Excited User <secret - in notepad++>',
  to: 'secret - in notepad++',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

mailgun.messages().send(data, function (error, body) {

  console.log(body);
});
*/
/*
app.get('/', function (req, res) {
  // Create a new object and set the accountname
var pinterest = pinterestAPI('adricurtis');
var pinData;
// Get pins from a board (second parameter determines whether you want the results paginated and to include some metadata)
//pinterest.getPinsFromBoard('dinner', true, function (pins) {
//  pinData = pins;
//  console.log(pins.data);
//  console.log(pins.data.length);
//  res.send(pins.data);
//});
// Get data for pins (note that this is a static method (a method of the class itself) since it does not rely on any state)
//pinterestAPI.getDataForPins(['833658580996442219'], function (data) {
//  res.send(data);
//  console.log(data);
//});//
//res.send(pinData);
  res.sendFile(path.join(__dirname, '../src/views/index.html'));
});
*/
