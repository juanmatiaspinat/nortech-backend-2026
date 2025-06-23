const { crearVenta, generarNumeroVenta, obtenerHistorialVentasPorUsuario } = require("../models/VentasModel");
const { getUsuarioByAuthId } = require("../models/User");
const { crearDetalleVenta } = require("../models/DetalleVentasModel");

exports.createVenta = async (req, res, next) => {
    const auth_id = req.user.id;

    // ✅ NUEVO: obtén el id interno entero
    const usuario = await getUsuarioByAuthId(auth_id);
    if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado en base local." });
    }

    const local_user_id = usuario.id; // ahora es INTEGER

    const {
        idcliente,
        idtipofactura,
        numero_venta,
        productos
    } = req.body;

    try {
        if (!productos || productos.length === 0) {
            return res.status(400).json({ error: "Debes incluir productos en la venta." });
        }

        const total_venta = productos.reduce((acc, p) => acc + p.subtotal, 0);
        const numero_venta = await generarNumeroVenta();
        const venta = await crearVenta({
            idusuario: local_user_id, // 👈 usa entero correcto
            idcliente,
            idtipofactura,
            fecha_venta: new Date(),
            total_venta,
            numero_venta
        });
        const detalles = []; 
        for (const p of productos) {
            const detalle = await crearDetalleVenta({
                idventa: venta.idventa,
                idproducto: p.idproducto,
                cantidad: p.cantidad,
                subtotal: p.subtotal
            });
            detalles.push(detalle);
        }

        res.status(201).json({
            message: "Venta creada exitosamente",
            venta,
            detalles
        });

    } catch (error) {
        next(error);
    }
};

exports.getHistorialPorUsuario = async (req, res, next) => {
  const { idusuario } = req.params;

  try {
    const historial = await obtenerHistorialVentasPorUsuario(idusuario);

    if (historial.length === 0) {
      return res.status(404).json({
        message: "No se encontraron ventas para este usuario."
      });
    }

    res.status(200).json({
      message: "Historial de ventas del usuario.",
      historial
    });

  } catch (error) {
    next(error);
  }
};