// 临时脚本：给数据库表加 is_custom 字段
const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '13976973081@Lsp',
    database: 'charityevents_db'
  });

  // 检查列是否已存在，不存在才添加
  const [catCols] = await conn.query(`SHOW COLUMNS FROM categories LIKE 'is_custom'`);
  if (catCols.length === 0) {
    await conn.query(`ALTER TABLE categories ADD COLUMN is_custom TINYINT NOT NULL DEFAULT 0`);
    console.log('Added is_custom to categories');
  } else {
    console.log('is_custom already exists in categories');
  }

  const [evtCols] = await conn.query(`SHOW COLUMNS FROM events LIKE 'is_custom'`);
  if (evtCols.length === 0) {
    await conn.query(`ALTER TABLE events ADD COLUMN is_custom TINYINT NOT NULL DEFAULT 0`);
    console.log('Added is_custom to events');
  } else {
    console.log('is_custom already exists in events');
  }

  await conn.query(`UPDATE categories SET is_custom = 0 WHERE is_custom IS NULL`);
  await conn.query(`UPDATE events SET is_custom = 0 WHERE is_custom IS NULL`);

  const [cols] = await conn.query(`SHOW COLUMNS FROM categories`);
  console.log('categories columns:', cols.map(c => c.Field).join(', '));
  const [cols2] = await conn.query(`SHOW COLUMNS FROM events`);
  console.log('events columns:', cols2.map(c => c.Field).join(', '));

  const [cats] = await conn.query(`SELECT category_id, category_name, is_custom FROM categories`);
  console.log('categories:', cats);
  const [evts] = await conn.query(`SELECT event_id, title, is_custom FROM events`);
  console.log('events count:', evts.length);

  await conn.end();
  console.log('DONE');
}

main().catch(err => { console.error(err); process.exit(1); });
