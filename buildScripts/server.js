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
var url = 'mongodb://localhost:27017/tempDBForTesting';
var mongodb = require('mongodb').MongoClient;
mongodb.connect(url, function(err, db) {
  if (err) {
    console.log(err);
  } else  if (!db) {
    console.log('no db');
  }else {
/*     var collection = db.collection('temp');
var user = {username: 'a', password: 'b'};
collection.insert(user, function(err, results) {
  console.log(results);
 });
*/
  }});
//app.use(express.static('src/js'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  {link: '/ingredients', text: 'ingredients'},
  {link: '/recipes', text: 'recipes'},
  {link: '/shopping', text: 'shopping'}
]
app.get('/', function(req,res) {
  res.render('index', {
    title: 'food planner',
    nav: nav});
});

app.get('/shopping', function (req, res) {
  res.send('hi shopping');
});

app.get('/recipes', function (req, res) {
  res.send('hi recipes');
});

var ingredientRouter = require('../src/routes/ingredientsRouter')(nav);
var authRouter = require('../src/routes/authRouter')(nav);
app.use('/auth', authRouter);
app.use('/ingredients', ingredientRouter);

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
