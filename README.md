# 🛡 FinGuard — AI Regulatory Compliance Monitor

> An AI-powered tool that monitors RBI, SEBI, IRDAI, and FIU-IND circulars in real time, generates plain-English summaries, and creates action checklists for bank compliance teams.

![FinGuard Dashboard](https://img.shields.io/badge/Status-Active-success) ![Node.js](https://img.shields.io/badge/Node.js-v20+-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Made in India](https://img.shields.io/badge/Made%20in-India%20🇮🇳-orange)

---

## 🔥 Live Demo

**[👉 Try FinGuard Live](https://finguard-demo.netlify.app)**

| Email | Password | Role |
|---|---|---|
| compliance@icici.com | icici2024 | Chief Compliance Officer |
| risk@hdfc.com | hdfc2024 | Head of Risk |
| admin@finguard.in | admin123 | Super Admin |

Or click **"Continue in Demo Mode"** — no login needed.

---

## 🎯 The Problem

Every time RBI, SEBI, or IRDAI releases a new circular, banks must:
- Manually read long PDF documents
- Figure out what changed
- Notify the right internal teams
- Track deadlines before penalties hit

This is done by large compliance teams at huge cost. **Missing a circular = crores in fines.**

## ✅ The Solution

FinGuard automates the entire workflow:

```
New circular detected → AI reads it → Plain English summary
→ Action checklist generated → Right team notified → Deadline tracked
```

---

## 🚀 Features

- **🔍 Real-time Monitoring** — Scans RBI, SEBI, IRDAI, FIU-IND every 15 minutes automatically
- **🤖 AI Summaries** — Converts complex regulatory language into plain English
- **✅ Action Checklists** — Auto-generates department-wise tasks with deadlines
- **💬 Q&A on Circulars** — Ask "what is the penalty?" and get instant answers
- **🔔 Alerts Page** — Filter by regulator, severity, seen/unseen
- **📋 Action Items** — Track all compliance tasks across all circulars
- **📊 Reports** — Charts and analytics by regulator and severity
- **⚙️ Settings** — Manage team members, regulators, notification preferences
- **🔐 Login System** — Multi-user with role-based access
- **📤 Export CSV** — Download full compliance report

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **AI** | LLM API (AI summaries, Q&A, checklists) |
| **Data Sources** | Google News RSS, Direct web scraping |
| **Scheduler** | node-cron (auto-scan every 15 min) |
| **HTTP** | Axios |
| **Scraping** | Cheerio |
| **Storage** | JSON file (upgradeable to PostgreSQL) |
| **Deployment** | Railway (backend), Netlify (frontend) |

---

## 📁 Project Structure

```
finguard/
├── index.html          # Frontend — full dashboard (all pages)
├── server.js           # Express API server + cron scheduler
├── scrapers.js         # RBI, SEBI, IRDAI, FIU web scrapers
├── ai.js               # AI: summaries, checklists, Q&A
├── db.js               # JSON file data store
├── test-scrapers.js    # Test if scrapers work on your machine
├── package.json        # Dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

---

## ⚡ Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/finguard.git
cd finguard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Open `.env` and add your AI API key:
```
ANTHROPIC_API_KEY=your_key_here
PORT=3001
```
Get a free API key at: [console.anthropic.com](https://console.anthropic.com)

### 4. Test the scrapers
```bash
node test-scrapers.js
```
You should see ✅ for all 4 regulators.

### 5. Start the backend
```bash
node server.js
```

### 6. Open the dashboard
Double-click `index.html` in your file manager, or open it in your browser.

Enter `http://localhost:3001` when prompted, or click **Demo Mode**.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/circulars` | List all circulars |
| GET | `/api/circulars/:id` | Single circular |
| POST | `/api/scan` | Trigger manual scan |
| POST | `/api/summarize/:id` | Generate AI summary |
| POST | `/api/ask/:id` | Ask a question |
| GET | `/api/stats` | Dashboard statistics |
| PATCH | `/api/circulars/:id/checklist/:idx` | Update checklist item |

---

## 🚀 Deploy for Free

### Backend → Railway
1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Get your public URL from Settings → Networking

### Frontend → Netlify
1. Go to [netlify.com](https://netlify.com) → Add new site → Deploy manually
2. Drag and drop `index.html`
3. Done — you get a public URL instantly

---

## 🗺 Roadmap

- [ ] PostgreSQL database (replace JSON file)
- [ ] Email alerts via Nodemailer/SendGrid
- [ ] WhatsApp alerts via Twilio
- [ ] JWT-based authentication
- [ ] Admin panel for user management
- [ ] Support for MCA, TRAI, FSSAI regulators
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 👨‍💻 Author

**Neel** — Final year Computer Engineering student at I²IT Pune

- 🔗 [LinkedIn](https://linkedin.com/in/YOUR_PROFILE)
- 📧 your@email.com
- 💼 Open to internships and fresher roles in AI/Full-stack/Product

---

## ⭐ If this helped you, give it a star!

*Built with Node.js, Express, AI APIs, and a lot of chai ☕*
