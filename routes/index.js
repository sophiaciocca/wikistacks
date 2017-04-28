'use strict'
const express = require('express');
const router = express.Router();

//router functions
router.get('/', (req, res, next) => {
        console.log("the homepage should be showing");
        res.render('index', {
            title: 'Wikistacks'
        });
    });

    module.exports = router;
