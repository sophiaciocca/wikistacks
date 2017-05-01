const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;


    router.get('/', function(req, res, next) {
        //res.send("We got to wiki!");
        res.redirect('../');
    });

    router.post('/', function(req, res, next) {
        //res.send('Posting to wiki!');
        console.log(req.body);
        var page = Page.build({
            title: req.body.title,
            content: req.body.content,
            status: req.body.status
        });
        page.save().then(res.status(201).json(req.body));

    });

    router.get('/add', function(req, res, next) {
        //res.send('Got add!');
        res.render('../views/addpage.html');
    });





module.exports = router;