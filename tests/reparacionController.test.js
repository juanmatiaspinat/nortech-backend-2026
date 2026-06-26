const {
  crearReparacion,
  actualizarDiagnostico,
} = require("../src/models/ReparacionModel");

const {
  crearReparacion,
  actualizarDiagnostico,
} = require("../src/controllers/reparacionController");

const { obtenerUsuarioPorAuthId } = require("../src/models/User");

jest.mock("../src/models/User", () => ({
  obtenerUsuarioPorAuthId: jest.fn(),
}));

jest.mock("../src/models/ReparacionModel", () => ({
  crearReparacion: jest.fn(),
  obtenerReparacionesUsuario: jest.fn(),
  obtenerReparaciones: jest.fn(),
  actualizarEstadoReparacion: jest.fn(),
  actualizarDiagnostico: jest.fn(),
}));

/* TESTS de 'crearReparacion' */

describe("crearReparacion", () => {
  //TEST 1 'crearReparacion()': Verificar que se registre correctamente una reparación con datos válidos.
  test("debe crear una reparacion correctamente", async () => {
    const req = {
      user: {
        id: "6",
      },
      body: {
        id_producto: 1,
        descripcion: "No carga, creo que se rompió el pin de carga.",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    obtenerUsuarioPorAuthId.mockResolvedValue({
      id: 1,
    });

    crearReparacion.mockResolvedValue({
      id: 1,
      descripcion: "No carga, creo que se rompió el pin de carga.",
    });

    await crearReparacion(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
  });

  //TEST 2 'crearReparacion()': Verificar que se rechacen solicitudes de reparación sin producto asociado.
  test("debe devolver error si no se selecciona producto", async () => {
    const req = {
      user: { id: "6" },
      body: {
        descripcion: "Se me cayó a la pileta y no prende mas.",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    obtenerUsuarioPorAuthId.mockResolvedValue({
      id: 1,
    });

    await crearReparacion(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  //TEST 3 'crearReparacion()': Verificar que se rechacen solicitudes de reparación sin descripción.
  test("debe devolver error si la descripcion esta vacia", async () => {
    const req = {
      user: { id: "5" },
      body: {
        id_producto: 2,
        descripcion: "",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    obtenerUsuarioPorAuthId.mockResolvedValue({
      id: 1,
    });

    await crearReparacion(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  //TEST 4 'crearReparacion()': Verificar que se valide la longitud mínima de la descripción (4 caracteres).
  test("debe devolver error si la descripción tiene menos de 4 caracteres", async () => {
    const req = {
      user: {
        id: "5",
      },
      body: {
        id_producto: 3,
        descripcion: "a",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    obtenerUsuarioPorAuthId.mockResolvedValue({
      id: 1,
    });

    await crearReparacion(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

/* TESTS de 'actualizarDiagnostico' */

describe("actualizarDiagnostico", () => {
  //TEST 1 'actualizarDiagnostico()': Validar que el sistema no permita guardar un diagnóstico cuando todos los campos obligatorios están vacíos.
  test("debe devolver error si no se selecciona diagnostico, costo y tecnico", async () => {
    const req = {
      params: {
        id: 1,
      },
      body: {
        diagnostico: "",
        costo: "",
        tecnico: "",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarDiagnostico(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      error: "Debe ingresar un diagnóstico y un costo y un técnico.",
    });
  });

  //TEST 2 'actualizarDiagnostico()': Validar que el sistema no permita guardar un diagnóstico cuando los campos costo y técnico están vacíos.
  test("debe devolver error si no se selecciona costo y tecnico", async () => {
    const req = {
      params: {
        id: 1,
      },
      body: {
        diagnostico: "Pin de carga dañado por desgaste y falso contacto.",
        costo: "",
        tecnico: "",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarDiagnostico(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      error: "Debe ingresar un costo y un técnico.",
    });
  });

  //TEST 3 'actualizarDiagnostico()': Validar que el sistema no permita guardar un diagnóstico cuando los campos diagnóstico y técnico están vacíos.
  test("debe devolver error si no se selecciona diagnostico y tecnico", async () => {
    const req = {
      params: {
        id: 1,
      },
      body: {
        diagnostico: "",
        costo: 18000,
        tecnico: "",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarDiagnostico(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      error: "Debe ingresar un diagnóstico y un técnico.",
    });
  });

  //TEST 4 'actualizarDiagnostico()': Validar que el técnico sea obligatorio aunque se haya ingresado costo y diagnóstico.
  test("debe devolver error si no se selecciona tecnico", async () => {
    const req = {
      params: { id: 1 },
      body: {
        diagnostico:
          "Pantalla rota por impacto. Requiere reemplazo completo del módulo.",
        costo: 55000,
        tecnico: "",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarDiagnostico(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  //TEST 5 'actualizarDiagnostico()': Validar que el diagnóstico sea obligatorio aunque se haya ingresado costo y técnico.
  test("debe devolver error si el diagnóstico está vacío", async () => {
    const req = {
      params: { id: 1 },
      body: {
        diagnostico: "",
        costo: 20000,
        tecnico: "Tecnico 2",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarDiagnostico(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  //TEST 6 'actualizarDiagnostico()': Validar que el costo sea obligatorio aunque se haya ingresado diagnóstico y técnico.
  test("debe devolver error si no se selecciona costo", async () => {
    const req = {
      params: {
        id: 1,
      },
      body: {
        diagnostico:
          "Batería degradada con baja autonomía. Se recomienda reemplazo.",
        costo: "",
        tecnico: "Técnico 1",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarDiagnostico(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      error: "Debe ingresar un costo.",
    });
  });

  //TEST 7 'actualizarDiagnostico()': Validar el registro correcto de un diagnóstico con todos los datos obligatorios completos.
  test("debe actualizar un diagnostico correctamente", async () => {
    const req = {
      params: {
        id: 1,
      },
      body: {
        diagnostico: "Parlante inferior obstruido y con falla de sonido.",
        costo: 21000,
        tecnico: "Tecnico 3",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    actualizarDiagnostico.mockResolvedValue({
      id: 1,
      diagnostico: "Parlante inferior obstruido y con falla de sonido.",
      costo: 21000,
      tecnico: "Tecnico 1",
    });

    await actualizarDiagnostico(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
  });

  //TEST 8 'actualizarDiagnostico()': Validar que el sistema rechace valores negativos.
  test("debe devolver error si el costo es invalido", async () => {
    const req = {
      params: { id: 1 },
      body: {
        diagnostico:
          "Módulo de cámaras traseras defectuoso. No enfoca correctamente.",
        costo: -200,
        tecnico: "Tecnico 2",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarDiagnostico(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  //TEST 9 'actualizarDiagnostico()': Validar que el sistema rechace el valor cero.
  test("debe devolver error si el costo es cero", async () => {
    const req = {
      params: {
        id: 1,
      },
      body: {
        diagnostico:
          "Vidrios de cámaras traseras rotos. Afecta el funcionamiento de la cámara trasera.",
        costo: 0,
        tecnico: "Técnico 1",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarDiagnostico(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      error: "Debe ingresar un costo válido.",
    });
  });

  //TEST 10 'actualizarDiagnostico()': Validar que el diagnóstico cumpla con la longitud mínima requerida por el sistema (4 caracteres).
  test("debe devolver error si el diagnostico tiene menos de 4 caracteres", async () => {
    const req = {
      params: {
        id: 1,
      },
      body: {
        diagnostico: "a",
        costo: 18500,
        tecnico: "Técnico 2",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarDiagnostico(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      error: "Debe ingresar un diagnóstico de mínimo 4 caracteres.",
    });
  });
});
