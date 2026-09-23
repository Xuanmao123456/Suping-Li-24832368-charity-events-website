import sys
sys.path.insert(0, r'C:\Users\asuspc\Doubao\chats\2026-09-21\new-chat-1\charity-events-website\report\pylibs')

from docx import Document
from docx.shared import Pt

doc = Document()

style = doc.styles['Normal']
font = style.font
font.name = 'Arial'
font.size = Pt(12)

# Title
title = doc.add_paragraph()
title_run = title.add_run('PROG2002 – Web Development II')
title_run.bold = True
title_run.font.size = Pt(14)

subtitle = doc.add_paragraph()
sub_run = subtitle.add_run('Assignment 2: Use Case (A Dynamic Website)')
sub_run.bold = True
sub_run.font.size = Pt(13)

doc.add_paragraph('')
doc.add_paragraph('Student ID:\t\tLast Name:\t\tFirst Name:')
doc.add_paragraph('')

# Project title
p = doc.add_paragraph()
p.add_run('Title of the project:').bold = True
doc.add_paragraph('"Charity Events Gold Coast": A Dynamic Web Platform for Discovering Local Fundraising Events')

doc.add_paragraph('')

# Introduction/Motivation
p = doc.add_paragraph()
p.add_run('Introduction/Motivation').bold = True
doc.add_paragraph('Charitable organisations rely heavily on community participation to fund their work, yet the process of discovering and engaging with fundraising events remains fragmented. In the Gold Coast and Brisbane region alone, more than 200 charities host hundreds of events each year — from fun runs and gala dinners to silent auctions and charity concerts — but potential participants must visit multiple websites, social media pages, and event platforms to find them.')
doc.add_paragraph('This project addresses that gap by building a dynamic charity events website that serves as a central hub for discovering and learning about local fundraising events. The website demonstrates the application of client-side scripting (HTML, CSS, JavaScript, DOM manipulation, and Fetch API with Promises) and server-side scripting (Node.js, Express.js, and MySQL database), directly addressing Unit Learning Outcomes ULO1 and ULO3 of PROG2002 Web Development II.')
doc.add_paragraph('The motivation is both academic and practical: academically, it provides an integrated demonstration of the full web development stack covered in Modules 1–4; practically, it creates a useful tool that connects community members with causes they care about.')

doc.add_paragraph('')

# Problem Statement
p = doc.add_paragraph()
p.add_run('Problem Statement').bold = True
doc.add_paragraph('Despite the significant volume of charitable activity in Queensland, several problems prevent effective connection between charities and supporters:')
doc.add_paragraph('1. Information Fragmentation: Each charity hosts its events on its own website, Facebook page, or third-party platforms (e.g., Eventbrite, Humanitix). Users must visit multiple sources to discover events matching their interests, location, or schedule.')
doc.add_paragraph('2. Poor Discoverability: Users who want to support a cause but do not know which organisations host suitable events cannot easily search by event type (e.g., fun run, gala), date, or location.')
doc.add_paragraph('3. Outdated Information: Event details on scattered platforms are often inconsistent or out of date, leading to user confusion and missed participation opportunities.')
doc.add_paragraph('4. No Unified View of Impact: Potential supporters cannot easily see how much an event has raised toward its goal, reducing transparency and motivation to participate.')
doc.add_paragraph('The proposed website solves these problems by providing a single, centralised platform where users can browse, search, and view detailed information about charity events.')

doc.add_paragraph('')

# Solution
p = doc.add_paragraph()
p.add_run('Solution').bold = True
doc.add_paragraph('The solution is a three-tier dynamic web application following a classic client-server architecture:')
doc.add_paragraph('Client Tier (Front-End): Built with HTML5, CSS3, and vanilla JavaScript (including DOM manipulation and the Fetch API with Promises), the client provides three pages — Home, Search, and Event Detail — that render data retrieved from the server.')
doc.add_paragraph('Server Tier (Middle Tier): Built with Node.js and Express.js, the server exposes a RESTful API that handles HTTP GET requests and returns JSON responses. The server contains no business logic beyond query construction and result formatting.')
doc.add_paragraph('Data Tier (Back-End): A MySQL database named charityevents_db stores organisations, event categories, and events in a normalised relational schema. The server communicates with the database using the mysql2 package with parameterised queries.')
doc.add_paragraph('Communication flow: The browser sends an HTTP GET request (e.g., /api/events/search?city=Gold Coast) to the Express server. The server translates the request into a parameterised SQL query, executes it against MySQL, receives the result set, converts it to JSON, and returns it with appropriate HTTP status codes. The client then uses DOM manipulation to render the data into HTML cards and sections.')
doc.add_paragraph('This separation of concerns ensures that the front-end handles presentation and user interaction, the back-end handles business logic and data access, and the database persists the data — following the MVC-inspired architecture discussed in Module 1.')

doc.add_paragraph('')

# Web UX
p = doc.add_paragraph()
p.add_run('Web UX').bold = True
doc.add_paragraph('User experience was a primary design consideration throughout the project. The following principles guided the interface design:')
doc.add_paragraph('1. Consistent Navigation: A sticky navigation bar appears on every page with links to Home and Search, ensuring users are never more than one click away from the main pages. The current page is visually highlighted.')
doc.add_paragraph('2. Visual Design: A professional colour palette (deep navy #1e3a5f for trust, warm orange #e67e22 for call-to-action buttons, off-white background) evokes the warmth and professionalism expected of a charitable platform. Card-based layouts with subtle shadows and hover effects create a modern, approachable feel.')
doc.add_paragraph('3. Responsive Layout: The CSS uses CSS Grid with auto-fill and auto-fit, and media queries at 768px, ensuring the layout adapts gracefully from desktop to tablet to mobile.')
doc.add_paragraph('4. Clear Feedback States: The application explicitly handles three key states — loading (a Loading events... message while fetching), empty (a friendly No events match your search message with a link to clear filters), and error (a red-bordered error card advising the user to check if the server is running). This satisfies the requirement for DOM-based error messaging.')
doc.add_paragraph('5. Intuitive Search: The search form uses appropriate input types for each data type — a date picker for event date, a text input for location, and a dropdown for category (populated dynamically from the API). A prominent Clear Filters button resets all fields and reloads the full event list.')
doc.add_paragraph('6. Detail Page Design: The detail page uses a two-column layout (main content + sidebar) on desktop, collapsing to a single column on mobile. A visual progress bar shows fundraising progress, making the impact tangible at a glance.')
doc.add_paragraph('7. Card-Based Event Listings: Each event card displays the most decision-relevant information — title, category badge, date, location, and price — before requiring a click to see full details. This respects users time and reduces cognitive load.')

doc.add_paragraph('')

# Data Schema
p = doc.add_paragraph()
p.add_run('Data Schema').bold = True
doc.add_paragraph('The database uses a normalised three-table design to eliminate redundancy and enforce referential integrity:')
doc.add_paragraph('Table 1: organizations — Stores charitable organisation details. Columns: org_id (PK), org_name, description, contact_email, phone, website, address, city, created_at.')
doc.add_paragraph('Table 2: categories — Classifies events by type. Columns: category_id (PK), category_name, description. Seed categories include Fun Run, Gala Dinner, Silent Auction, Charity Concert, and Community Fair.')
doc.add_paragraph('Table 3: events — The main fact table. Columns: event_id (PK), org_id (FK to organisations), category_id (FK to categories), title, description, event_date, start_time, end_time, location, address, city, ticket_price, capacity, goal_amount, raised_amount, status (ENUM: active/suspended/past), image_url, created_at, updated_at.')
doc.add_paragraph('Relationships: One organisation can host many events (1:N via org_id). One category can classify many events (1:N via category_id). Foreign key constraints use ON DELETE CASCADE for organisations (deleting an org removes its events) and ON DELETE RESTRICT for categories (preventing deletion if events reference it).')
doc.add_paragraph('Status field design: The status ENUM allows the application to distinguish active events (shown on the home page), suspended events (hidden from public view), and past events. Combined with event_date >= CURDATE() in queries, this ensures only upcoming, active events are displayed — directly satisfying the assignment requirement to mark events as past or upcoming.')
doc.add_paragraph('Indexes are added on event_date, city, category_id, and status columns to optimise search query performance. The initial dataset includes 5 organisations, 5 categories, and 12 events — 10 active/upcoming, 1 past, and 1 suspended — across multiple categories and both Gold Coast and Brisbane locations.')

doc.add_paragraph('')

# API design
p = doc.add_paragraph()
p.add_run('API design').bold = True
doc.add_paragraph('The RESTful API is built with Express.js and exposes four GET endpoints under the /api/events namespace. All endpoints return JSON responses with a consistent structure ({ success, count/meta, data }).')
doc.add_paragraph('Endpoint list:')
doc.add_paragraph('  GET /api/events — Returns all active and upcoming events (ordered by date ascending), joined with category and organisation names. Used on the Home page.')
doc.add_paragraph('  GET /api/events/search?date=YYYY-MM-DD&location=text&category_id=N — Searches events by any combination of date, location (partial match on city or venue), and category. All parameters are optional. Used on the Search page.')
doc.add_paragraph('  GET /api/events/:id — Returns full details of a single event by ID, including organisation contact information and fundraising progress. Used on the Event Detail page.')
doc.add_paragraph('  GET /api/categories — Returns all event categories. Used to populate the search filter dropdown.')
doc.add_paragraph('Detailed endpoint example — GET /api/events/search:')
doc.add_paragraph('  Purpose: Allow users to discover events matching their chosen criteria.')
doc.add_paragraph('  Request: HTTP GET with query parameters (date, location, category_id). No request body required.')
doc.add_paragraph('  Response (200 OK): JSON object with success=true, count, filters (echoing applied filters), and data array of matching events. Each event object includes event_id, title, description, event_date, location, city, ticket_price, category_name, org_name, and image_url.')
doc.add_paragraph('  Error responses: 500 with { success: false, message: Search failed... } on database error; 400 if parameters are malformed.')
doc.add_paragraph('HTTP method choice:')
doc.add_paragraph('  All endpoints use GET because this assessment only requires read operations. GET is the correct HTTP method for retrieving representations of resources — it is safe (does not modify data), idempotent (multiple identical requests have the same effect), and cacheable. Using GET also allows users to bookmark or share search results via the URL.')
doc.add_paragraph('  POST, PUT, and DELETE are intentionally not implemented in this assessment because the brief explicitly states these will be developed in Assessment 3. The API design is structured so that adding these methods in the future will be straightforward — resources are already identified by URI, and the Express router pattern is in place.')

output_path = r'C:\Users\asuspc\Doubao\chats\2026-09-21\new-chat-1\charity-events-website\report\PROG2002 A2 Report.docx'
doc.save(output_path)
print(f'Report saved to: {output_path}')
