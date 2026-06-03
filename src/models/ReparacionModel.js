const pool = require("../config/db");

const tabla = "reparacion";

exports.crearReparacion = async ({
  id_usuario,
  id_producto,
  descripcion,
}) => {

  const query = `
    INSERT INTO ${tabla}
    (
      id_usuario,
      id_producto,
      descripcion
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [
    id_usuario,
    id_producto,
    descripcion,
  ];

  const { rows } =
    await pool.query(
      query,
      values
    );

  return rows[0];
};

exports.obtenerReparacionesUsuario =
  async (id_usuario) => {

    const query = `
      SELECT
        r.*,
        p.nombre AS producto_nombre,
        p.imagen AS producto_imagen
      FROM ${tabla} r
      JOIN producto p
      ON r.id_producto = p.id
      WHERE r.id_usuario = $1
      ORDER BY r.created_at DESC;
    `;

    const { rows } =
      await pool.query(
        query,
        [id_usuario]
      );

    return rows;
  };

exports.obtenerTodasReparaciones =
  async () => {

    const query = `
      SELECT
        r.*,
        p.nombre AS producto_nombre,
        p.imagen AS producto_imagen,
        u.nombre AS usuario_nombre,
        u.apellido AS usuario_apellido,
        u.email AS usuario_email
      FROM ${tabla} r
      JOIN producto p
      ON r.id_producto = p.id
      JOIN usuarios u
      ON r.id_usuario = u.id
      ORDER BY r.created_at DESC;
    `;

    const { rows } =
      await pool.query(query);

    return rows;
  };

exports.actualizarEstadoReparacion =
  async (
    id,
    estado
  ) => {

    const query = `
      UPDATE ${tabla}
      SET
        estado = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;

    const { rows } =
      await pool.query(
        query,
        [estado, id]
      );

    return rows[0];
  };

exports.actualizarDiagnostico =
  async (
    id,
    diagnostico,
    costo,
    tecnico
  ) => {

    const query = `
      UPDATE ${tabla}
      SET
        diagnostico = $1,
        costo = $2,
        tecnico = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *;
    `;

    const { rows } =
      await pool.query(
        query,
        [
          diagnostico,
          costo,
          tecnico,
          id
        ]
      );

    return rows[0];
  };
  