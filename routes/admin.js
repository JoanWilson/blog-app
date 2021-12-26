const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model('categories');

router.get('/', (req, res) => {
    res.render('admin/index');
});

router.get('/posts', (req, res) => {
   res.send('Post page');
});

router.get('/categories', (req, res) => {
    Category.find().lean().sort({date: 'desc'}).then(categories => {
        res.render('admin/categories', {categories: categories});
    }).catch(err => {
        res.flash('error_msg', 'An error has occurred while loading the category list');
        res.render('admin/categories');
    })
});

router.get('/categories/add', (req, res) => {
   res.render('admin/addcategories');
});

router.post('/categories/new', (req, res) => {

    var erros = [];

    if(!req.body.name || typeof req.body.name === undefined) {
        erros.push({text: 'Name invalid'});
    }

    if(!req.body.slug || typeof req.body.slug === undefined) {
        erros.push({text: 'Slug invalid'});
    }

    if(req.body.name.length < 3) {
        erros.push({text:'The Name cannot be shorter than 3 letter'});
    }

    if(erros.length > 0) {
        res.render('admin/addcategories', {erros: erros});
    } else {
        const newCategory = {
            nome: req.body.name,
            slug: req.body.slug
        }

        new Category(newCategory).save().then(() => {
            req.flash('success_msg', 'Category has been added successfully');
            res.redirect('/admin/categories');
        }).catch(err => {
            req.flash('error_msg', 'An error has occurred while adding category: ' + err);
        });
    }
});

router.get('/categories/edit/:id', (req, res) => {

});


module.exports = router;