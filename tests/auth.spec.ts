import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('should display login form by default', async ({ page }) => {
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should toggle to register form', async ({ page }) => {
    await page.getByText("Don't have an account? Sign up").click();
    await expect(page.getByText('Create Account')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });

  test('should register a new user', async ({ page }) => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';

    // Switch to register mode
    await page.getByText("Don't have an account? Sign up").click();

    // Fill registration form
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);

    // Submit form
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Should redirect to blog list
    await expect(page).toHaveURL('/blog');
    await expect(page.getByText(`Welcome, ${username}!`)).toBeVisible();
  });

  test('should login with existing user', async ({ page }) => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';

    // First, register a user
    await page.getByText("Don't have an account? Sign up").click();
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL('/blog');

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/auth');

    // Login
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should redirect to blog list
    await expect(page).toHaveURL('/blog');
    await expect(page.getByText(`Welcome, ${username}!`)).toBeVisible();
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.getByPlaceholder('Enter your email').fill('invalid@example.com');
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should show error message
    await expect(page.getByText(/Invalid credentials|An error occurred/)).toBeVisible();
  });

  test('should prevent duplicate registration', async ({ page }) => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';

    // Register first time
    await page.getByText("Don't have an account? Sign up").click();
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL('/blog');

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/auth');

    // Try to register again with same email
    await page.getByText("Don't have an account? Sign up").click();
    await page.getByPlaceholder('Enter your username').fill('anotheruser');
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Should show error
    await expect(page.getByText(/already exists|An error occurred/)).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';

    // Register and login
    await page.getByText("Don't have an account? Sign up").click();
    await page.getByPlaceholder('Enter your username').fill(username);
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL('/blog');

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();

    // Should redirect to auth page
    await expect(page).toHaveURL('/auth');
  });
});

