//Importing packages
const express = require('express');
//const handlebars = require('express-handlebars');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
//const mongoose = require('mongoose');
const app = express();
const admin = require('./routes/admin');

//Config
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    //Handlebars
        app.engine('handlebars', engine({ extname: 'handlebars', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts/' }))
        app.set('view engine', 'handlebars');
//Routes
app.get('/', (req, res) => {
   res.send('Main Route');
});

app.get('/posts', (req, res) => {
   res.send('Posts List');
});

app.use('admin', admin);

//Others
const PORT = 8084;
app.listen(PORT, () => {
   console.log('Servidor conectado e rodando! ');
});