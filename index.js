const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');




// helpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexion ala BD

const db = require('./config/db');

// importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

//Importar el modelo
db.sync()
    .then(() => console.log('conectado al servidor'))
    .catch((error) => console.log(error));

//crear una app de express
const app = express();

// donde cargar los archivos estaticos
app.use(express.static('public'));


// habilitar pug
app.set('view engine', 'pug');

// habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({
    extended: true
}));

// Agregamos express validator a toda la aplicacion
app.use(expressValidator());




// añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));



app.use(cookieParser());

// sessiones ns permite navegar entre distintas paginas sin volvernos autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Agregar flash messages
app.use(flash());

//Pasar van dump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {
        ...req.user
    } || null;
    next();
});



app.use('/', routes());

app.listen(3000);

require('./handlers/email');