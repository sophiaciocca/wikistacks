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

//body parser (for 'puts' and 'posts')
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); //in case there are any AJAX requests

//error handling middleware
app.use(function (err, req, res, next) {
    res.status(500).send(err.message);
});

//sync our models to database
models.db.sync({force: true})
    .then(function() {
        app.listen(3000, () => console.log('listening on port 3000'));
    })
    .catch(console.error);

//set up static middleware to show CSS page
app.use(express.static(path.join(__dirname, '/public')));

//set up router
app.use('/', routes);


/*QUESTIONS
    1) for hooks on Models: 'beforeValidate' vs. 'afterValidate'? 
    We used 'afterValidate' but they used 'beforeValidate' in video

    2) Go over the connecting-user part again..... actually prob do the whole workshop again
*/

