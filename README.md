# Playwright | Demo Login Test
## Instalación
# Puertos requeridos
- 3000 - Servidor web
- 5432 - PostgreSQL
- 9323 - Reporte de pruebas

### Primero, instala las dependencias de Node.js:
- npm install express pg cors
- npm install -D @playwright/test @types/node

### Instala Playwright y sus dependencias:
- npx playwright install
- npx playwright install-deps

### Ejecuta el servidor web:
- node server.js

### Ejecuta las pruebas:
- npx playwright test loginDemo.spec.js --project chromium --headed --ui 