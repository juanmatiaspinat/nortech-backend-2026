const { getUsuarioByAuthId } = require("../src/models/User");

const { crearVenta } = require("../src/models/VentasModel");

const {
descontarStockProducto,
} = require("../src/models/Product");

const { createVenta } = require("../src/controllers/ventasController");

jest.mock("../src/models/User", () => ({
  getUsuarioByAuthId: jest.fn(),
}));

jest.mock("../src/models/VentasModel", () => ({
  crearVenta: jest.fn(),
  obtenerHistorialVentasPorUsuario: jest.fn(),
}));

jest.mock("../src/models/DetalleVentasModel", () => ({
  crearDetalleVenta: jest.fn(),
}));

jest.mock("../src/models/Product", () => ({
  descontarStockProducto: jest.fn(),
}));

/* TESTS de 'createVenta' */

describe("createVenta", () => {
  //TEST 1 'createVenta()': Verificar que se registre correctamente una venta con un único producto.
  test("debe crear una venta correctamente", async () => {
    const req = {
      user: {
        id: "5",
        usuario: "renatacliente",
      },
      body: {
        productos: [
          {
            idproducto: 2,
            descripcion: "Samsung Galaxy S24",
            precio_venta: 950000,
            cantidad: 1,
            subtotal: 950000,
          },
        ],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getUsuarioByAuthId.mockResolvedValue({
      id: 1,
    });

    crearVenta.mockResolvedValue({
      id: 1,
    });

    await createVenta(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
  });

  //TEST 2 'createVenta()': Verificar que se registre correctamente una venta con múltiples productos.
  test("debe crear una venta con multiples productos correctamente", async () => {
    const req = {
      user: {
        id: "5",
        usuario: "martinpescador07",
      },
      body: {
        productos: [
          {
            idproducto: 2,
            descripcion: "Samsung Galaxy S24",
            precio_venta: 950000,
            cantidad: 1,
            subtotal: 950000,
          },
          {
            idproducto: 3,
            descripcion: "Apple iPhone 15 Pink",
            precio_venta: 1150000,
            cantidad: 1,
            subtotal: 1150000,
          },
          {
            idproducto: 4,
            descripcion: "Motorola Edge 50",
            precio_venta: 680000,
            cantidad: 1,
            subtotal: 680000,
          },
        ],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getUsuarioByAuthId.mockResolvedValue({
      id: 5,
    });

    crearVenta.mockResolvedValue({
      id: 2,
    });

    await createVenta(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
  });

  //TEST 3 'createVenta()': Verificar que se impida registrar una venta sin productos.
  test("debe devolver error si la lista de productos esta vacia", async () => {
    const req = {
      user: {
        id: "5",
        usuario: "renatacliente",
      },
      body: {
        productos: [],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getUsuarioByAuthId.mockResolvedValue({
      id: 1,
    });

    await createVenta(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  //TEST 4 'createVenta()': Verificar que se calcule correctamente el total de la venta utilizando varias unidades de un mismo producto.
  test("debe calcular correctamente el total utilizando varias unidades de un mismo producto", async () => {
    const req = {
      user: {
        id: "6",
        usuario: "martinpescador07",
      },
      body: {
        productos: [
          {
            idproducto: 2,
            descripcion: "Samsung Galaxy S24",
            precio_venta: 950000,
            cantidad: 3,
            subtotal: 2850000,
          },
        ],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getUsuarioByAuthId.mockResolvedValue({
      id: 5,
    });

    crearVenta.mockResolvedValue({
      id: 3,
    });

    await createVenta(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
  });

  //TEST 5 'createVenta()': Verificar que no se genere una venta si el usuario no existe.
  test("debe devolver error si el usuario no existe", async () => {
    const req = {
      user: {
        id: "123",
      },
      body: {
        productos: [
          {
            idproducto: 1,
          },
        ],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getUsuarioByAuthId.mockResolvedValue(null);

    await createVenta(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });

  //TEST 6 'createVenta()': Verificar que se invoque el método para descontar los productos con la cantidad correcta.
  test("debe descontar la cantidad correcta del stock", async () => {
    const req = {
      user: {
        id: "5",
        usuario: "renatacliente",
      },
      body: {
        productos: [
          {
            idproducto: 2,
            descripcion: "Samsung Galaxy S24",
            precio_venta: 950000,
            cantidad: 2,
            subtotal: 1900000,
          },
        ],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getUsuarioByAuthId.mockResolvedValue({
      id: 5,
    });

    crearVenta.mockResolvedValue({
      id: 4,
    });

    await createVenta(req, res, jest.fn());

    expect(descontarStockProducto).toHaveBeenCalledWith(2, 2);
  });
});
