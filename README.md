# 📘 Dynamic Quote Generator

An interactive JavaScript web application that dynamically generates, filters, imports, exports, and syncs inspirational quotes — with persistent data storage and simulated server communication.

---

## 🚀 Project Overview

This project demonstrates advanced JavaScript techniques including:

- 🔧 DOM manipulation
- 🧠 Web storage using Local & Session Storage
- 📂 JSON data import/export
- 🗂️ Dynamic content filtering
- 🌐 Server sync simulation using `fetch`
- ⚠️ Basic conflict resolution

Built as part of the **ALX Front-End Specialization**, this project showcases how to develop a dynamic, interactive, and persistent web app using vanilla JavaScript.

---


---

## ✨ Features

- 📝 Add quotes with custom categories
- 🔀 Display a random quote
- 🧰 Filter quotes by category
- 💾 Save quotes persistently using `localStorage`
- 🎛️ Store session-specific data (e.g., last viewed quote)
- 📥 Import and 📤 export quotes in JSON format
- 🌍 Simulate quote syncing with a remote server (`JSONPlaceholder`)
- 🚨 Handle conflicts by prioritizing server data
- 🔁 Optional auto-sync every 30 seconds

---

## 📸 Sample UI Elements

```html
<select id="categoryFilter" onchange="filterQuotes()">
  <option value="all">All Categories</option>
</select>

<div id="quoteDisplay"></div>

<input id="newQuoteText" placeholder="Enter a new quote" />
<input id="newQuoteCategory" placeholder="Enter quote category" />
<button onclick="addQuote()">Add Quote</button>

<button onclick="syncQuotes()">Sync with Server</button>
<p id="syncStatus"></p>

<button onclick="exportToJson()">Export Quotes</button>
<input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />

```
# 🛠️ Technologies Used
---
HTML5

CSS3 (basic layout)

JavaScript (ES6)

JSONPlaceholder – Mock API



#👨‍💻 Author
---
Leonard Nketia Obempong

Frontend Developer | Public Policy Professional
