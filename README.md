# Charity Events Website — PROG2002 Assignment 2

A fully functional dynamic website that helps users discover, search, and register for charity events across the Gold Coast and Brisbane region of Australia. The application is built with a RESTful API powered by Node.js and Express, a MySQL relational database, and a responsive front end using semantic HTML5, modern CSS (Morandi warm colour palette), and vanilla JavaScript with the DOM API. Key features include an animated home page with stacked image carousels, a search page with date/location/category filters, detailed event pages with fundraising progress bars, rescue stories with before-and-after photos, an adoption gallery, an impact dashboard, and an interactive admin management page where users can add or delete custom categories and events, which are synchronised with the database in real time. Protected seed data cannot be removed, ensuring data integrity. The whole project runs locally with MySQL Server and can be launched by importing the provided SQL dump and starting the Express server.

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
│   ├── add_is_custom.js           # One-time migration script (is_custom column)
│   ├── update_event_image.js      # One-time script (fix local event images)
│   └── routes/
│       ├── events.js              # API routes for events
│       └── categories.js          # API routes for categories (add/delete)
├── client/                        # Frontend (static files)
│   ├── index.html                 # Home page (hero carousel + event cards)
│   ├── search.html                # Search page with filters
│   ├── event.html                 # Event detail page
│   ├── about.html                 # About us / mission / partners
│   ├── stories.html               # Rescue stories (before & after)
│   ├── impact.html                # Impact statistics dashboard
│   ├── adopt.html                 # Adoptable pets gallery
│   ├── manage.html                # Admin: add/delete categories & events
│   ├── images/                    # Local image assets
│   ├── css/
│   │   └── style.css              # Global styles (Morandi palette)
│   └── js/
│       ├── home.js                # Home page logic + carousels
│       ├── search.js              # Search page logic
│       ├── event.js               # Detail page logic
│       └── manage.js              # Admin management logic
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
| GET | `/api/events/all` | List every event (including past ones) |
| GET | `/api/events/:id` | Get single event details |
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Add a new category (is_custom = 1) |
| DELETE | `/api/categories/:id` | Delete a custom category (seed ones return 403) |
| POST | `/api/events` | Add a new event (is_custom = 1) |
| DELETE | `/api/events/:id` | Delete a custom event (seed ones return 403) |

---

## Assignment Checklist

- [x] Database schema with organisations, categories, events tables
- [x] 12 events across 5 categories, multiple cities
- [x] `event_db.js` database connection file
- [x] RESTful API with GET/POST/DELETE endpoints
- [x] Home page with dynamic event listing + animated carousels
- [x] Search page with date/location/category filters + Clear button
- [x] Event detail page with Register button (alert) + fundraising goal
- [x] Extra pages: About, Stories, Impact, Adopt, Manage
- [x] Admin page: add/delete custom categories & events (DB-synced, seed protected)
- [x] Consistent navigation on all pages
- [x] Project report filled in
- [ ] GitHub repository with regular commits
- [ ] Demo video (≤15 min) uploaded to OneDrive
