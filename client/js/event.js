/**
 * event.js
 * ------------------------------------------------------------
 * Reads the ?id= query string from the URL, fetches the event
 * detail from the API, and renders a full detail page.
 * Includes a Register button that shows an alert (A2 requirement).
 * ------------------------------------------------------------
 */

const container = document.getElementById('event-detail');

document.addEventListener('DOMContentLoaded', loadEventDetail);

function loadEventDetail() {
  // Read event ID from URL query string: event.html?id=3
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('id');

  if (!eventId) {
    container.innerHTML = `
      <div class="error-state">
        <h3>No event selected</h3>
        <p>Please choose an event from the <a href="index.html">homepage</a> or <a href="search.html">search page</a>.</p>
      </div>`;
    return;
  }

  fetch(`http://localhost:3000/api/events/${eventId}`)
    .then(response => {
      if (response.status === 404) throw new Error('Event not found');
      if (!response.ok) throw new Error('Server error');
      return response.json();
    })
    .then(result => {
      if (result.success) {
        renderDetail(result.data);
      } else {
        throw new Error(result.message || 'Failed to load event');
      }
    })
    .catch(error => {
      console.error(error);
      container.innerHTML = `
        <div class="error-state">
          <h3>Event not found</h3>
          <p>The event you're looking for doesn't exist or has been removed.</p>
          <p><a href="index.html">← Back to Home</a></p>
        </div>`;
    });
}

function renderDetail(event) {
  const priceText = event.ticket_price == 0
    ? 'FREE'
    : '$' + parseFloat(event.ticket_price).toFixed(2);

  // Progress percentage for the fundraising goal bar.
  // guarded by `goal > 0` so a zero-goal event never divides by zero,
  // and capped at 100 so a campaign that exceeded its goal still shows full.
  const goal = parseFloat(event.goal_amount) || 0;
  const raised = parseFloat(event.raised_amount) || 0;
  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  container.innerHTML = `
    <img class="detail-image"
         src="${event.image_url || 'https://via.placeholder.com/900x400?text=Charity+Event'}"
         alt="${event.title}"
         onerror="this.src='https://via.placeholder.com/900x400?text=Event'">

    <div class="detail-header">
      <span class="category-badge ${getCategoryClass(event.category_name)}">${event.category_name}</span>
      <h1>${event.title}</h1>
      <p style="color:var(--text-light);font-size:1.1rem;">Organised by <strong>${event.org_name}</strong></p>
    </div>

    <div class="detail-grid">
      <div>
        <div class="detail-section section-orange">
          <h3>About This Event</h3>
          <p>${event.description}</p>
        </div>

        <div class="detail-section section-green">
          <h3>About the Charity</h3>
          <p>${event.org_description || ''}</p>
          <p style="margin-top:0.5rem;">
            📧 ${event.contact_email} &nbsp;|&nbsp; 📞 ${event.phone}
          </p>
        </div>
      </div>

      <div>
        <div class="detail-section section-blue">
          <h3>Event Details</h3>
          <p>📅 <strong>Date:</strong> ${formatDate(event.event_date)}</p>
          <p>🕐 <strong>Time:</strong> ${formatTime(event.start_time)} – ${formatTime(event.end_time)}</p>
          <p>📍 <strong>Venue:</strong> ${event.location}</p>
          <p>🏠 <strong>Address:</strong> ${event.address}, ${event.city}</p>
          <p>🎟️ <strong>Ticket:</strong> <span style="color:#b88469;font-weight:700;font-size:1.1rem;">${priceText}</span></p>
        </div>
      </div>
    </div>

    <!-- Fundraising Goal + Register at bottom -->
    <div class="bottom-actions">
      <div class="detail-section fundraising-section section-purple">
        <h3>Fundraising Goal</h3>
        <p style="font-size:1.8rem;font-weight:700;color:#b8a9b8;margin-bottom:0.5rem;">${percent}%</p>
        <div class="progress-bar">
          <div class="fill" style="width:${percent}%;background:linear-gradient(90deg,#b8a9b8,#94a8b8);"></div>
        </div>
        <p style="margin-top:0.5rem;font-size:0.95rem;color:var(--text-light);">
          Raised $${formatMoney(raised)} of $${formatMoney(goal)}
        </p>
      </div>

      <button class="btn btn-register" onclick="registerEvent()">
        ✨ Register Now ✨
      </button>
    </div>

    <div class="back-button-wrapper">
      <a href="javascript:history.back()" class="back-btn">
        ← Back to Events
      </a>
    </div>
  `;
}

// Register button — required by A2: show simple alert
function registerEvent() {
  alert('This feature is currently under construction.');
}

function formatDate(dateStr) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-AU', options);
}

function formatTime(timeStr) {
  // Convert 24-hour "14:30" from the database into a friendly "2:30 PM".
  if (!timeStr) return 'N/A';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;   // 0 and 12 both display as "12"
  return `${hour12}:${m} ${suffix}`;
}

function formatMoney(n) {
  return n.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
