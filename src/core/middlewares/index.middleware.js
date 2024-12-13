import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { ENVIRONMENT } from '../../../env.cjs';

const mainMiddlewares = (app) => {
    // Configuración de Express
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Middleware para servir archivos estáticos
    app.use(express.static('public'));

    // Seguridad
    app.use(hpp());       // Protección contra ataques de polución de parámetros HTTP
    app.use(helmet());    // Configuración de encabezados HTTP seguros
    app.use(cors());      // Habilitar CORS en la aplicación
    app.disable('x-powered-by'); // Oculta información del servidor


    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, // Máximo de solicitudes por IP
    });
    app.use(limiter);

    // Logs de solicitudes
    if (ENVIRONMENT === 'development') {






        app.use((req, res, next) => {

            const vervoseLog = (json) => {
                console.info(json);
            };

            console.info('💬>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            const { query, params, body } = req;
            vervoseLog({ query, params, body });



            next();
        });

















        app.use(morgan('dev')); // Verboso en desarrollo
    } else {
        app.use(morgan('tiny')); // Compacto en producción
    }





};

export default mainMiddlewares;