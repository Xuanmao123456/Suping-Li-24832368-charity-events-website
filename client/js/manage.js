/**
 * manage.js
 * ------------------------------------------------------------
 * Management page logic:
 *   - Load and display all categories and events (with is_custom)
 *   - Add new category / event via POST API
 *   - Delete custom category / event via DELETE API
 *   - Initial seed data (is_custom = 0) is protected
 * ------------------------------------------------------------
 */

const API = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadEvents();
  loadEventCategoryOptions();

  document.getElementById('add-category-form').addEventListener('submit', addCategory);
  document.getElementById('add-event-form').addEventListener('submit', addEvent);
});

// ------------------------------------------------------------
// Load all categories
// ------------------------------------------------------------
function loadCategories() {
  const container = document.getElementById('categories-list');
  container.innerHTML = '<p class="loading">Loading categories...</p>';

  fetch(`${API}/categories`)
    .then(res => res.json())
    .then(result => {
      if (!result.success || result.data.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No categories</h3></div>';
        return;
      }
      renderCategories(result.data);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = '<div class="error-state"><h3>Failed to load categories</h3></div>';
    });
}

function renderCategories(categories) {
  const container = document.getElementById('categories-list');
  container.innerHTML = '';

  categories.forEach(cat => {
    const item = document.createElement('div');
    item.className = 'manage-item';

    const isCustom = cat.is_custom === 1;
    const badge = isCustom
      ? '<span class="manage-badge custom">✨ Custom</span>'
      : '<span class="manage-badge initial">🔒 Initial</span>';

    const deleteBtn = isCustom
      ? `<button class="btn-delete" onclick="deleteCategory(${cat.category_id}, '${cat.category_name.replace(/'/g, "\\'")}')">🗑️ Delete</button>`
      : '<span class="manage-lock">Protected</span>';

    item.innerHTML = `
      <div class="manage-item-info">
        <strong>${cat.category_name}</strong>
        <span class="manage-item-desc">${cat.description || ''}</span>
        ${badge}
      </div>
      ${deleteBtn}
    `;

    container.appendChild(item);
  });
}

// ------------------------------------------------------------
// Load all events (for management display)
// ------------------------------------------------------------
function loadEvents() {
  const container = document.getElementById('events-list');
  container.innerHTML = '<p class="loading">Loading events...</p>';

  fetch(`${API}/events/all`)
    .then(res => res.json())
    .then(result => {
      if (!result.success || result.data.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No events</h3></div>';
        return;
      }
      renderEvents(result.data);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = '<div class="error-state"><h3>Failed to load events</h3></div>';
    });
}

function renderEvents(events) {
  const container = document.getElementById('events-list');
  container.innerHTML = '';

  events.forEach(event => {
    const item = document.createElement('div');
    item.className = 'manage-item';

    const isCustom = event.is_custom === 1;
    const badge = isCustom
      ? '<span class="manage-badge custom">✨ Custom</span>'
      : '<span class="manage-badge initial">🔒 Initial</span>';

    const statusClass = event.status === 'active' ? 'status-active' : 'status-past';
    const deleteBtn = isCustom
      ? `<button class="btn-delete" onclick="deleteEvent(${event.event_id}, '${event.title.replace(/'/g, "\\'")}')">🗑️ Delete</button>`
      : '<span class="manage-lock">Protected</span>';

    item.innerHTML = `
      <div class="manage-item-info">
        <strong>${event.title}</strong>
        <span class="manage-item-desc">
          ${event.category_name} · ${event.location}, ${event.city} · ${event.event_date}
          <span class="manage-status ${statusClass}">${event.status}</span>
        </span>
        ${badge}
      </div>
      ${deleteBtn}
    `;

    container.appendChild(item);
  });
}

// ------------------------------------------------------------
// Load category options for the add-event dropdown
// ------------------------------------------------------------
function loadEventCategoryOptions() {
  fetch(`${API}/categories`)
    .then(res => res.json())
    .then(result => {
      if (!result.success) return;
      const select = document.getElementById('event-category');
      select.innerHTML = '<option value="">Select category...</option>';
      result.data.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.category_id;
        option.textContent = cat.category_name;
        select.appendChild(option);
      });
    })
    .catch(err => console.error('Failed to load category options:', err));
}

// ------------------------------------------------------------
// Add a new category
// ------------------------------------------------------------
function addCategory(e) {
  e.preventDefault();
  const name = document.getElementById('new-category-name').value.trim();
  const desc = document.getElementById('new-category-desc').value.trim();
  const msg = document.getElementById('category-form-msg');

  if (!name) return;

  fetch(`${API}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category_name: name, description: desc })
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        msg.textContent = '✅ Category added successfully!';
        msg.className = 'manage-msg success';
        document.getElementById('add-category-form').reset();
        loadCategories();
        loadEventCategoryOptions();
      } else {
        msg.textContent = '❌ ' + (result.message || 'Failed to add category');
        msg.className = 'manage-msg error';
      }
    })
    .catch(err => {
      console.error(err);
      msg.textContent = '❌ Network error. Is the API running?';
      msg.className = 'manage-msg error';
    });
}

// ------------------------------------------------------------
// Add a new event
// ------------------------------------------------------------
function addEvent(e) {
  e.preventDefault();
  const msg = document.getElementById('event-form-msg');

  const payload = {
    title: document.getElementById('event-title').value.trim(),
    category_id: document.getElementById('event-category').value,
    event_date: document.getElementById('event-date').value,
    city: document.getElementById('event-city').value.trim() || 'Gold Coast',
    location: document.getElementById('event-location').value.trim(),
    ticket_price: parseFloat(document.getElementById('event-price').value) || 0,
    description: document.getElementById('event-description').value.trim(),
    image_url: document.getElementById('event-image').value.trim() || null
  };

  if (!payload.title || !payload.category_id || !payload.event_date || !payload.location || !payload.description) {
    msg.textContent = '❌ Please fill in all required fields (marked with *)';
    msg.className = 'manage-msg error';
    return;
  }

  fetch(`${API}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        msg.textContent = '✅ Event added successfully!';
        msg.className = 'manage-msg success';
        document.getElementById('add-event-form').reset();
        document.getElementById('event-city').value = 'Gold Coast';
        loadEvents();
      } else {
        msg.textContent = '❌ ' + (result.message || 'Failed to add event');
        msg.className = 'manage-msg error';
      }
    })
    .catch(err => {
      console.error(err);
      msg.textContent = '❌ Network error. Is the API running?';
      msg.className = 'manage-msg error';
    });
}

// ------------------------------------------------------------
// Delete a custom category
// ------------------------------------------------------------
function deleteCategory(id, name) {
  if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;

  fetch(`${API}/categories/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert('✅ Category deleted');
        loadCategories();
        loadEventCategoryOptions();
      } else {
        alert('❌ ' + (result.message || 'Failed to delete'));
      }
    })
    .catch(err => {
      console.error(err);
      alert('❌ Network error. Is the API running?');
    });
}

// ------------------------------------------------------------
// Delete a custom event
// ------------------------------------------------------------
function deleteEvent(id, title) {
  if (!confirm(`Delete event "${title}"? This cannot be undone.`)) return;

  fetch(`${API}/events/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert('✅ Event deleted');
        loadEvents();
      } else {
        alert('❌ ' + (result.message || 'Failed to delete'));
      }
    })
    .catch(err => {
      console.error(err);
      alert('❌ Network error. Is the API running?');
    });
}
