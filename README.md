# Charity Events Website — PROG2002 Assignment 2

A dynamic website to manage charity events in the Gold Coast / Brisbane region.
Built with Node.js, Express, MySQL, HTML/CSS, and vanilla JavaScript.

---

## Project Structure

```
charity-events-website/
├── database/
│   └── charityevents_db.sql      # Full schema + seed data (import this first)
├── api/                           # Backend (RESTful API)
│   ├── package.json
│   ├── server.js                  # Main Express server
│   ├── event_db.js                # MySQL connection pool
│   └── routes/
│       └── events.js              # API routes
├── client/                        # Frontend (static files)
│   ├── index.html                 # Home page
│   ├── search.html                # Search page
│   ├── event.html                 # Event detail page
│   ├── css/
│   │   └── style.css              # Global styles
│   └── js/
│       ├── home.js               # Home page logic
│       ├── search.js             # Search page logic
│       └── event.js              # Detail page logic
└── report/
    └── PROG2002 A2 Report.docx   # Project documentation
```

---

## How to Run

### Step 1: Set up the Database

1. Open MySQL Workbench
2. Open the SQL file: `database/charityevents_db.sql`
3. Click the lightning bolt (Execute) to run it
4. Refresh the Schemas panel — you should see `charityevents_db`

### Step 2: Configure Database Connection

Open `api/event_db.js` and change:
```js
password: 'YOUR_MYSQL_PASSWORD_HERE'
```
to your actual MySQL root password.

### Step 3: Start the API Server

```bash
cd api
npm install
npm start
```

You should see:
```
[DB] Connected to MySQL database: charityevents_db
[Server] Charity Events API running on http://localhost:3000
```

### Step 4: Open the Frontend

Open `client/index.html` in your browser (or use Live Server in VS Code).

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all active + upcoming events |
| GET | `/api/events/search?date=&location=&category_id=` | Search events by filters |
| GET | `/api/events/:id` | Get single event details |
| GET | `/api/categories` | List all categories |

---

## Assignment Checklist

- [x] Database schema with organisations, categories, events tables
- [x] 12 events across 5 categories, multiple cities
- [x] `event_db.js` database connection file
- [x] RESTful API with 4 GET endpoints
- [x] Home page with dynamic event listing
- [x] Search page with date/location/category filters + Clear button
- [x] Event detail page with Register button (alert)
- [x] Consistent navigation on all pages
- [x] Project report filled in
- [ ] GitHub repository with regular commits
- [ ] Demo video (≤15 min) uploaded to OneDrive
