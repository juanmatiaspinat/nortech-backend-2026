const express = require("express");
const router = express.Router();

//CONTROLADORES
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    reactivateProduct,
    getActiveProducts,
    getInactiveProducts,
    getCategories,
    getBrands,
} = require("../controllers/productController");

//MIDDLEWARES
const authenticate = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/isAdmin");

//RUTAS PUBLICAS (sin auth)
router.get("/active", getActiveProducts);
router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.get("/", getProducts);
router.get("/:id", getProduct);

//RUTAS PRIVADAS ADMIN
router.post("/", authenticate, isAdmin, createProduct);
router.put("/:id", authenticate, isAdmin, updateProduct);
router.delete("/:id", authenticate, isAdmin, deleteProduct);
router.post("/:id/reactivate", authenticate, isAdmin, reactivateProduct);
router.get(
    "/inactiveProducts",
    authenticate,
    isAdmin,
    getInactiveProducts
);

module.exports = router;
