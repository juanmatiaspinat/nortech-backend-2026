const express = require("express");
const router = express.Router();
const { crearVenta , obtenerHistorialPorUsuario} = require("../controllers/ventasController");
const authenticate = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/isAdmin");

//SOLO autenticación, NO requiere 'isAdmin'
router.post("/", authenticate, crearVenta);
router.get("/:idusuario/historial", authenticate, obtenerHistorialPorUsuario);

module.exports = router;
