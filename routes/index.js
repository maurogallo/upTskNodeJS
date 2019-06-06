const express = require('express');
const router = express.Router();

// improtar express validatos

const {
     body
} = require('express-validator/check');

// impotar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authcontroller = require('../controllers/authController');

module.exports = function () {
     // ruta para el home
     router.get('/',
          authcontroller.usuarioAutenticado,
          proyectosController.proyectosHome);

     router.get('/nuevo-proyecto',
          authcontroller.usuarioAutenticado,
          proyectosController.formularioProyecto);

     router.post('/nuevo-proyecto',
          authcontroller.usuarioAutenticado,
          body('nombre').not().isEmpty().trim().escape(),
          proyectosController.nuevoProyecto);

     //listar proyecto
     router.get('/proyectos/:url',
          authcontroller.usuarioAutenticado,
          proyectosController.proyectoPorUrl);

     // Atualizar el proyecto

     router.get('/proyecto/editar/:id',
          authcontroller.usuarioAutenticado,
          proyectosController.formularioEditar);

     router.post('/nuevo-proyecto/:id',
          authcontroller.usuarioAutenticado,
          body('nombre').not().isEmpty().trim().escape(),
          proyectosController.actualizarProyecto);

     // Eliminar proyecto

     router.delete('/proyectos/:url',
          authcontroller.usuarioAutenticado,
          proyectosController.eliminarProyecto);

     // Tareas
     router.post('/proyectos/:url',
          authcontroller.usuarioAutenticado,
          tareasController.agregarTarea);

     // Actulizar tarea
     router.patch('/tareas/:id',
          authcontroller.usuarioAutenticado,
          tareasController.cambiarEstadoTarea);

     // Eliminar  tarea
     router.delete('/tareas/:id',
          authcontroller.usuarioAutenticado,
          tareasController.eliminarTarea);

     // crear nueva cuenta

     router.get('/crear-cuenta', usuariosController.formCrearCuenta)
     router.post('/crear-cuenta', usuariosController.crearCuenta);
     router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

     // iniciar sesion
     router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
     router.post('/iniciar-sesion', authcontroller.autenticarUsuario);

     // cerrar sesion
     router.get('/cerrar-sesion', authcontroller.cerrarSesion);

     //restablecer contraseñas
     router.get('/reestablecer', usuariosController.formRestablecerPassword);
     router.post('/reestablecer', authcontroller.enviarToken);
     router.get('/reestablecer/:token', authcontroller.validarToken);
     router.post('/reestablecer/:token', authcontroller.actualizarPassword);


     return router;
}