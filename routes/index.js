const express = require('express');
const router = express.Router();

// improtar express validatos

const { body } = require('express-validator/check');

// impotar el controlador
const proyectosController = require('../controllers/proyectosController');

const tareasController =require('../controllers/tareasController');
const usuariosController =require('../controllers/usuariosController');

module.exports = function(){
// ruta para el home
router.get('/', proyectosController.proyectosHome);
router.get('/nuevo-proyecto', proyectosController.formularioProyecto);
router.post('/nuevo-proyecto',
     body('nombre').not().isEmpty().trim().escape(),
     proyectosController.nuevoProyecto);

     //listar proyecto
router.get('/proyectos/:url', proyectosController.proyectoPorUrl);

     // Atualizar el proyecto

router.get('/proyecto/editar/:id', proyectosController.formularioEditar);
router.post('/nuevo-proyecto/:id',
     body('nombre').not().isEmpty().trim().escape(),
     proyectosController.actualizarProyecto);

// Eliminar proyecto

router.delete('/proyectos/:url', proyectosController.eliminarProyecto);

// Tareas
router.post('/proyectos/:url', tareasController.agregarTarea);

// Actulizar tarea
router.patch('/tareas/:id', tareasController.cambiarEstadoTarea);

// Eliminar  tarea
router.delete('/tareas/:id', tareasController.eliminarTarea);

// crear nueva cuenta

router.get('/crear-cuenta',usuariosController.formCrearCuenta)
router.post('/crear-cuenta',usuariosController.crearCuenta);

// iniciar sesion
router.get('/iniciar-sesion', usuariosController.formIniciarSesion);

return router;
}

