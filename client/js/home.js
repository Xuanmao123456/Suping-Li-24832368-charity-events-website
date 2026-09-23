/**
 * home.js
 * ------------------------------------------------------------
 * Fetches upcoming active events from the API and renders them
 * as cards on the homepage.
 * ------------------------------------------------------------
 */

const API_BASE = 'http://localhost:3000/api/events';
const container = document.getElementById('events-container');

document.addEventListener('DOMContentLoaded', loadEvents);

function loadEvents() {
  container.innerHTML = '<p class="loading">Loading upcoming events...</p>';

  fetch(API_BASE)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(result => {
      if (!result.success || result.data.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <h3>No upcoming events at the moment</h3>
            <p>Please check back soon — new events are added regularly.</p>
          </div>`;
        return;
      }
      renderEventCards(result.data);
    })
    .catch(error => {
      console.error('Error:', error);
      container.innerHTML = `
        <div class="error-state">
          <h3>Oops! Something went wrong</h3>
          <p>We couldn't load events. Please make sure the API server is running and try again.</p>
        </div>`;
    });
}

function renderEventCards(events) {
  container.innerHTML = '';

  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';

    const priceText = event.ticket_price == 0
      ? 'FREE'
      : '$' + parseFloat(event.ticket_price).toFixed(2);

    card.innerHTML = `
      <img src="${event.image_url || 'https://via.placeholder.com/800x400?text=Charity+Event'}"
           alt="${event.title}"
           onerror="this.src='https://via.placeholder.com/800x400?text=Event'">
      <div class="event-card-body">
        <span class="category-badge">${event.category_name}</span>
        <h3>${event.title}</h3>
        <p class="meta">📅 ${formatDate(event.event_date)}</p>
        <p class="meta">📍 ${event.location}, ${event.city}</p>
        <p class="meta">🏢 ${event.org_name}</p>
        <p class="price">${priceText}</p>
      </div>
    `;

    // Click card -> go to detail page with ?id=event_id
    card.addEventListener('click', () => {
      window.location.href = `event.html?id=${event.event_id}`;
    });

    container.appendChild(card);
  });
}

function formatDate(dateStr) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-AU', options);
}
