import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display login form by default', async ({ page }) => {
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should toggle to register form', async ({ page }) => {
    await page.getByRole('button', { name: 'Start a 14 day free trial' }).click();
    await expect(page.getByText('Create your account')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
  });

  test('should register a new user', async ({ page }) => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';

    // Switch to register mode
    await page.getByRole('button', { name: 'Start a 14 day free trial' }).click();

    // Fill registration form
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);

    // Submit form
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Wait for navigation and content
    await page.waitForURL('**/blog', { timeout: 10000 });
    await expect(page).toHaveURL('/blog');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(`Welcome, ${username}!`)).toBeVisible({ timeout: 5000 });
  });

  test('should login with existing user', async ({ page }) => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';

    // First, register a user
    await page.getByRole('button', { name: 'Start a 14 day free trial' }).click();
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page).toHaveURL('/blog');

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/auth');

    // Login
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait for navigation and content
    await page.waitForURL('**/blog', { timeout: 10000 });
    await expect(page).toHaveURL('/blog');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(`Welcome, ${username}!`)).toBeVisible({ timeout: 5000 });
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.getByPlaceholder('Enter your email').fill('invalid@example.com');
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should show error message
    await expect(page.getByText(/Invalid credentials|An error occurred/)).toBeVisible();
  });

  test('should prevent duplicate registration', async ({ page }) => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';

    // Register first time
    await page.getByRole('button', { name: 'Start a 14 day free trial' }).click();
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page).toHaveURL('/blog');

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/auth');

    // Try to register again with same email
    await page.getByRole('button', { name: 'Start a 14 day free trial' }).click();
    await page.getByPlaceholder('Enter your username').fill('anotheruser');
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Should show error
    await expect(page.getByText(/already exists|An error occurred/)).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';

    // Register and login
    await page.getByRole('button', { name: 'Start a 14 day free trial' }).click();
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page).toHaveURL('/blog');

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();

    // Should redirect to auth page
    await expect(page).toHaveURL('/auth');
  });
});

