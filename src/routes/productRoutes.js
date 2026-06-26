const express = require("express");
const router = express.Router();

//CONTROLADORES
const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    reactivarProducto,
    obtenerProductosActivos,
    obtenerProductosInactivos,
    obtenerCategorias,
    obtenerMarcas,
} = require("../controllers/productController");

//MIDDLEWARES
const authenticate = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/isAdmin");

//RUTAS PUBLICAS (sin auth)
router.get("/active", obtenerProductosActivos);
router.get("/categories", obtenerCategorias);
router.get("/brands", obtenerMarcas);
router.get("/", obtenerProductos);
router.get("/:id", obtenerProducto);

//RUTAS PRIVADAS ADMIN
router.post("/", authenticate, isAdmin, crearProducto);
router.put("/:id", authenticate, isAdmin, actualizarProducto);
router.delete("/:id", authenticate, isAdmin, eliminarProducto);
router.post("/:id/reactivate", authenticate, isAdmin, reactivarProducto);
router.get(
    "/inactiveProducts",
    authenticate,
    isAdmin,
    obtenerProductosInactivos
);

module.exports = router;
