// update_event_image.js - set local image for Mental Health fair
const { pool } = require('./event_db');

(async () => {
  const [r] = await pool.query(
    `UPDATE events SET image_url = 'images/mental-health-fair.jpg' WHERE event_id = 5`
  );
  console.log('Updated rows:', r.affectedRows);
  const [rows] = await pool.query('SELECT event_id, title, image_url FROM events WHERE event_id = 5');
  console.log(JSON.stringify(rows, null, 2));
  await pool.end();
})().catch(e => { console.error(e.message); process.exit(1); });
