require("dotenv").config();
const routes = require("./routes/routes");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for mgvbank",
    version: "1.0.0",
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use("/api", routes);

app.listen(3001, () => {
  console.log(`Server Started at ${3001}`);
});
