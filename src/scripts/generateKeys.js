// scripts/rotateKeys.js
// Genera una clave simétrica de 32 bytes y la guarda en un archivo
// para ser utilizada para generar tokens PASETO
// Con caducidad de 1 mes y se deben rotar cada mes

import { randomBytes } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../storage/keys');

const KEY_EXPIRATION_DAYS = 30;

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
}

const symmetricKeyPath = path.join(basePath, 'symmetric.key');
const metadataPath = path.join(basePath, 'metadata.json');
const eventsLogPath = path.join(basePath, 'events.log');

function logEvent(event, severity = 'INFO') {
    const logEntry = {
        severity,
        event,
        timestamp: new Date().toISOString(),
    };
    console[severity === 'ERROR' ? 'error' : 'log'](logEntry);
    fs.appendFileSync(eventsLogPath, JSON.stringify(logEntry) + '\n');
}

function rotateLogs() {
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (fs.existsSync(eventsLogPath) && fs.statSync(eventsLogPath).size > maxSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        fs.renameSync(eventsLogPath, `${eventsLogPath}.${timestamp}`);
    }
}

function backupOldKey() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.renameSync(symmetricKeyPath, `${symmetricKeyPath}.${timestamp}`);
    logEvent('Clave antigua respaldada');
}

function generateSymmetricKey() {
    const symmetricKey = randomBytes(32); // Genera una clave de 32 bytes
    const metadata = {
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * KEY_EXPIRATION_DAYS).toISOString(),
    };

    fs.writeFileSync(symmetricKeyPath, symmetricKey);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    logEvent('Clave simétrica generada correctamente en ' + symmetricKeyPath);
}

try {
    rotateLogs();
    console.log('Validando si la clave ha expirado...');
    if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        if (new Date(metadata.expiresAt) > new Date()) {
            console.log('La clave aún es válida. No es necesario rotarla.');
            process.exit(0);
        } else {
            console.log('Clave expirada. Generando nueva clave.');
            backupOldKey();
        }
    } else {
        console.log('No se encontró metadata de la clave. Generando nueva clave.');
    }

    generateSymmetricKey();
    console.log('Clave rotada correctamente.');
} catch (error) {
    console.error('Error durante la rotación:', error);
    logEvent(`Error: ${error.message}`, 'ERROR');
}
