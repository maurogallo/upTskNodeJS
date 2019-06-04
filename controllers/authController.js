const passport = require('passport');

const Usuarios = require('../models/Usuarios');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatrios' 
});

// Funcion para revisar si el usuairo esta logueado o no

exports.usuarioAutenticado = (req, res, next) => {
//si el usuario es tautenticado adelante

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
    const {email} = req.body
    const usuario = await  Usuarios.findOne({where:{ email: req.body.email }});

    // si no existe el usuario
    if(!usuario){
        req.flash('error', 'Np existe esa cuenta')
        res.render('reestablecer',{
            nombrePagina: 'Reestablecer tu contraseña', 
            mensajes: req.flash()
        })
    }
}