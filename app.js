//Importing packages
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const admin = require('./routes/admin');
const path = require("path");
const session = require('express-session');
const flash = require('connect-flash');


//Config
    //Session
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }));
        //Código abaixo precisa estar abaixo da Session
        app.use(flash());
    //Midleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success-msg');
            res.locals.error_msg = req.flash('error-msg');
            next();
        });

    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

    //Handlebars
        app.engine(
            'handlebars',
            engine({
                extname: 'handlebars',
                defaultLayout: 'main',
                layoutsDir: __dirname + '/views/layouts/'
            }))
        app.set('view engine', 'handlebars');

    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/blogapp').then(() => {
           console.log('Conectado ao banco de dados MongoDB');
        }).catch(err => {
            console.log('Houve um erro ao se conectar com o MongoDB' + err);
        });
    // Public
        app.use(express.static(path.join(__dirname, 'public')));

        //Midleware
        app.use((req, res, next) => {
           console.log('Midleware detected');
           next();
        });
//Routes
app.get('/', (req, res) => {
   res.send('Main Route');
});

app.get('/posts', (req, res) => {
   res.send('Posts List');
});

app.use('/admin', admin);

//Others
const PORT = 8084;
app.listen(PORT, () => {
   console.log('Servidor conectado e rodando! ');
});