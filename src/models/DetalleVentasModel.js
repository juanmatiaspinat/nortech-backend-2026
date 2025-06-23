const pool = require("../config/db");
const tabla = "ventadetalle";

exports.crearDetalleVenta = async ({ idventa, idproducto, cantidad, subtotal }) => {
  const { rows } = await pool.query(
    `INSERT INTO ${tabla} (idventa, idproducto, cantidad, subtotal, eliminado)
     VALUES ($1, $2, $3, $4, FALSE)
     RETURNING *`,
    [idventa, idproducto, cantidad, subtotal]
  );
  return rows[0];
};
