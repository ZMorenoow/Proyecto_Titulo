import express from 'express';
import { getWorkersList, getUsersList, deleteUserAccount, changeUserRole } from '../controllers/admin.controller.js';
import { authRequired, adminRequired} from '../utils/middleware.js';


const router = express.Router();


router.get('/getTrabajadores',authRequired,adminRequired, getWorkersList);


router.get('/getUsuarios',authRequired,adminRequired, getUsersList);


router.delete('/EliminarUsuario/:id', authRequired,adminRequired,deleteUserAccount);

router.put('/CambiarRol/:id',authRequired, adminRequired,changeUserRole);


export default router;