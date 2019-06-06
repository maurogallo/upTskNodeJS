const  Usuarios =require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
   res.render('crearCuenta', {
       nombrePagina: 'Crear cuenta en Uptask'
   })
}

exports.formIniciarSesion = (req, res) => {
    const  {error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en Uptask',
        error: error
    })
 }
exports.crearCuenta = async (req, res) => {
    //leer los datos
    const { email, password } =req.body;

    try {
        //crear el usuario
        await Usuarios.create({
            email,
            password
        });

        // crear una URL de confirmar

        const confirmaUrl =  `http://${req.headers.host}/confirmar/${email}`;

        // crear el objeto de usuario
        const usuario = {
            email
        }

        //enviar email

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmaUrl,
            archivo: 'confirmar-cuenta'
        });


        // redirigir al usuario

        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion')
    } catch (error){
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask',
            email: email,
            password: password
           
        })
    }
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer',{
        nombrePagina: 'Reestablecer tu contraseña'
    })
}