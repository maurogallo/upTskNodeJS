const passport = require("passport");
//const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia la modelo donde vamos a autenticar

const Usuarios = require('../models/Usuarios');


// local strategy - Login con creenciales propios (usuario y password)

passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordFied: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                // El usuario existe, pero password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false,{
                        message : 'Password Incorrecto'
                    })

                }
                // El email existe, y el password correcto
                return done(null, usuario);
            }catch(error) {
                // Ese usuario no existe
                return done(null, false,{
                    message : 'Esa cuenta no existe'
                })
            }
        }
    )
);

// serializar el usuarios

passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// deserializar el usuario

passport.deserializeUser((usuario, callback) =>{
    callback(null, usuario);
});

module.exports = passport;