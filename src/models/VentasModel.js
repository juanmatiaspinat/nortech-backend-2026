const pool = require("../config/db");

const tabla = "venta";

exports.crearVenta = async ({
  idusuario,
  total,
  estado
}) => {

  const query = `
    INSERT INTO ${tabla}
    (id_usuario, total, estado)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [
    idusuario,
    total,
    estado
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

exports.obtenerHistorialVentasPorUsuario = async (idusuario) => {

  const query = `
    SELECT *
    FROM ${tabla}
    WHERE id_usuario = $1
    ORDER BY created_at DESC;
  `;

  const { rows } = await pool.query(query, [idusuario]);

  return rows;
};
