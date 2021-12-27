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

router.post('/categories/add/new', (req, res) => {

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
    } else{
        const newCategory = {
            nome: req.body.name,
            slug: req.body.slug,
            description: req.body.description
        }

        new Category(newCategory).save().then(() => {
            req.flash('success-msg', 'Category has been added successfully');
            console.log('DEU CERTO PORRA')
            res.redirect('/admin/categories');
        }).catch(err => {
            req.flash('error-msg', 'An error has occurred while adding category: ' + err);
            console.log('DEU ERRO PORRA')
            res.redirect('/admin/categories');
        });
    }


});

router.get('/categories/edit/:id', (req, res) => {
    Category.findOne({_id:req.params.id}).lean().then(category => {
        res.render('admin/editcategories', {category: category});
        console.log('Deu bom')
    }).catch(err => {
        req.flash('error-msg', 'An error has occurred while' + err);
        res.redirect('/admin/categories');
        console.log('Deu ruim')
    })

    //res.render('admin/editcategories');

});

router.post('/categories/edit', (req, res) => {
    let erros = [];


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
        res.render('admin/editcategories', {erros: erros});
    } else{
        Category.findOne({_id: req.body.id}).then(category => {

            category.nome = req.body.name;
            category.slug = req.body.slug;
            category.description = req.body.description;
            category.save().then(() => {
                req.flash('success-msg', 'The category has been edited successfully!');
                res.redirect('/admin/categories');
            }).catch(err => {
                req.flash('error-msg', 'The category could not be edited successfully!');
                res.redirect('/admin/categories');
            })
        }).catch(err => {
            req.flash('error-msg', 'The category could not be edited successfully!');
            res.redirect('/admin/categories');
        })
    }

})

router.post('/categories/delete', (req, res) => {
   Category.remove({_id:req.body.id}).then(() => {
       req.flash('success-msg', 'Category deleted successfully!');
       res.redirect('/admin/categories');
   }).catch(err => {
       req.flash('error-msg', 'The category could not be deleted successfully');
       res.redirect('/admin/categories');
   })
});


module.exports = router;