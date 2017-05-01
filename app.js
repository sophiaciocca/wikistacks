'use strict'

const express = require('express');
const app = express();
const morgan = require('morgan');
const routes = require('./routes');
const models = require('./models');
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

//sync our models to database
models.db.sync({force: true})
    // .then(function() {
    //    // //console.log(models.Page.sync());
    //     return models.Page.sync({});
    // })
    .then(function() {
        app.listen(3000, () => console.log('listening on port 3000'));
    })
    .catch(console.error);

//set up server
// const server = app.listen(3000, () => console.log('listening on port 3000'));

//set up static middleware to show CSS page
app.use(express.static(path.join(__dirname, '/public')));

//set up router
app.use('/', routes);



