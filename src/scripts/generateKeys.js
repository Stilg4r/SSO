// scripts/rototeKeys.js
// Genera un par de claves pública y privada y las guarda en archivos PEM
// para ser utilizadas para gerara tokens PASETO
// Con caducidad de 1 mes y se deben rotar cada mes

import { generateKeyPairSync } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../core/infrastructure/storage/keys');
const KEY_EXPIRATION_DAYS = 30;

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
}

const publicKeyPath = path.join(basePath, 'public.pem');
const privateKeyPath = path.join(basePath, 'private.pem');
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

function backupOldKeys() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.renameSync(publicKeyPath, `${publicKeyPath}.${timestamp}`);
    fs.renameSync(privateKeyPath, `${privateKeyPath}.${timestamp}`);
    logEvent('LLaves antiguas respaldadas');
}

function generateKeys() {
    const { publicKey, privateKey } = generateKeyPairSync('ec', {
        namedCurve: 'P-384',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const metadata = {
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * KEY_EXPIRATION_DAYS).toISOString(),
    };

    fs.writeFileSync(publicKeyPath, publicKey);
    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    logEvent('Llaves generadas correctamente');
}

try {
    rotateLogs();
    console.log('Validando si las llaves han expirado...');
    if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        if (new Date(metadata.expiresAt) > new Date()) {
            console.log('Las llaves aún son válidas. No es necesario rotarlas.');
            process.exit(0);
        } else {
            console.log('LLaves expiradas. Generando nuevas llaves.');
            backupOldKeys();
        }
    } else {
        console.log('No se encontró metadata de llaves. Generando nuevas llaves.');
    }

    generateKeys();
    console.log('LLaves rotadas correctamente.');
} catch (error) {
    console.error('Error durante la rotación:', error);
    logEvent(`Error: ${error.message}`, 'ERROR');
}
