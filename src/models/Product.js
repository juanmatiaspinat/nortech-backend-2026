const pool = require("../config/db");
const tabla = "public.producto";

exports.obtenerProductos = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM ${tabla} ORDER BY id ASC`
  );
  return rows;
};

exports.obtenerProducto = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM ${tabla} WHERE id = $1`,
    [id]
  );
  return rows[0];
};

exports.crearProducto = async ({
  nombre,
  imagen,
  idMarca,
  descripcion,
  precio_costo,
  precio_venta,
  stock,
  stock_min,
  idCategoria,
}) => {
  const { rows } = await pool.query(
    `
    INSERT INTO producto
    (
      nombre,
      imagen,
      "idMarca",
      descripcion,
      precio_costo,
      precio_venta,
      stock,
      stock_min,
      idcategoria,
      eliminado
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false)
    RETURNING *
    `,
    [
      nombre,
      imagen,
      idMarca,
      descripcion,
      precio_costo,
      precio_venta,
      stock,
      stock_min,
      idCategoria,
    ]
  );

  return rows[0];
};

exports.editarProducto = async (
  nombre,
  imagen,
  idMarca,
  descripcion,
  precio_costo,
  precio_venta,
  stock,
  stock_min,
  idCategoria,
  id
) => {
  const { rows } = await pool.query(
    `
    UPDATE producto
    SET
      nombre = $1,
      imagen = $2,
      "idMarca" = $3,
      descripcion = $4,
      precio_costo = $5,
      precio_venta = $6,
      stock = $7,
      stock_min = $8,
      idcategoria = $9
    WHERE id = $10
    RETURNING *
    `,
    [
      nombre,
      imagen,
      idMarca,
      descripcion,
      precio_costo,
      precio_venta,
      stock,
      stock_min,
      idCategoria,
      id,
    ]
  );

  return rows[0];
};

exports.eliminarProducto = async (id) => {
  const { rows } = await pool.query(
    `
    UPDATE ${tabla}
    SET eliminado = true
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );
  return rows[0];
};

exports.reactivarProducto = async (id) => {
  const { rows } = await pool.query(
    `
    UPDATE ${tabla}
    SET eliminado = false
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );
  return rows[0];
};

exports.obtenerProductosActivos = async () => {
  const { rows } = await pool.query(
    `
    SELECT * FROM ${tabla}
    WHERE eliminado = false
    ORDER BY id ASC
    `
  );
  return rows;
};

exports.obtenerProductosInactivos = async () => {
  const { rows } = await pool.query(
    `
    SELECT * FROM ${tabla}
    WHERE eliminado = true
    ORDER BY id ASC
    `
  );
  return rows;
};

exports.obtenerCategorias = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM categoria ORDER BY idcategoria ASC`
  );
  return rows;
};

exports.obtenerMarcas = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM marca ORDER BY "idMarca" ASC`
  );
  return rows;
};

exports.descontarStockProducto = async (
  idproducto,
  cantidad
) => {

  const { rows } = await pool.query(
    `
    UPDATE producto
    SET stock = stock - $1
    WHERE id = $2
    RETURNING *;
    `,
    [cantidad, idproducto]
  );

  return rows[0];
};
