'use strict'
const express = require('express');
const router = express.Router();
const wikiRouter = require('./wiki');
//const userRouter = require('./user');

router.use('/wiki', wikiRouter);
//router.use('/user', userRouter);
//router functions
router.get('/', (req, res, next) => {
        console.log("the homepage should be showing");
        res.render('index', {
            title: 'Wikistacks'
        });
    });

    module.exports = router;