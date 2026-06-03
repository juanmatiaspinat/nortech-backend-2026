require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const setupSwaggerDocs = require("./docs/swagger");
const PORT = process.env.DB_PORT || 3000;

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const ventasRoutes = require("./routes/ventasRoutes");
const reparacionRoutes = require("./routes/reparacionRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/ventas", ventasRoutes);
app.use("/reparaciones", reparacionRoutes);

setupSwaggerDocs(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
