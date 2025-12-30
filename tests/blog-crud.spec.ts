import { test, expect } from '@playwright/test';

test.describe('Blog CRUD Operations', () => {
  let user1Email: string;
  let user1Password: string;
  let user2Email: string;
  let user2Password: string;

  test.beforeEach(async ({ page }) => {
    const timestamp = Date.now();
    user1Email = `user1${timestamp}@example.com`;
    user1Password = 'password123';
    user2Email = `user2${timestamp}@example.com`;
    user2Password = 'password123';

    // Register and login as user1
    const baseURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    await page.goto(`${baseURL}/auth`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.getByRole('button', { name: 'Start a 14 day free trial' }).click();
    await page.getByPlaceholder('Enter your username').fill(`user1${timestamp}`);
    await page.getByPlaceholder('Enter your email').fill(user1Email);
    await page.getByPlaceholder('Enter your password').fill(user1Password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.waitForURL('**/blog', { timeout: 10000 });
    await expect(page).toHaveURL('/blog');
    await page.waitForLoadState('networkidle');
  });

  test('should create a new blog post', async ({ page }) => {
    const blogTitle = `Test Blog ${Date.now()}`;
    const blogContent = 'This is a test blog post content.';

    // Navigate to create blog page
    await page.getByRole('button', { name: '+ New Post' }).click();
    await expect(page).toHaveURL('/blog/create');

    // Fill form
    await page.getByPlaceholder('Enter blog title').fill(blogTitle);
    await page.getByPlaceholder('Write your blog content here...').fill(blogContent);

    // Submit
    await page.getByRole('button', { name: 'Create' }).click();

    // Should redirect to blog list
    await expect(page).toHaveURL('/blog');

    // Should see the new blog in the list
    await expect(page.getByText(blogTitle)).toBeVisible();
  });

  test('should read blog posts from list', async ({ page }) => {
    const blogTitle = `Test Blog ${Date.now()}`;
    const blogContent = 'This is a test blog post content.';

    // Create a blog
    await page.getByRole('button', { name: '+ New Post' }).click();
    await page.getByPlaceholder('Enter blog title').fill(blogTitle);
    await page.getByPlaceholder('Write your blog content here...').fill(blogContent);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page).toHaveURL('/blog');

    // Should see blog in list
    await expect(page.getByText(blogTitle)).toBeVisible();
  });

  test('should view blog detail', async ({ page }) => {
    const blogTitle = `Test Blog ${Date.now()}`;
    const blogContent = 'This is a detailed test blog post content.';

    // Create a blog
    await page.getByRole('button', { name: '+ New Post' }).click();
    await page.getByPlaceholder('Enter blog title').fill(blogTitle);
    await page.getByPlaceholder('Write your blog content here...').fill(blogContent);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page).toHaveURL('/blog');

    // Click on blog to view detail
    await page.getByRole('button', { name: 'Read More' }).first().click();

    // Should see full content
    await expect(page.getByText(blogTitle)).toBeVisible();
    await expect(page.getByText(blogContent)).toBeVisible();
  });

  test('should update own blog post', async ({ page }) => {
    const blogTitle = `Test Blog ${Date.now()}`;
    const blogContent = 'Original content.';
    const updatedTitle = `Updated Blog ${Date.now()}`;
    const updatedContent = 'Updated content.';

    // Create a blog
    await page.getByRole('button', { name: '+ New Post' }).click();
    await page.getByPlaceholder('Enter blog title').fill(blogTitle);
    await page.getByPlaceholder('Write your blog content here...').fill(blogContent);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page).toHaveURL('/blog');

    // View blog detail
    await page.getByRole('button', { name: 'Read More' }).first().click();

    // Click edit
    await page.getByRole('button', { name: 'Edit' }).click();

    // Update blog
    await page.getByPlaceholder('Enter blog title').clear();
    await page.getByPlaceholder('Enter blog title').fill(updatedTitle);
    await page.getByPlaceholder('Write your blog content here...').clear();
    await page.getByPlaceholder('Write your blog content here...').fill(updatedContent);
    await page.getByRole('button', { name: 'Update' }).click();

    // Should redirect to blog list
    await expect(page).toHaveURL('/blog');

    // Should see updated title
    await expect(page.getByText(updatedTitle)).toBeVisible();
  });

  test('should delete own blog post', async ({ page }) => {
    const blogTitle = `Test Blog ${Date.now()}`;
    const blogContent = 'Content to be deleted.';

    // Create a blog
    await page.getByRole('button', { name: '+ New Post' }).click();
    await page.getByPlaceholder('Enter blog title').fill(blogTitle);
    await page.getByPlaceholder('Write your blog content here...').fill(blogContent);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page).toHaveURL('/blog');

    // View blog detail
    await page.getByRole('button', { name: 'Read More' }).first().click();

    // Delete blog
    page.on('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Delete' }).click();

    // Should redirect to blog list
    await expect(page).toHaveURL('/blog');

    // Blog should not be visible
    await expect(page.getByText(blogTitle)).not.toBeVisible();
  });

  test('should not allow editing other users blog posts', async ({ page, context }) => {
    const blogTitle = `User1 Blog ${Date.now()}`;
    const blogContent = 'User1 content.';

    // Create a blog as user1
    await page.getByRole('button', { name: '+ New Post' }).click();
    await page.getByPlaceholder('Enter blog title').fill(blogTitle);
    await page.getByPlaceholder('Write your blog content here...').fill(blogContent);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page).toHaveURL('/blog');

    // Get blog ID from URL
    await page.getByRole('button', { name: 'Read More' }).first().click();
    const currentUrl = page.url();
    const blogId = currentUrl.split('/').pop();

    // Logout user1
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/auth');

    // Register and login as user2
    const timestamp = Date.now();
    await page.getByRole('button', { name: 'Start a 14 day free trial' }).click();
    await page.getByPlaceholder('Enter your username').fill(`user2${timestamp}`);
    await page.getByPlaceholder('Enter your email').fill(user2Email);
    await page.getByPlaceholder('Enter your password').fill(user2Password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page).toHaveURL('/blog');

    // Try to access edit page directly
    await page.goto(`${baseURL}/blog/${blogId}/edit`, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Should redirect to blog list or show error (user2 cannot edit user1's blog)
    // The backend should prevent this, but if frontend allows, we check that edit button is not visible
    await page.goto(`${baseURL}/blog/${blogId}`, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Edit and Delete buttons should not be visible for other user's blog
    await expect(page.getByRole('button', { name: 'Edit' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible();
  });

  test('should display all blogs from different users', async ({ page, context }) => {
    const blogTitle1 = `User1 Blog ${Date.now()}`;
    const blogContent1 = 'User1 content.';

    // Create a blog as user1
    await page.getByRole('button', { name: '+ New Post' }).click();
    await page.getByPlaceholder('Enter blog title').fill(blogTitle1);
    await page.getByPlaceholder('Write your blog content here...').fill(blogContent1);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page).toHaveURL('/blog');

    // Logout user1
    await page.getByRole('button', { name: 'Logout' }).click();

    // Register and login as user2
    const timestamp = Date.now();
    await page.getByRole('button', { name: 'Start a 14 day free trial' }).click();
    await page.getByPlaceholder('Enter your username').fill(`user2${timestamp}`);
    await page.getByPlaceholder('Enter your email').fill(user2Email);
    await page.getByPlaceholder('Enter your password').fill(user2Password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page).toHaveURL('/blog');

    // Should see user1's blog in the list
    await expect(page.getByText(blogTitle1)).toBeVisible();
  });
});

