const express = require("express");

const router = express.Router();

const authenticate =
    require("../middlewares/authenticate");

const {
    isAdmin,
} = require("../middlewares/isAdmin");

const {
    crearReparacion,
    getReparacionesUsuario,
    getTodasReparaciones,
    updateEstadoReparacion,
    actualizarDiagnostico,
} = require(
    "../controllers/reparacionController"
);

router.post(
    "/",
    authenticate,
    crearReparacion
);

router.get(
    "/mis-reparaciones",
    authenticate,
    getReparacionesUsuario
);

router.get(
    "/todas",
    authenticate,
    isAdmin,
    getTodasReparaciones
);

router.put(
    "/estado/:id",
    authenticate,
    updateEstadoReparacion
);

router.put(
    "/diagnostico/:id",
    authenticate,
    isAdmin,
    actualizarDiagnostico
);

module.exports = router;
