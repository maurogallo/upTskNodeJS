const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize =require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatrios' 
});

// Funcion para revisar si el usuairo esta logueado o no

exports.usuarioAutenticado = (req, res, next) => {
//si el usuario es autenticado adelante

if (req.isAuthenticated()){
    return next();
}

//sino esta autenticado redirigir al formulario
return res.redirect('/iniciar-sesion');
}

// funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() =>{
        res.redirect('/iniciar-sesion');// al cerrar sesion nos lleva al login
    })
}

// genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    // verificar que el usuario exista
    const { email } = req.body;
    const usuario = await  Usuarios.findOne({where: { email: req.body.email }});

    // si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/reestablecer');
    }

    // usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    
    // guardarlos en la base de datos

    await usuario.save();
    
    // url de reset

    const resetUrl =  `http://${req.headers.host}/reestablecer/${usuario.token}`;
    res.redirect(resetUrl);

    //console.log(resetUrl);
}

exports.validarToken = async (req, res) => {

    //res.json(req.params.token);
   const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
  });
    console.log(usuario);


    //sino encuentra el usuario
    if(!usuario){
        req.flash('error', 'no valido');
        res.redirect('/reestablecer');
   }

   // formulario para generar el password
   res.render('resetPassword',{
       nombrePagina : 'Restablecer Contraseña'
   })
}


// cmabia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
    
    //verifica el token valido pero tambien la fecha de expiracion
 const usuario = await  Usuarios.findOne({
     where: {
         token: req.params.token,
         expiracion :{
                [Op.gte] : Date.now()
         }
     }
 });

 // verificamos si el usuario existe
    if(!usuario){
        req.flash('error', ' No valido');
        res.redirect('/reestablecer');
    }
    
    
    // hashear el password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    
    // guradamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}
