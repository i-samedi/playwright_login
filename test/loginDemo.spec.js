import { test, expect } from '@playwright/test';
import fs from 'fs';

// Función para extraer usuarios del archivo SQL
function extractUsersFromSQL(sqlFile) {
    const sql = fs.readFileSync(sqlFile, 'utf8');
    const matches = sql.matchAll(/insert into MOCK_DATA.*values \((\d+), '([^']+)', '([^']+)', '((?:[^']|'')+)'\)/g);
    return Array.from(matches).map(match => ({
        id: match[1],
        name: match[2],
        email: match[3],
        // Reemplazar comillas dobles dentro de la contraseña por comillas simples
        password: match[4].replace(/''/g, "'")
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
            await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
            
            await page.waitForSelector('form', { state: 'visible', timeout: 5000 });

            await page.locator('input[placeholder="nombre@ejemplo.com"]').fill(user.email);
            await page.waitForTimeout(100);
            await page.locator('input[placeholder="Contraseña"]').fill(user.password);
            
            await page.getByLabel('Recordarme').click();
            
            await Promise.all([
                page.waitForNavigation({ timeout: 10000 }), 
                page.getByRole('button', { name: 'Iniciar Sesión' }).click()
            ]);

            await expect(page).toHaveURL('http://localhost:3000/dashboard.html', { timeout: 5000 });

            const welcomeMessage = await page.locator('#welcomeMessage');
            
            await expect(welcomeMessage).toBeVisible({ timeout: 5000 });
            await expect(welcomeMessage).toContainText(`Bienvenido, ${user.name}`);

            const logoutButton = await page.getByRole('link', { name: ' Cerrar Sesión' });
            await expect(logoutButton).toBeVisible({ timeout: 5000 });
            
            await Promise.all([
                page.waitForNavigation({ timeout: 5000 }),
                logoutButton.click()
            ]);

            await expect(page).toHaveURL('http://localhost:3000/', { timeout: 5000 });

        } catch (error) {
            // Tomar screenshot en caso de error
            await page.screenshot({ path: `test-results/screenshots/error-${user.email}.png` });
            throw error;
        }
    });
}
