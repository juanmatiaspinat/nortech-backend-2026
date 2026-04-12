// Dependencias
require("dotenv").config(); // Permite acceder a las variables de entorno
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const setupSwaggerDocs = require("./docs/swagger");
const PORT = process.env.DB_PORT || 3000;

// Rutas
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const ventasRoutes = require("./routes/ventasRoutes");

// Inicializaciones
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas API
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/ventas", ventasRoutes);

// Swagger
setupSwaggerDocs(app);

// Middleware de errores (siempre al final)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
