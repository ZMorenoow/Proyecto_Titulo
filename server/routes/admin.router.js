import express from 'express';
import { 
    getWorkersList, 
    getUsersList, 
    deleteUserAccount, 
    changeUserRole, 
    updateUser, 
    getServicesList, 
    addService, 
    updateService, 
    deleteService ,
    getReservationsList,
    updateReservationStatus,
    getReservationsForWorkers,
    deleteReservation,
    addWorkerReservation,
    updateWorkerReservation,
    deleteWorkerReservation
    
} from '../controllers/admin.controller.js';
import { authRequired, adminRequired } from '../utils/middleware.js';

const router = express.Router();

// Rutas para gestionar trabajadores y usuarios
router.get('/getTrabajadores', authRequired, adminRequired, getWorkersList);
router.get('/getUsuarios', authRequired, adminRequired, getUsersList);
router.delete('/EliminarUsuario/:id', authRequired, adminRequired, deleteUserAccount);
router.put('/CambiarRol/:id', authRequired, adminRequired, changeUserRole);
router.put('/ActualizarUsuario/:id', authRequired, adminRequired, updateUser);

// Rutas para gestionar servicios
router.get('/servicios', authRequired, adminRequired, getServicesList); // Obtener lista de servicios
router.post('/servicios', authRequired, adminRequired, addService); // Crear nuevo servicio
router.put('/servicios/:id', authRequired, adminRequired, updateService); // Actualizar un servicio
router.delete('/servicios/:id', authRequired, adminRequired, deleteService); // Eliminar un servicio

// Rutas para gestionar reservas
router.get('/reservas', authRequired, adminRequired, getReservationsList);
router.get('/reservas-trabajador', authRequired, adminRequired, getReservationsForWorkers);
router.put('/reservas/:id_reserva', authRequired, adminRequired, updateReservationStatus);
router.delete('/reservas/:id_reserva', authRequired, adminRequired, deleteReservation);
router.post('/reservas-trabajador', authRequired, adminRequired, addWorkerReservation);
router.put('/reservas-trabajador/:id_reserva_trabajador', authRequired, adminRequired, updateWorkerReservation);
router.delete('/reservas-trabajador/:id_reserva_trabajador', authRequired, adminRequired, deleteWorkerReservation);



export default router;