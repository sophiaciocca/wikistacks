'use strict'
const express = require('express');
const router = express.Router();
const wikiRouter = require('./wiki');
const models = require('../models');
const Page = models.Page;
const User = models.User;
const userRouter = require('./user');

router.use('/wiki', wikiRouter);
router.use('/user', userRouter);

//homepage router function
router.get('/', (req, res, next) => {
    //res.render('index', { title: 'Wikistacks' });

    Page.findAll({}).then(function(foundPage) {
            res.render('index', { nunjucksPages: foundPage });
        }).catch(next);



});

module.exports = router;




// Page.findOne({
//             where: {
//                 urlTitle: req.params.pageName
//             }
//         }).then(function(foundPage) {
//             res.render('../views/wikipage.html', { page: foundPage });
//         }).catch(next);