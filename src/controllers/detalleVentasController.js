const pool = require("../config/db");
const tabla = "ventaDetalle";

exports.crearDetalleVenta = async ({ idventa, idproducto, cantidad, subtotal }) => {
  const query = `
    INSERT INTO ${tabla} (idventa, idproducto, cantidad, subtotal, eliminado)
    VALUES ($1, $2, $3, $4, FALSE)
    RETURNING *;
  `;
  const values = [idventa, idproducto, cantidad, subtotal];
  const { rows } = await pool.query(query, values);
  return rows[0];
};
