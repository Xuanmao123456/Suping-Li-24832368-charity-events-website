/**
 * search.js
 * ------------------------------------------------------------
 * Handles the search page:
 *   - Loads category dropdown options on page load
 *   - Submits search via API with optional filters
 *   - Clear Filters button resets the form and reloads all events
 *   - Renders results or empty / error states
 * ------------------------------------------------------------
 */

const API_BASE = 'http://localhost:3000/api/events';
const resultsContainer = document.getElementById('results-container');
const form = document.getElementById('search-form');
const clearBtn = document.getElementById('clear-btn');
const categorySelect = document.getElementById('category');

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadAllEvents();  // show all events by default
  form.addEventListener('submit', handleSearch);
  clearBtn.addEventListener('click', handleClearFilters);
});

// ------------------------------------------------------------
// Load category options from API
// ------------------------------------------------------------
function loadCategories() {
  fetch('http://localhost:3000/api/categories')
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        result.data.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.category_id;
          option.textContent = cat.category_name;
          categorySelect.appendChild(option);
        });
      }
    })
    .catch(err => console.error('Failed to load categories:', err));
}

// ------------------------------------------------------------
// Initial load — show all active events
// ------------------------------------------------------------
function loadAllEvents() {
  resultsContainer.innerHTML = '<p class="loading">Loading events...</p>';

  fetch(API_BASE)
    .then(res => res.json())
    .then(result => {
      if (result.success && result.data.length > 0) {
        renderResults(result.data);
      } else {
        showEmpty();
      }
    })
    .catch(err => showError(err));
}

// ------------------------------------------------------------
// Search form submission
// ------------------------------------------------------------
function handleSearch(e) {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const location = document.getElementById('location').value.trim();
  const categoryId = categorySelect.value;

  // Build query string
  // URLSearchParams only appends filters that are actually filled in,
  // so an empty form hits GET /api/events (all events) instead of
  // sending useless empty parameters.
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (location) params.append('location', location);
  if (categoryId) params.append('category_id', categoryId);

  const queryStr = params.toString();
  const url = queryStr
    ? `${API_BASE}/search?${queryStr}`
    : API_BASE;

  resultsContainer.innerHTML = '<p class="loading">Searching events...</p>';

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    })
    .then(result => {
      if (!result.success || result.data.length === 0) {
        showEmpty();
      } else {
        renderResults(result.data);
      }
    })
    .catch(err => showError(err));
}

// ------------------------------------------------------------
// Clear Filters — reset form and reload all events
// ------------------------------------------------------------
function handleClearFilters() {
  form.reset();
  loadAllEvents();
}

// ------------------------------------------------------------
// Render result cards
// ------------------------------------------------------------
function renderResults(events) {
  resultsContainer.innerHTML = '';

  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';

    const priceText = event.ticket_price == 0
      ? 'FREE'
      : '$' + parseFloat(event.ticket_price).toFixed(2);

    card.innerHTML = `
      <div class="event-card-image-wrapper">
        <img src="${event.image_url || 'https://via.placeholder.com/800x400?text=Charity+Event'}"
             alt="${event.title}"
             onerror="this.src='https://via.placeholder.com/800x400?text=Event'">
      </div>
      <div class="event-card-body">
        <span class="category-badge ${getCategoryClass(event.category_name)}">${event.category_name}</span>
        <h3>${event.title}</h3>
        <p class="meta">📅 ${formatDate(event.event_date)}</p>
        <p class="meta">📍 ${event.location}, ${event.city}</p>
        <p class="price">${priceText}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `event.html?id=${event.event_id}`;
    });

    resultsContainer.appendChild(card);
  });
}

// ------------------------------------------------------------
// State helpers
// ------------------------------------------------------------
function showEmpty() {
  resultsContainer.innerHTML = `
    <div class="empty-state">
      <h3>No events match your search</h3>
      <p>Try adjusting your filters or <a href="#" onclick="handleClearFilters(); return false;">clear all filters</a>.</p>
    </div>`;
}

function showError(err) {
  console.error(err);
  resultsContainer.innerHTML = `
    <div class="error-state">
      <h3>Search error</h3>
      <p>Something went wrong while searching. Please try again.</p>
    </div>`;
}

function formatDate(dateStr) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-AU', options);
}

// Map category names to Morandi color badge classes
function getCategoryClass(categoryName) {
  const name = categoryName.toLowerCase();
  if (name.includes('run')) return 'badge-fun-run';
  if (name.includes('gala')) return 'badge-gala-dinner';
  if (name.includes('auction')) return 'badge-silent-auction';
  if (name.includes('concert')) return 'badge-charity-concert';
  if (name.includes('fair')) return 'badge-community-fair';
  return 'badge-charity-concert';
}
