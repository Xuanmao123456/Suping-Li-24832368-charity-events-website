/**
 * home.js
 * ------------------------------------------------------------
 * Fetches upcoming active events from the API and renders them
 * as cards on the homepage.
 * ------------------------------------------------------------
 */

const API_BASE = 'http://localhost:3000/api/events';
const container = document.getElementById('events-container');

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  loadEvents();
});

// ---------- Carousel ----------
// Simple hero carousel: only one slide is visible at a time (CSS shows
// .active). Auto-advances every 5 seconds; clicking a dot resets the
// timer so a manual choice is never instantly overridden.
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  let currentSlide = 0;
  let interval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  // Auto-play every 5 seconds
  interval = setInterval(nextSlide, 5000);

  // Click dots to navigate
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      goToSlide(parseInt(dot.dataset.index));
      interval = setInterval(nextSlide, 5000);
    });
  });
}

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

    // Pet & running events -> stacked photo carousel.
    //   Fun Run events       -> running photos
    //   Million Paws Walk    -> dog photos
    //   Paws for Hope auction-> cat photos
    const eventLabel = event.title + ' ' + (event.org_name || '') + ' ' + (event.category_name || '');
    const isRunEvent = /run|fun run/i.test(eventLabel);
    const isDinnerEvent = /gala|dinner/i.test(eventLabel);
    const isConcertEvent = /concert/i.test(eventLabel);
    const isPawsWalk = /paws walk|million paws/i.test(eventLabel);
    const isCatAuction = /paws for hope|silent auction/i.test(eventLabel);
    const isCommunityEvent = /community fair/i.test(eventLabel);
    const isCarouselEvent = isRunEvent || isDinnerEvent || isConcertEvent || isPawsWalk || isCatAuction || isCommunityEvent;

    const RUN_PHOTOS = [
      { src: 'images/run-carousel-1.jpg', alt: 'Woman running outdoors' },
      { src: 'images/run-carousel-2.jpg', alt: 'Trail runner jumping' },
      { src: 'images/run-carousel-3.jpg', alt: 'Sprinters on the track' },
      { src: 'images/run-carousel-4.jpg', alt: 'Runner at sunset' },
      { src: 'images/run-carousel-5.jpg', alt: 'Runner near the Harbour Bridge' },
      { src: 'images/run-carousel-6.jpg', alt: 'Runner on a dusk road' }
    ];
    const COMMUNITY_PHOTOS = [
      { src: 'images/community-carousel-1.jpg', alt: 'Community counselling session' },
      { src: 'images/community-carousel-2.jpg', alt: 'Mindfulness at home' },
      { src: 'images/community-carousel-3.jpg', alt: 'Untangling thoughts' },
      { src: 'images/community-carousel-4.jpg', alt: 'Floral workshop' },
      { src: 'images/community-carousel-5.jpg', alt: 'Hands together in unity' },
      { src: 'images/community-carousel-6.jpg', alt: 'Hands on the tree trunk' }
    ];
    const DINNER_PHOTOS = [
      { src: 'images/dinner-carousel-1.jpg', alt: 'Outdoor candlelit dinner' },
      { src: 'images/dinner-carousel-2.jpg', alt: 'Christmas dinner toasts' },
      { src: 'images/dinner-carousel-3.jpg', alt: 'Friends toasting at a table' },
      { src: 'images/dinner-carousel-4.jpg', alt: 'Party cheers with glasses' },
      { src: 'images/dinner-carousel-5.jpg', alt: 'Celebration clinking glasses' },
      { src: 'images/dinner-carousel-6.jpg', alt: 'Evening outdoor feast' }
    ];
    const CONCERT_PHOTOS = [
      { src: 'images/concert-carousel-1.jpg', alt: 'Live concert lights' },
      { src: 'images/concert-carousel-2.jpg', alt: 'Outdoor music festival' },
      { src: 'images/concert-carousel-3.jpg', alt: 'Crowd at a concert' },
      { src: 'images/concert-carousel-4.jpg', alt: 'Indoor EDM festival' },
      { src: 'images/concert-carousel-5.jpg', alt: 'Rock show hands' },
      { src: 'images/concert-carousel-6.jpg', alt: 'Festival crowd with lights' }
    ];
    const DOG_PHOTOS = [
      { src: 'images/carousel-dog-1.jpg', alt: 'Happy rescue dog' },
      { src: 'images/carousel-dog-2.jpg', alt: 'Dogs running together' },
      { src: 'images/carousel-dog-3.jpg', alt: 'Dog running on the beach' },
      { src: 'images/new-dog-1.jpg', alt: 'Golden retriever by the sea' },
      { src: 'images/new-dog-2.jpg', alt: 'Golden retriever with a flower' },
      { src: 'images/new-dog-3.jpg', alt: 'Australian shepherd puppy' }
    ];
    const CAT_PHOTOS = [
      { src: 'images/cat-carousel-1.jpg', alt: 'Tabby cat' },
      { src: 'images/cat-carousel-2.jpg', alt: 'Kitten reaching up' },
      { src: 'images/cat-carousel-3.jpg', alt: 'Kitten yawning' },
      { src: 'images/cat-carousel-4.jpg', alt: 'Cat with sunflower crown' },
      { src: 'images/cat-carousel-5.jpg', alt: 'Orange tabby cat' },
      { src: 'images/cat-carousel-6.jpg', alt: 'Stretching ginger cat' }
    ];

    let imageHtml;
    if (isCarouselEvent) {
      const photos = isRunEvent ? RUN_PHOTOS
        : isDinnerEvent ? DINNER_PHOTOS
        : isConcertEvent ? CONCERT_PHOTOS
        : isPawsWalk ? DOG_PHOTOS
        : isCatAuction ? CAT_PHOTOS
        : isCommunityEvent ? COMMUNITY_PHOTOS
        : DOG_PHOTOS;

      // Shuffle the photos so every page load shows a different order.
      // Fisher–Yates shuffle: iterate backwards and swap each element with
      // a random earlier one. O(n), unbiased — every order is equally likely,
      // which keeps the carousel feeling fresh across page reloads.
      const shuffled = [...photos];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      const imgs = shuffled.map(p =>
        `<img src="${p.src}" alt="${p.alt}" loading="lazy">`
      ).join('\n            ');
      imageHtml = `
        <div class="event-card-image-wrapper mini-carousel">
          <div class="mini-stack">
            ${imgs}
          </div>
          <div class="mini-dots"></div>
        </div>`;
    } else {
      imageHtml = `
        <div class="event-card-image-wrapper">
          <img src="${event.image_url || 'https://via.placeholder.com/800x400?text=Charity+Event'}"
               alt="${event.title}"
               loading="lazy"
               onerror="this.src='https://via.placeholder.com/800x400?text=Event'">
        </div>`;
    }

    card.innerHTML = `
      ${imageHtml}
      <div class="event-card-body">
        <span class="category-badge ${getCategoryClass(event.category_name)}">${event.category_name}</span>
        <h3>${event.title}</h3>
        <p class="meta">📅 ${formatDate(event.event_date)}</p>
        <p class="meta">📍 ${event.location}, ${event.city}</p>
        <p class="meta">🏢 ${event.org_name}</p>
        <p class="price">${priceText}</p>
      </div>
    `;

    // Click card -> go to detail page with ?id=event_id
    card.addEventListener('click', (e) => {
      if (e.target.closest('.mini-dots')) return;   // don't navigate when clicking dots
      window.location.href = `event.html?id=${event.event_id}`;
    });

    container.appendChild(card);

    if (isCarouselEvent) initMiniCarousel(card);
  });
}

// ---------- Horizontal stacked carousel inside an event card ----------
// Photos are laid out side by side with overlapping edges (fan out).
// The active photo sits in the middle, full size, on top; the other
// photos fan out to the left and right, each edge slightly visible.
function initMiniCarousel(card) {
  const wrapper = card.querySelector('.mini-carousel');
  const slides = wrapper.querySelectorAll('.mini-stack img');
  const dotsWrap = wrapper.querySelector('.mini-dots');
  const total = slides.length;
  let current = 0;
  let interval;

  // Build dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'mini-dot' + (i === 0 ? ' active' : '');
    dot.dataset.index = i;
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      clearInterval(interval);
      goTo(i);
      interval = setInterval(next, 3500);
    });
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.querySelectorAll('.mini-dot');

  // Apply horizontal fan layout: distance from active photo decides
  // horizontal offset, scale and depth (z-index).
  function layout() {
    slides.forEach((img, i) => {
      let d = i - current;
      // wrap around: keep distance within [-2, 2] for 6 photos
      while (d > total / 2) d -= total;
      while (d < -total / 2) d += total;

      const offsetPct = d * (100 * 5 / 7);   // % of own width (overlap = 2/7)
      const scale = 1 - Math.abs(d) * 0.07; // active=1, neighbours slightly smaller
      const opacity = 1 - Math.abs(d) * 0.14; // neighbours slightly faded
      const z = 10 - Math.abs(d);            // active sits on top of the fan

      img.style.transform =
        `translate(-50%, -50%) translateX(${offsetPct}%) scale(${scale})`;
      img.style.opacity = opacity.toFixed(2);
      img.style.zIndex = String(z);
      img.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    dots[current].classList.remove('active');
    current = index;
    dots[current].classList.add('active');
    layout();
  }

  function next() {
    goTo((current + 1) % total);
  }

  layout();

  // Start auto-play
  interval = setInterval(next, 3500);
}

function formatDate(dateStr) {
  // en-AU locale renders dates the Australian way (e.g. "Monday, 5 October 2026"),
  // which matches the Gold Coast / Queensland audience of this site.
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
