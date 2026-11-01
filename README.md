# ReactStudentsGradesTable

Admin-only grades app. Admins sign up with an email (verified by a link), create classes, add students to each class, and email each student their grades.

The repo includes the server (`serverMySQL`), the React app (`reactApp`), the MySQL schema (`students`), and Playwright tests (`e2e-playwright`).

## Setup

1. Create the database and demo data:
   ```sh
   mysql -u root -p < students/schema.sql
   mysql -u root -p < students/seed.sql
   ```
   `schema.sql` drops and recreates the `admins`, `sessions`, `classes`, and `students` tables.
2. Copy `serverMySQL/.env.example` to `serverMySQL/.env` and fill it in:
   - `DB_*`: MySQL connection.
   - `RESEND_API_KEY`: from [resend.com](https://resend.com). If empty, emails (verification links, grades) are printed to the server console instead of sent.
   - `EMAIL_FROM`: a sender on a domain verified in Resend. `onboarding@resend.dev` only delivers to your own Resend account email.
   - `APP_URL`: where the React app runs, used in the verification link.
3. Run `npm install` and then `npm start` in `serverMySQL` and in `reactApp`.

Demo login: `admin@example.com` / `admin` (already verified).

## Data access

Every API route except sign up, verify, and login requires `Authorization: Bearer <token>`. The server resolves the token to the admin and filters every query by that admin's id, so an admin can only read or change their own classes and students. MySQL has no row level security, so this scoping is done in the API (`serverMySQL/middleware/requireAdmin.js`).
