import { test, expect } from '@playwright/test';

// Caso de éxito original
test('login exitoso', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.locator('input[placeholder="nombre@ejemplo.com"]').fill('hantonin2k@newsvine.com'); //linea 99
    await page.locator('input[placeholder="Contraseña"]').fill('66."#YBXzqA@4=e1');
    await page.getByLabel('Recordarme').click();
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    await expect(page).toHaveURL('http://localhost:3000/dashboard.html');
});

// Caso: credenciales incorrectas
test('login con credenciales incorrectas', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.locator('input[placeholder="nombre@ejemplo.com"]').fill('usuario_incorrecto@email.com');
    await page.locator('input[placeholder="Contraseña"]').fill('contraseña_incorrecta');
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    
    // Verifica que aparezca un mensaje de error
    await expect(page.locator('.error-message')).toBeVisible();
    // Verifica que seguimos en la página de login
    await expect(page).toHaveURL('http://localhost:3000');
});

// Caso: email con formato inválido
test('login con email inválido', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.locator('input[placeholder="nombre@ejemplo.com"]').fill('email_invalido');
    await page.locator('input[placeholder="Contraseña"]').fill('iL1>2');
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    
    // Verifica la validación del formato de email
    await expect(page.locator('input[placeholder="nombre@ejemplo.com"]')).toHaveAttribute('aria-invalid', 'true');
});

// Caso: campos vacíos
test('login con campos vacíos', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    
    // Verifica que aparezcan mensajes de campos requeridos
    await expect(page.locator('input[placeholder="nombre@ejemplo.com"]')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('input[placeholder="Contraseña"]')).toHaveAttribute('aria-invalid', 'true');
});

// Caso: contraseña muy corta
test('login con contraseña muy corta', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.locator('input[placeholder="nombre@ejemplo.com"]').fill('dblanckley0@msn.com');
    await page.locator('input[placeholder="Contraseña"]').fill('123');
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    
    // Verifica mensaje de error de contraseña
    await expect(page.locator('input[placeholder="Contraseña"]')).toHaveAttribute('aria-invalid', 'true');
});


