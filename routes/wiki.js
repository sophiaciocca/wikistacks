const express = require('express');
const wikiRouter = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;


    wikiRouter.get('/', function(req, res, next) {
        //res.send("We got to wiki!");
        Page.findAll({})
            .then(function(thePages) {
                res.render('index', {
                    pages: thePages
                })
            })
        });

    //route to actually post a new page
    wikiRouter.post('/', function(req, res, next) {

        // var author = User.build({
        //     name: req.body.author_name,
        //     email: req.body.author_email
        // });
        // author.save()
        // .then(function (savedAuthor) {
        //     console.log(savedAuthor);
        // })
        // .catch(next);

        //find OR make a new User out of the author info from the form
        User.findOrCreate({
            where: {
                email: req.body.authorEmail,
                name: req.body.authorName
            }
        })
        .spread (function (user, wasCreatedBool) { //spread is like a special 'then', that takes the values that were created and takes them out of array and makes them 2 args for you. here: [pageThatWasFoundOrCreated, createdBoolean]})
            
            var splitTags = req.body.tags.split(',').map(function(str) {
                return str.trim();
            });
            
            //.create() is like build() and save() all in one
            Page.create({
                title: req.body.title,
                content: req.body.content,
                status: req.body.status,
                tags: splitTags
            })
            .then(function(createdPage) {
                //connects the User and Page as Author (sets authorid in db)
                return createdPage.setAuthor(user); //setAuthor comes from "belongsTo" in models.js
            });
        })
        .then (function (createdPage) {
            res.redirect(createdPage.route);
        })
        .catch(next);

        //build the Page (new wikipage) from the page info on the form
        var page = Page.build({ //could just say Page.build(req.body)
            title: req.body.title,
            content: req.body.content,
            status: req.body.status
        });
        page.save().then(function(savedPage) { 
            res.redirect(savedPage.route); //redirect to the 'virtual' (getterMethod) we built, 'route'
        }).catch(next);

    });

    //route to get the addPage form to add a page
    wikiRouter.get('/add', function(req, res, next) {
        //res.send('This is the form to post a new page!');
        res.render('../views/addpage.html');
    });

    //route to get specific pages by its name (urlTitle)
    //note: this has to be UNDER .get(/add);
    //otherwise the program will think 'add' is a page name!
    wikiRouter.get('/:pageName', function(req, res, next) {

        Page.findOne({
            where: {
                urlTitle: req.params.pageName
            }
        }).then(function(foundPages) {

            //if page doesn't exist, throw an error
            if (page === null) {
                return next(new Error('That page was not found!'));
            }

            //get the author, attach it to our page
            return page.getAuthor()
                .then(function(author) {
                    page.author = author;
                })

                 //render the wikipage template with the page they're looking for
                 res.render('../views/wikipage.html', { page: foundPages });

        }).catch(next);
    });

    wikiRouter.get('/search/:tag', function (req, res, next) {
        
        Page.findByTag(req.params.tag)
            .then(function (pagesFoundByTag) {
                res.render('index', {
                    pages: pagesFoundByTag
                })
            })

    });

    wikiRouter.get('/:urlTitle/similar', function (req, res, next) {
        
        Page.findOne({
            where: {
                urlTitle: urlTitleOfAPage
            }
        })
            .then(function(page) {
                if (page === null) {
                    return next (new Error('That page was not found!'));
                }

                return page.findSimilar;
            })
    })

module.exports = wikiRouter;