'use strict'

const express = require('express');
const app = express();
const morgan = require('morgan');
const routes = require('./routes');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const nunjucks = require ('nunjucks');

//templating boilerplate setup
app.engine('html', nunjucks.render); // rendering html templates
app.set('view engine', 'html'); //what file extension do our templates have
nunjucks.configure('views', {noCache: true});

//logging middleware
app.use(morgan('dev'));

//body parser
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); //in case there are any AJAX requests

//set up server
const server = app.listen(3000, () => console.log('listening on port 3000'));

//set up static middleware to show CSS page
app.use(express.static(path.join(__dirname, '/public')));

//set up router
app.use('/', routes);


