const pool = require("../config/db");

const tabla = "detalle_venta";

exports.crearDetalleVenta = async ({
  idventa,
  idproducto,
  cantidad,
  subtotal,
}) => {
  const query = `
        INSERT INTO ${tabla}
        (
            id_venta,
            id_producto,
            cantidad,
            total
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

  const values = [idventa, idproducto, cantidad, subtotal];

  const { rows } = await pool.query(query, values);

  return rows[0];
};
