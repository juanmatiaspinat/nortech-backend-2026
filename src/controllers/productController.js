const {
    crearProducto,
    obtenerProductos,
    editarProducto,
    eliminarProducto,
    obtenerProducto,
    reactivarProducto,
    obtenerProductosActivos,
    obtenerProductosInactivos,
    obtenerCategorias,
    obtenerMarcas
} = require("../models/Product");

exports.obtenerProductos = async (req, res, next) => {
    try {
        const result = await obtenerProductos();
        res.status(200).json(result);
    } catch (error) {
        next(error); //PASA EL ERROR al manejador de errores (el middleware 'errorHandler')
    }
}

exports.obtenerProducto = async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await obtenerProducto(id);
        res.status(200).json(response);
    } catch (error) {
        next(error); //PASA EL ERROR al manejador de errores (el middleware 'errorHandler')
    }
}

exports.crearProducto = async (req, res, next) => {
    try {
        //VALIDACIONES básicas
        const { nombre, precio_costo, precio_venta, idMarca, stock, stock_min, imagen } = req.body;
        if (idMarca === undefined || idMarca === null) {
            return res.status(400).json({ error: 'El campo idMarca es requerido.' });
        }
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ error: 'El nombre del producto es requerido.' });
        }

        if (precio_costo <= 0 || precio_venta <= 0) {
            return res.status(400).json({ error: 'Los precios deben ser mayores que cero.' });
        }

        if (precio_venta < precio_costo) {
            return res.status(400).json({ error: 'El precio de venta no puede ser menor al precio de costo.' });
        }

        if (idMarca < 1) {
            return res.status(400).json({ error: 'El ID de marca no es válido.' });
        }

        if (stock < 0 || stock_min < 0) {
            return res.status(400).json({ error: 'Los valores de stock no pueden ser negativos.' });
        }

        if (!imagen || imagen.trim() === '') {
            return res.status(400).json({ error: 'La URL de la imagen es requerida.' });
        }

        //LLAMADA al modelo
        const producto = await crearProducto(req.body);
        res.status(201).json(producto);
    } catch (error) {
        next(error);
    }
};

exports.eliminarProducto = async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await eliminarProducto(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

exports.reactivarProducto = async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await reactivarProducto(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

exports.actualizarProducto = async (req, res, next) => {
    const { id } = req.params;
    const {
        nombre,
        imagen,
        idMarca,
        descripcion,
        precio_costo,
        precio_venta,
        stock,
        stock_min,
        idCategoria } = req.body;
    try {
        const response = await editarProducto(
            nombre,
            imagen,
            idMarca,
            descripcion,
            precio_costo,
            precio_venta,
            stock,
            stock_min,
            idCategoria,
            id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

exports.obtenerProductosActivos = async (req, res, next) => {
    try {
        const result = await obtenerProductosActivos();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

exports.obtenerProductosInactivos = async (req, res, next) => {
    try {
        const result = await obtenerProductosInactivos();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

exports.obtenerCategorias = async (req, res, next) => {
    try {
        const result = await obtenerCategorias();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

exports.obtenerMarcas = async (req, res, next) => {
    try {
        const result = await obtenerMarcas();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
