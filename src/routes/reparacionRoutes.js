const express = require("express");

const router = express.Router();

const authenticate =
    require("../middlewares/authenticate");

const {
    isAdmin,
} = require("../middlewares/isAdmin");

const {
    createReparacion,
    getReparacionesUsuario,
    getTodasReparaciones,
    updateEstadoReparacion,
    updateDiagnostico,
} = require(
    "../controllers/reparacionController"
);

router.post(
    "/",
    authenticate,
    createReparacion
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
    updateDiagnostico
);

module.exports = router;
