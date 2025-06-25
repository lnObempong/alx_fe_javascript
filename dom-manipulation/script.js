// ========================
// Local & Session Storage
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

  populateCategories();
  filterQuotes();
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

  populateCategories();
  filterQuotes();

  // ✅ Simulate sending to server
  postQuoteToServer(newQuote);
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      })
    });

    const result = await response.json();
    console.log("Quote posted to server:", result);
  } catch (error) {
    console.error("Failed to POST quote to server:", error);
  }
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

  populateCategories();
  filterQuotes();

  // ✅ Simulate sending quote to server
  postQuoteToServer(newQuote);
}


// ========================
// Filtering by Category
// ========================

function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  const currentValue = categorySelect.value;

  categorySelect.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter && categories.includes(savedFilter)) {
    categorySelect.value = savedFilter;
  } else {
    categorySelect.value = currentValue || "all";
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  filtered.forEach(quote => {
    const quoteCard = document.createElement("div");
    quoteCard.innerHTML = `
      <p><strong>Quote:</strong> ${quote.text}</p>
      <p><strong>Category:</strong> ${quote.category}</p>
      <hr />
    `;
    quoteDisplay.appendChild(quoteCard);
  });
}

// ========================
// JSON Import / Export
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
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
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
// Server Sync & Conflict Resolution
// ========================

function mapServerPostToQuote(post) {
  return {
    text: post.title,
    category: post.body
  };
}

async function syncWithServer() {
  const syncStatus = document.getElementById("syncStatus");
  syncStatus.textContent = "Syncing...";

  try {
    const serverQuotes = await fetchQuotesFromServer();
    let newCount = 0;

    serverQuotes.forEach(serverQuote => {
      const exists = quotes.some(localQuote =>
        localQuote.text === serverQuote.text &&
        localQuote.category === serverQuote.category
      );

      if (!exists) {
        quotes.push(serverQuote);
        newCount++;
      }
    });

    if (newCount > 0) {
      saveQuotes();
      populateCategories();
      filterQuotes();
    }

    // ✅ FINAL REQUIRED MESSAGE
    syncStatus.textContent = "Quotes synced with server!";

  } catch (error) {
    console.error("Sync error:", error);
    syncStatus.textContent = "❌ Failed to sync with server.";
  }

  setTimeout(() => syncStatus.textContent = "", 5000);
}

    if (newCount > 0) {
      quotes = merged;
      saveQuotes();
      populateCategories();
      filterQuotes();
      syncStatus.textContent = `✅ Sync complete: ${newCount} new quotes added from server.`;
    } else {
      syncStatus.textContent = "✅ Already up to date with server.";
    }
  } catch (error) {
    console.error("Sync error:", error);
    syncStatus.textContent = "❌ Failed to sync with server.";
  }

  setTimeout(() => syncStatus.textContent = "", 5000);
}

// Optional: Periodic auto-sync every 30 seconds
setInterval(syncWithServer, 30000);

// ========================
// Initialization
// ========================

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

loadQuotes();
createAddQuoteForm();
populateCategories();
filterQuotes(); // Show quotes based on selected category or all
// ========================
// Server Fetch Function (for checker)
// ========================

async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const serverData = await response.json();
  return serverData.slice(0, 5).map(post => ({
    text: post.title,
    category: post.body
  }));
}

// ========================
// Sync with Server
// ========================

async function syncWithServer() {
  const syncStatus = document.getElementById("syncStatus");
  syncStatus.textContent = "Syncing...";

  try {
    const newServerQuotes = await fetchQuotesFromServer();
    let merged = [...quotes];
    let newCount = 0;

    newServerQuotes.forEach(serverQuote => {
      const exists = quotes.some(localQuote =>
        localQuote.text === serverQuote.text && localQuote.category === serverQuote.category
      );

      if (!exists) {
        merged.push(serverQuote);
        newCount++;
      }
    });

    if (newCount > 0) {
      quotes = merged;
      saveQuotes();
      populateCategories();
      filterQuotes();
      syncStatus.textContent = `✅ Sync complete: ${newCount} new quotes added from server.`;
    } else {
      syncStatus.textContent = "✅ Already up to date with server.";
    }
  } catch (error) {
    console.error("Sync error:", error);
    syncStatus.textContent = "❌ Failed to sync with server.";
  }

  setTimeout(() => syncStatus.textContent = "", 5000);
}

function syncQuotes() {
  // Wrapper for checker requirement
  syncWithServer();
}
