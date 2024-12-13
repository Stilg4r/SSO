import cluster from "cluster";
import os from "os";

const cpuCount = os.cpus().length;

console.info(`The total number of CPUs is ${cpuCount}`);
console.info(`Primary pid=${process.pid}`);

if (cluster.isPrimary) {
  cluster.setupPrimary({
    exec: __dirname + "/index.js", // Ruta al archivo principal
  });

  // Crear un worker por cada núcleo disponible
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  // Manejar errores inesperados en el proceso principal
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });

  // Reiniciar cualquier worker que falle
  cluster.on("exit", (worker, code, signal) => {
    console.warn(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
    console.info("Starting another worker...");
    cluster.fork();
  });
} else {
  // Aquí correrá el código del worker (en `index.js`)
  import("./index.js");
}