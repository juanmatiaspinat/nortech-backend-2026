const {
    crearReparacion,
    obtenerReparacionesUsuario,
    obtenerTodasReparaciones,
    actualizarEstadoReparacion,
    actualizarDiagnostico,
} = require("../models/ReparacionModel");

const { getUsuarioByAuthId } = require("../models/User");

exports.createReparacion = async (req, res, next) => {
    try {
        const auth_id = req.user.id;

        const usuario = await getUsuarioByAuthId(auth_id);

        if (!usuario) {
            return res.status(404).json({
                error: "Usuario no encontrado",
            });
        }

        const { id_producto, descripcion } = req.body;

        const reparacion = await crearReparacion({
            id_usuario: usuario.id,
            id_producto,
            descripcion,
        });

        res.status(201).json({
            message: "Reparacion creada exitosamente",
            reparacion,
        });
    } catch (error) {
        console.log("ERROR CREATE REPARACION:", error);

        next(error);
    }
};

exports.getReparacionesUsuario = async (req, res, next) => {
    try {
        const auth_id = req.user.id;

        const usuario = await getUsuarioByAuthId(auth_id);

        if (!usuario) {
            return res.status(404).json({
                error: "Usuario no encontrado",
            });
        }

        const reparaciones = await obtenerReparacionesUsuario(usuario.id);

        res.status(200).json({
            reparaciones,
        });
    } catch (error) {
        console.log("ERROR GET REPARACIONES:", error);

        next(error);
    }
};

exports.getTodasReparaciones = async (req, res, next) => {
    try {
        const reparaciones = await obtenerTodasReparaciones();

        res.status(200).json({
            reparaciones,
        });
    } catch (error) {
        console.log("ERROR GET ALL REPARACIONES:", error);

        next(error);
    }
};

exports.updateEstadoReparacion = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { estado } = req.body;

        const reparacion = await actualizarEstadoReparacion(id, estado);

        res.status(200).json({
            message: "Estado actualizado",
            reparacion,
        });
    } catch (error) {
        console.log("ERROR UPDATE ESTADO:", error);

        next(error);
    }
};

exports.updateDiagnostico = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { diagnostico, costo, tecnico } = req.body;

        const reparacion = await actualizarDiagnostico(
            id,
            diagnostico,
            costo,
            tecnico,
        );

        res.status(200).json({
            message: "Diagnostico actualizado",
            reparacion,
        });
    } catch (error) {
        console.log("ERROR UPDATE DIAGNOSTICO:", error);

        next(error);
    }
};
