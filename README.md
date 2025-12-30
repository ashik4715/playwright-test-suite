# Playwright Test Suite - SQA Application

A full-stack application built for SQA testing purposes, featuring a NestJS backend with SQLite database, Vue 3 frontend with Tailwind CSS, and comprehensive Playwright test suite.

## Project Structure

```
playwright-test-suite/
├── backend/          # NestJS backend application
├── frontend/         # Vue 3 frontend application
├── tests/            # Playwright test suite
└── README.md
```

## Features

### Backend (NestJS)
- **Authentication**: JWT-based authentication with register and login endpoints
- **Blog CRUD**: Full CRUD operations for blog posts
- **Database**: SQLite with TypeORM
- **Security**: Password hashing with bcrypt, JWT tokens, authorization guards

### Frontend (Vue 3)
- **Authentication**: Login and registration with form validation
- **Blog Management**: Create, read, update, and delete blog posts
- **UI/UX**: Modern design with Tailwind CSS and smooth animations
- **State Management**: Pinia stores for auth and blog state
- **Routing**: Vue Router with protected routes

### Testing (Playwright)
- **Authentication Tests**: Registration, login, logout, error handling
- **Blog CRUD Tests**: Create, read, update, delete operations
- **Authorization Tests**: User permissions and access control

## Getting Started

### Prerequisites
- Node.js (v20.19+ or v22.12+)
- npm or yarn

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install Playwright and browsers:
```bash
npm install -D @playwright/test
npx playwright install chromium
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run start:dev
```
Backend will run on http://localhost:3000

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

### Running Tests

Run all Playwright tests:
```bash
npx playwright test
```

Run tests in UI mode:
```bash
npx playwright test --ui
```

View test report:
```bash
npx playwright show-report
```

### Building for Production

Build backend:
```bash
cd backend
npm run build
npm run start:prod
```

Build frontend:
```bash
cd frontend
npm run build
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Blog
- `GET /blog` - Get all blog posts
- `GET /blog/:id` - Get a single blog post
- `POST /blog` - Create a new blog post (protected)
- `PATCH /blog/:id` - Update a blog post (protected, owner only)
- `DELETE /blog/:id` - Delete a blog post (protected, owner only)

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `createdAt`

### Blogs Table
- `id` (Primary Key)
- `title`
- `content`
- `authorId` (Foreign Key to Users)
- `createdAt`
- `updatedAt`

## Technologies Used

- **Backend**: NestJS, TypeScript, TypeORM, SQLite, JWT, bcrypt
- **Frontend**: Vue 3, TypeScript, Vite, Tailwind CSS, Pinia, Vue Router
- **Testing**: Playwright
- **Database**: SQLite

## License

This project is for learning and testing purposes.
