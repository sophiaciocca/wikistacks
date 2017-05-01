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
        var page = Page.build({
            title: req.body.title,
            content: req.body.content,
            status: req.body.status
        });
        page.save().then(function(savedPage) { 
            res.redirect(savedPage.route); 
        }).catch(next);

    });

    router.get('/add', function(req, res, next) {
        //res.send('This is the form to post a new page!');
        res.render('../views/addpage.html');
    });

    router.get('/:pageName', function(req, res, next) {

        Page.findOne({
            where: {
                urlTitle: req.params.pageName
            }
        }).then(function(foundPage) {
            res.render('../views/wikipage.html', { page: foundPage });
        }).catch(next);

    });





module.exports = router;