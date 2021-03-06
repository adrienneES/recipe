import express from 'express';
import open  from 'open';
import webpack from 'webpack';
import config from '../webpack.config.dev';
import bodyParser from 'body-parser'; 

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
 //app.use(express.static('src/js'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  {link: '/ingredients', text: 'ingredients'},
  {link: '/recipes', text: 'recipes'},
  {link: '/pinterest', text: 'pinterest'},
  {link: '/shopping', text: 'shopping'},
  {link: '/types', text: 'types'},
  {link: '/data', text: 'data'}
] 
/* var middleware = function (req, res, next) {
  console.log('middleware!');
  next();
};
app.use(middleware);
 */

var mainController = require('../src/controllers/mainController')(nav);
app.get('/', mainController.getData);

const shoppingRouter = require('../src/routes/shoppingRouter')(nav);
const recipeRouter = require('../src/routes/recipeRouter')(nav);
const ingredientRouter = require('../src/routes/ingredientsRouter')(nav);
const authRouter = require('../src/routes/authRouter')(nav);
const dataRouter = require('../src/routes/dataRouter')(nav);
const typesRouter = require('../src/routes/typesRouter')(nav);
const pinterestRouter = require('../src/routes/pinterestRouter')(nav);
app.use('/auth', authRouter);
app.use('/ingredients', ingredientRouter);
app.use('/recipes', recipeRouter);
app.use('/data', dataRouter);
app.use('/shopping', shoppingRouter);
app.use('/types', typesRouter);
app.use('/pinterest', pinterestRouter);

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
