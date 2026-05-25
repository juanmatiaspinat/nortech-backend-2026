const pool = require("../config/db");

const tabla = "detalle_venta";

exports.crearDetalleVenta = async ({
  idventa,
  idproducto,
  descripcion,
  precio_venta,
  cantidad,
  subtotal,
}) => {

  const query = `
    INSERT INTO ${tabla}
    (
      id_venta,
      id_producto,
      descripcion,
      precio_venta,
      cantidad,
      total
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    idventa,
    idproducto,
    descripcion,
    precio_venta,
    cantidad,
    subtotal,
  ];

  const { rows } =
    await pool.query(query, values);

  return rows[0];
};
