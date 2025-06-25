// ========================
// Load and Save Functions
// ========================

let quotes = [];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default sample quotes
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Get busy living or get busy dying.", category: "Life" }
    ];
    saveQuotes();
  }
}

// ========================
// DOM Manipulation
// ========================

function showQuote(quote) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${quote.text}</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function showRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available.");
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  showQuote(quotes[randomIndex]);
}

function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Please fill in both fields.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  showQuote(newQuote);
}

function createAddQuoteForm() {
  const container = document.getElementById("quoteFormContainer");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.addEventListener("click", addQuote);

  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(button);
}

// ========================
// Session-Based Recall
// ========================

function loadLastViewedQuote() {
  const stored = sessionStorage.getItem("lastQuote");
  if (stored) {
    showQuote(JSON.parse(stored));
  } else {
    showRandomQuote();
  }
}

// ========================
// JSON Export/Import
// ========================

function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        showRandomQuote();
      } else {
        alert("Invalid JSON format. Expected an array of quote objects.");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ========================
// Initialization
// ========================

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

loadQuotes();
createAddQuoteForm();
loadLastViewedQuote();
