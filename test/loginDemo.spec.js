import { test, expect } from '@playwright/test';
import fs from 'fs';

// Función para extraer usuarios del archivo SQL
function extractUsersFromSQL(sqlFile) {
    const sql = fs.readFileSync(sqlFile, 'utf8');
    const matches = sql.matchAll(/insert into MOCK_DATA.*values \((\d+), '([^']+)', '([^']+)', '([^']+)'\)/g);
    return Array.from(matches).map(match => ({
        id: match[1],
        name: match[2],
        email: match[3],
        password: match[4]
    }));
}

// Cargar todos los usuarios de prueba
const users = extractUsersFromSQL('MOCK_DATA.sql');

// Crear un test para cada usuario
for (const user of users) {
    test(`Login test for user ${user.name} (${user.email})`, async ({ page }) => {
        // Aumentar el timeout para la página completa
        test.setTimeout(30000);

        try {
            // Ir a la página de inicio
            await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
            
            // Esperar a que el formulario esté completamente cargado
            await page.waitForSelector('form', { state: 'visible', timeout: 5000 });

            // Llenar el formulario con retraso para simular entrada humana
            await page.locator('input[placeholder="nombre@ejemplo.com"]').fill(user.email);
            await page.waitForTimeout(100); // Pequeña pausa
            await page.locator('input[placeholder="Contraseña"]').fill(user.password);
            
            // Opcional: marcar "Recordarme"
            await page.getByLabel('Recordarme').click();
            
            // Hacer clic en el botón y esperar la navegación
            await Promise.all([
                page.waitForNavigation({ timeout: 10000 }), // Aumentar timeout de navegación
                page.getByRole('button', { name: 'Iniciar Sesión' }).click()
            ]);

            // Verificar que estamos en el dashboard
            await expect(page).toHaveURL('http://localhost:3000/dashboard.html', { timeout: 5000 });

            // Esperar a que el mensaje de bienvenida sea visible
            const welcomeMessage = await page.locator('#welcomeMessage');
            await expect(welcomeMessage).toBeVisible({ timeout: 5000 });
            await expect(welcomeMessage).toContainText(`Bienvenido, ${user.name}`);

            // Cerrar sesión
            const logoutButton = await page.getByRole('link', { name: ' Cerrar Sesión' });
            await expect(logoutButton).toBeVisible({ timeout: 5000 });
            
            await Promise.all([
                page.waitForNavigation({ timeout: 5000 }),
                logoutButton.click()
            ]);

            // Verificar que volvimos al login
            await expect(page).toHaveURL('http://localhost:3000/', { timeout: 5000 });

        } catch (error) {
            // Tomar screenshot en caso de error
            await page.screenshot({ path: `test-results/screenshots/error-${user.email}.png` });
            throw error;
        }
    });
}
