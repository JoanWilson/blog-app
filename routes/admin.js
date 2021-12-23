const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Home Panel');
});

router.get('/posts', (req, res) => {
   res.send('Post page');
});

router.get('/categories', (req, res) => {
   res.send('Categories Page');
});


module.exports = router;