const passport = require('passport');
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