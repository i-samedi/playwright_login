const { chromium } = require('@playwright/test');
const express = require('express');
const path = require('path');

async function serveReport() {
    const app = express();
    const port = 9323;

    // Servir los archivos estáticos del reporte
    app.use(express.static(path.join(__dirname, '../playwright-report')));

    // Ruta principal que sirve el reporte
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../playwright-report/index.html'));
    });

    // Iniciar el servidor
    app.listen(port, () => {
        console.log(`Reporte disponible en http://localhost:${port}`);
        console.log('Presiona Ctrl+C para detener el servidor');
    });
}

// Ejecutar el servidor
serveReport().catch(console.error); 