const {
  crearVenta,
  obtenerHistorialVentasPorUsuario,
} = require("../models/VentasModel");

const { getUsuarioByAuthId } = require("../models/User");

const {
  crearDetalleVenta,
} = require("../models/DetalleVentasModel");

const {
  descontarStockProducto,
} = require("../models/Product");

exports.createVenta = async (req, res, next) => {

  try {

    const auth_id = req.user.id;

    //BUSCA usuario local por 'UUID' en Supabase
    const usuario =
      await getUsuarioByAuthId(auth_id);

    if (!usuario) {

      return res.status(404).json({
        error:
          "Usuario no encontrado en base local.",
      });
    }

    const local_user_id = usuario.id;

    const { productos } = req.body;

    if (!productos || productos.length === 0) {

      return res.status(400).json({
        error:
          "Debes incluir productos en la venta.",
      });
    }

    //TOTAL REAL
    const total = productos.reduce(
      (acc, p) => acc + p.subtotal,
      0
    );

    //CREA VENTA
    const venta = await crearVenta({
      idusuario: local_user_id,
      total,
      estado: "Pagado",
    });

    //CREA DETALLES
    const detalles = [];

    for (const p of productos) {

      const detalle =
        await crearDetalleVenta({

          idventa: venta.id,

          idproducto: p.idproducto,

          descripcion: p.descripcion,

          precio_venta: p.precio_venta,

          cantidad: p.cantidad,

          subtotal: p.subtotal,
        });

      detalles.push(detalle);

      //DESCUENTA STOCK
      await descontarStockProducto(
        p.idproducto,
        p.cantidad
      );
    }

    return res.status(201).json({
      message:
        "Venta creada exitosamente.",
      venta,
      detalles,
    });

  } catch (error) {

    console.log(
      "ERROR CREATE VENTA:",
      error
    );

    next(error);
  }
};

exports.getHistorialPorUsuario =
  async (req, res, next) => {

    try {

      const auth_id = req.user.id;

      const usuario = await getUsuarioByAuthId(auth_id);

      if (!usuario) {
        return res.status(404).json({
          error: "Usuario no encontrado.",
        });
      }

      const idusuario = usuario.id;

      const historial =
        await obtenerHistorialVentasPorUsuario(
          idusuario
        );

      return res.status(200).json({
        message:
          "Historial de ventas del usuario.",
        historial,
      });

    } catch (error) {

      console.log(
        "ERROR HISTORIAL:",
        error
      );

      next(error);
    }
  };
