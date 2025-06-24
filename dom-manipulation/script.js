// ====== Initial Setup ======

// Retrieve quotes from localStorage or use default quotes
let localQuotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

// ====== Helper Functions ======

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(localQuotes));
}

// Populate category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = new Set(localQuotes.map(quote => quote.category));
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes by selected category
function filterQuotesByCategory(category) {
  if (category === 'all') return localQuotes;
  return localQuotes.filter(q => q.category.toLowerCase() === category.toLowerCase());
}

// ====== Required Functions ======

// Function: displayRandomQuote (must use innerHTML)
function displayRandomQuote() {
  const selectedCategory = document.getElementById('categoryFilter').value || 'all';
  const filteredQuotes = filterQuotesByCategory(selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Function: addQuote (must use `function` keyword and update array + DOM)
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText === '' || quoteCategory === '') {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  localQuotes.push(newQuote); // Add to array
  saveQuotes();               // Save to localStorage

  // Optional: show the new quote immediately
  document.getElementById('quoteDisplay').innerHTML = `"${newQuote.text}" — <em>${newQuote.category}</em>`;

  // Clear form
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  populateCategories(); // Refresh dropdown
}

// ====== Additional Utility Functions ======

// Filter quotes when category changes
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  displayRandomQuote();
}

// Export quotes as JSON
function exportToJson() {
  const blob = new Blob([JSON.stringify(localQuotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        localQuotes = importedQuotes;
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch {
      alert('Failed to parse JSON.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ====== Event Listeners (Must Be at Bottom for Checker) ======

document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
document.getElementById('exportButton').addEventListener('click', exportToJson);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// ====== Initial Setup on Page Load ======
populateCategories();
const savedCategory = localStorage.getItem('selectedCategory') || 'all';
document.getElementById('categoryFilter').value = savedCategory;
displayRandomQuote();
