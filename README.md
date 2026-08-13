# GoGloria — Supabase Backend Connected

This is your original plain HTML/CSS/JavaScript GoGloria website with the charter request form connected to:

GoGloria HTML/JS → Node/Express Backend → Supabase → Excel

## 1. Supabase
Run `database/schema.sql` in the Supabase SQL Editor.

Create the `charter_requests` table with:
id, name, email, phone, yacht, date, message, status, created_at.

## 2. Backend
Install Node.js, open a terminal in `backend`, then:

    npm install

Copy `.env.example` to `.env` and fill in:

    SUPABASE_URL=...
    SUPABASE_SECRET_KEY=...

Never put the secret key in `frontend` or `script.js`.

Create the Excel file:

    npm run create-excel

Start the backend:

    npm start

The API will run at:

    http://localhost:3000

Health check:

    http://localhost:3000/api/health

## 3. Frontend
The original GoGloria `index.html`, `style.css`, and `script.js` are retained at the project root.

`script.js` now sends charter requests to:

    http://localhost:3000/api/charter-requests

No Supabase credentials are stored in the frontend.

## 4. Testing
1. Start the backend with `npm start`.
2. Open `index.html` in the browser.
3. Go to Charter Request.
4. Submit a test request.
5. Verify it in Supabase → Table Editor → `charter_requests`.
6. Verify it in `excel/GoGloria_Charter_Requests.xlsx`.

If you open the HTML directly with `file://`, CORS behavior can vary by browser. If needed, serve the root folder with a simple local static server. The backend itself remains on port 3000.

## Production architecture

GoGloria website → hosted Backend API → Supabase PostgreSQL → Excel/OneDrive synchronization.

For production, replace the local ExcelJS file with Microsoft Graph/OneDrive if the Excel workbook must be shared online by your team.
