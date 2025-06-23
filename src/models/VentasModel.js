const pool = require("../config/db");
const tabla = "ventacabecera";
const tablaDetalle = "ventadetalle";
const tablaUsuarios = "usuarios";
const tablaProducto = "producto";
exports.crearVenta = async ({ idusuario, idcliente, idtipoFactura, fecha_venta, total_venta, numero_venta }) => {
    const query = `
    INSERT INTO ${tabla} 
    (idusuario, idcliente, idtipoFactura, fecha_venta, total_venta, numero_venta, eliminado)
    VALUES ($1, $2, $3, $4, $5, $6, FALSE)
    RETURNING *;
  `;
    const values = [idusuario, idcliente, idtipoFactura, fecha_venta, total_venta, numero_venta];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

exports.generarNumeroVenta = async () => {
  // Busca el último numero_venta y saca el número final
  const { rows } = await pool.query(`
    SELECT numero_venta 
    FROM ${tabla} 
    ORDER BY idventa DESC 
    LIMIT 1;
  `);

  let nuevoNumero = 1;
  if (rows.length > 0 && rows[0].numero_venta) {
    // Extrae el número quitando la letra inicial
    const ultimo = parseInt(rows[0].numero_venta.slice(1));
    nuevoNumero = ultimo + 1;
  }

  // Devuelve como string formateado: V00001
  return `V${nuevoNumero.toString().padStart(5, "0")}`;
};


exports.obtenerHistorialVentasPorUsuario = async (idusuario) => {
  const { rows } = await pool.query(
    `
    SELECT 
      vc.idventa,
      vc.numero_venta,
      vc.fecha_venta,
      vc.total_venta,
      u.nombre AS nombre_usuario,
      vd.iddetalle,
      p.nombre AS nombre_producto,
      vd.cantidad,
      vd.subtotal
    FROM ${tabla} vc
    JOIN ${tablaUsuarios} u ON vc.idusuario = u.id
    JOIN ${tablaDetalle} vd ON vc.idventa = vd.idventa
    JOIN ${tablaProducto} p ON vd.idproducto = p.id
    WHERE vc.idusuario = $1
    ORDER BY vc.fecha_venta DESC, vc.idventa, vd.iddetalle;
    `,
    [idusuario]
  );
  return rows;
};