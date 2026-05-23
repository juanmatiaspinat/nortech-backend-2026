const express = require("express");
const router = express.Router();
const { createVenta , getHistorialPorUsuario} = require("../controllers/ventasController");
const authenticate = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/isAdmin");

//SOLO autenticación, NO requiere 'isAdmin'
router.post("/", authenticate, createVenta);
router.get("/:idusuario/historial", authenticate, isAdmin, getHistorialPorUsuario);

module.exports = router;
