# GymFlow - Gym Management SaaS

This project has been migrated from a Node.js-only setup to a robust **PHP Laravel** backend.

## Tech Stack
- **Backend**: Laravel 12 (PHP 8.2)
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **Database**: SQLite

## Getting Started

### Prerequisites
- PHP 8.2+
- Composer
- Node.js & npm

### Installation
1. Clone the repository.
2. Run `composer install`.
3. Run `npm install`.
4. Create a `.env` file from `.env.example`.
5. Run `php artisan key:generate`.
6. Run `php artisan migrate`.

### Running Locally
1. Start the Laravel server:
   ```bash
   php artisan serve
   ```
2. Start the Vite dev server (for frontend changes):
   ```bash
   npm run dev
   ```

3. Access the app at `http://127.0.0.1:8000`.

## Scripts
- `npm run build`: Build production assets.
- `php artisan serve`: Start the PHP development server.
