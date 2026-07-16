const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// Load from disk or start fresh
let store = [];
if (fs.existsSync(DB_FILE)) {
  try {
    store = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    console.log(`Loaded ${store.length} circulars from disk.`);
  } catch {
    store = [];
  }
}

function save() {
  fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
}

function getAll() {
  return [...store].sort((a, b) => new Date(b.scrapedAt) - new Date(a.scrapedAt));
}

function getById(id) {
  return store.find(c => c.id === id) || null;
}

function exists(sourceUrl) {
  return store.some(c => c.sourceUrl === sourceUrl);
}

function insert(circular) {
  store.unshift(circular);
  save();
}

function update(id, fields) {
  const idx = store.findIndex(c => c.id === id);
  if (idx !== -1) {
    store[idx] = { ...store[idx], ...fields };
    save();
  }
}

function markSeen(id) {
  update(id, { seen: true });
}

module.exports = { getAll, getById, exists, insert, update, markSeen };
