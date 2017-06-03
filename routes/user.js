const express = require('express');
const wikiRouter = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;
module.exports = {
    router: router
}

//GET /users
router.get('/', function (req, res, next) {

    User.findAll()
        .then(function (users) {
            res.render('users.html', {
                users: users
            });
        })
        .catch(next);

})

// GET /users/id
router.get('/:userId', function (req, res, next) {

    //promise to get the author's pages
    var findingUserPages = Page.findAll({
        where: {
            authorId: req.params.userId
        }
    });

    //promise to get the user
    var findingUser = User.findById(req.params.userId)
        .then(function() {

        })
        .catch(next);

    //connect them
    Promise.all([findingUserPages, findingUser])
        .then(function() {
            var pages = values[0];
            var user = values[1];

            user.pages = pages;
            
            res.render('userpage', {
                user: user,
            })
        })
        .catch(next);
})