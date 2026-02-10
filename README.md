# 🇮🇳 Bharath Scheme Bot (GovScheme Guide)

> **Bridging the gap between citizens and government welfare through AI-powered, multilingual guidance.**

![Status](https://img.shields.io/badge/Status-Active-success)
![Language](https://img.shields.io/badge/Language-TypeScript-blue)
![Stack](https://img.shields.io/badge/Stack-PERN%20(Postgres%20replaced%20with%20SQLite)-yellow)

**Bharath Scheme Bot** is an intelligent, conversational assistant designed to help Indian citizens discover and understand government schemes. By leveraging advanced intent detection and multilingual support, it simplifies complex bureaucratic information into easy-to-understand guidance for farmers, students, women, and senior citizens.

---

## ✨ Key Features

- **🗣️ Multilingual Support**: 
  - Full support for **English**, **Hindi**, and **Kannada**.
  - Intelligently translates responses to match the user's preferred language.
  
- **🧠 Smart Intent Detection**:
  - Recognizes queries related to **Agriculture**, **Education**, **Healthcare**, **Employment**, and **Housing**.
  - Handles variations in keywords across supported languages (e.g., "Farmer", "Kisan", "Raitha").

- **📚 Comprehensive Database**:
  - Pre-seeded with over **60+ Verified Schemes** (Central & State).
  - Includes detailed eligibility, benefits, and application links.

- **🚀 Performance Oriented**:
  - **SQLite Backend**: Migrated from PostgreSQL to lightweight SQLite for efficiency and ease of deployment.
  - **Type Safety**: Built with strict TypeScript for reliability.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Fast, modern UI with Tailwind CSS. |
| **Backend** | Node.js + Express | Robust API server. |
| **Database** | SQLite + Drizzle ORM | Lightweight, type-safe database management. |
| **Language** | TypeScript | End-to-end type safety. |

---

## 📋 Verification Reports

We maintain strict quality standards. Below are the latest verification results for the system.

### ✅ Multilingual Module
| Language | Input Test | Status |
| :--- | :--- | :--- |
| **Kannada** | `ನಮಸ್ಕಾರ` (Greeting) | ✅ **PASS** |
| **Hindi** | `नमस्ते` (Greeting) | ✅ **PASS** |
| **English** | `Hello` (Greeting) | ✅ **PASS** |

### ✅ Data Integrity
- **Total Schemes**: `60`
- **Missing Schemes**: `0`
- **Sync Status**: **Fully Synced** with documentation (`new_schemes_data.md`).

### ✅ System Health
- **Server Port**: `5000` (Automatic conflict resolution involved)
- **API Status**: `200 OK`
- **Type Check**: `Passed` (No critical errors)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bharath-scheme-bot.git
   cd bharath-scheme-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   The project uses a file-based SQLite database. Initialize it with:
   ```bash
   npm run db:push
   ```

4. **Run the Application**
   Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:5000](http://localhost:5000).

---

## 📂 Project Structure

```
├── client/             # React Frontend
│   ├── src/
│   │   ├── components/ # UI Components (LanguageSelector, ChatInterface)
│   │   └── pages/      # Route Pages
├── server/             # Express Backend
│   ├── routes.ts       # API Routes & Intent Logic
│   ├── storage.ts      # Database Operations
│   └── db.ts           # Drizzle/SQLite Config
├── shared/             # Shared Types & Schema
│   └── schema.ts       # Database Schema Definition
└── drizzle.config.ts   # ORM Configuration
```

---

## 🤝 Contributing

Contributions are welcome! Please ensure you:
1. Run `npm run check` to verify types.
2. Test multilingual flows if modifying the chat logic.

---


**License**: MIT

---
<p align="center">Made with ❤️ by <b>Nireeksha</b></p>
