import colors from "colors";
import cors, { CorsOptions } from "cors";
import express from "express";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import db from "./config/db";
import swaggerSpec, { swaggerUIOptions } from "./config/swagger";
import router from "./router";

// Conectar a la base de datos
export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.magenta("Conexión exitosa a la base de datos"));
  } catch (error) {
    console.log(colors.red.bold("Hubo un error conectando a la base de datos"));
  }
}

connectDB();

// Instancia de express
const server = express();

// Permitir conexiones
const corsOptions : CorsOptions = {
  origin: function(origin, callback) {
    if(origin === process.env.FRONT_END_URL) {
     console.log(colors.green('Allowed by CORS'));
     callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

server.use(cors(corsOptions));

// Leer datos de formularios
server.use(express.json());

server.use(morgan('dev'))

server.use("/api/products", router);

// Docs
server.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUIOptions));

export default server;
