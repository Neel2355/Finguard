require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { scrapeRBI, scrapeSEBI, scrapeIRDAI, scrapeFIU } = require('./scrapers');
const { generateSummary, generateChecklist, askQuestion } = require('./ai');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────

// Get all circulars (with optional regulator filter)
app.get('/api/circulars', (req, res) => {
  const { regulator, severity, limit = 20 } = req.query;
  let circulars = db.getAll();
  if (regulator) circulars = circulars.filter(c => c.regulator === regulator);
  if (severity) circulars = circulars.filter(c => c.severity === severity);
  res.json({ success: true, data: circulars.slice(0, parseInt(limit)) });
});

// Get single circular with full AI summary
app.get('/api/circulars/:id', (req, res) => {
  const circular = db.getById(req.params.id);
  if (!circular) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: circular });
});

// Trigger manual scan of all regulators
app.post('/api/scan', async (req, res) => {
  console.log('Manual scan triggered...');
  try {
    const results = await runScan();
    res.json({ success: true, newCount: results.newCount, message: `Scan complete. ${results.newCount} new circulars found.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generate AI summary for a circular
app.post('/api/summarize/:id', async (req, res) => {
  const circular = db.getById(req.params.id);
  if (!circular) return res.status(404).json({ success: false, error: 'Not found' });

  try {
    const summary = await generateSummary(circular);
    const checklist = await generateChecklist(circular, summary);
    db.update(req.params.id, { summary, checklist, summarized: true });
    res.json({ success: true, summary, checklist });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Ask a question about a specific circular
app.post('/api/ask/:id', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ success: false, error: 'question is required' });

  const circular = db.getById(req.params.id);
  if (!circular) return res.status(404).json({ success: false, error: 'Not found' });

  try {
    const answer = await askQuestion(circular, question);
    res.json({ success: true, answer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mark a checklist item as done
app.patch('/api/circulars/:id/checklist/:idx', (req, res) => {
  const { done } = req.body;
  const circular = db.getById(req.params.id);
  if (!circular) return res.status(404).json({ success: false, error: 'Not found' });

  const idx = parseInt(req.params.idx);
  if (circular.checklist && circular.checklist[idx]) {
    circular.checklist[idx].done = done;
    db.update(req.params.id, { checklist: circular.checklist });
  }
  res.json({ success: true });
});

// Dashboard stats
app.get('/api/stats', (req, res) => {
  const all = db.getAll();
  res.json({
    success: true,
    data: {
      total: all.length,
      new: all.filter(c => !c.seen).length,
      actionRequired: all.filter(c => c.severity === 'critical' || c.severity === 'high').length,
      completed: all.filter(c => c.checklist && c.checklist.every(i => i.done)).length,
      byRegulator: {
        RBI: all.filter(c => c.regulator === 'RBI').length,
        SEBI: all.filter(c => c.regulator === 'SEBI').length,
        IRDAI: all.filter(c => c.regulator === 'IRDAI').length,
        FIU: all.filter(c => c.regulator === 'FIU').length,
      }
    }
  });
});

// ─── Scheduled scan every 15 minutes ─────────────────────────────────────────
cron.schedule('*/15 * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Running scheduled scan...`);
  await runScan();
});

// ─── Core scan function ───────────────────────────────────────────────────────
async function runScan() {
  let newCount = 0;

  const scrapers = [
    { fn: scrapeRBI, name: 'RBI' },
    { fn: scrapeSEBI, name: 'SEBI' },
    { fn: scrapeIRDAI, name: 'IRDAI' },
    { fn: scrapeFIU, name: 'FIU' },
  ];

  for (const { fn, name } of scrapers) {
    try {
      console.log(`  Scanning ${name}...`);
      const circulars = await fn();
      for (const c of circulars) {
        if (!db.exists(c.sourceUrl)) {
          // Auto-generate AI summary for new circulars
          try {
            const summary = await generateSummary(c);
            const checklist = await generateChecklist(c, summary);
            c.summary = summary;
            c.checklist = checklist;
            c.summarized = true;
          } catch (e) {
            console.error(`  AI summary failed for ${c.title}:`, e.message);
          }
          db.insert(c);
          newCount++;
          console.log(`  + New: ${c.title.substring(0, 60)}...`);
        }
      }
    } catch (err) {
      console.error(`  ${name} scrape failed:`, err.message);
    }
  }

  console.log(`  Scan done. ${newCount} new circulars.`);
  return { newCount };
}

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n✅ FinGuard backend running on http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   GET  /api/circulars       — list all circulars`);
  console.log(`   GET  /api/circulars/:id   — single circular`);
  console.log(`   POST /api/scan            — trigger manual scan`);
  console.log(`   POST /api/summarize/:id   — generate AI summary`);
  console.log(`   POST /api/ask/:id         — ask a question`);
  console.log(`   GET  /api/stats           — dashboard stats`);
  console.log(`\n   Auto-scanning every 15 minutes.\n`);

  // Run initial scan on startup
  runScan().catch(console.error);
});

module.exports = app;
