// Declare global variables
const items = ["Chair", "Recliner", "Table", "Umbrella"];
const prices = [25.50, 37.75, 49.95, 24.89];
const stateAbbreviations = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
let purchasedItems = [];
let purchasedQuantities = [];

// Start the order process
function startOrder() {
  let shopping = true;

  while (shopping) {
    // Prompt for item selection
    const item = prompt("What item would you like to buy today: Chair, Recliner, Table, or Umbrella?").toLowerCase();
    const itemIndex = items.map(i => i.toLowerCase()).indexOf(item);

    if (itemIndex === -1) {
      alert("Invalid item. Please select a valid item.");
      continue;
    }

    // Prompt for quantity
    const quantity = parseInt(prompt(`How many ${items[itemIndex]}s would you like to buy?`));
    if (isNaN(quantity) || quantity <= 0) {
      alert("Invalid quantity. Please enter a positive number.");
      continue;
    }

    // Add to purchase arrays
    purchasedItems.push(items[itemIndex]);
    purchasedQuantities.push(quantity);

    // Ask if the user wants to continue shopping
    shopping = prompt("Continue shopping? y/n").toLowerCase() === "y";
  }

  finalizeOrder();
}

// Finalize the order and process payment
function finalizeOrder() {
  const state = prompt("Please enter the two-letter state abbreviation.").toUpperCase();
  if (!stateAbbreviations.includes(state)) {
    alert("Invalid state abbreviation. Please try again.");
    return finalizeOrder();
  }

  // Calculate totals
  let subtotal = 0;
  for (let i = 0; i < purchasedItems.length; i++) {
    const itemIndex = items.indexOf(purchasedItems[i]);
    subtotal += prices[itemIndex] * purchasedQuantities[i];
  }

  const tax = subtotal * 0.15;
  const totalBeforeShipping = subtotal + tax;
  const shipping = calculateShipping(state, totalBeforeShipping);

  const total = totalBeforeShipping + shipping;

  // Display the invoice
  displayInvoice(subtotal, tax, shipping, total, state);
}

// Calculate shipping costs
function calculateShipping(state, total) {
  if (total > 100) return 0;

  const zoneMap = {
    "1": ["ND", "SD", "NE", "KS", "MN", "IA", "MO", "WI"],
    "2": ["WA", "OR", "ID", "MT", "WY"],
    "3": ["CA", "NV", "UT", "AZ", "CO", "NM"],
    "4": ["TX", "OK", "AR", "LA"],
    "5": ["NY", "NJ", "PA", "DE", "MD", "VA", "WV", "NC", "SC"],
    "6": ["FL", "GA", "AL", "MS"],
  };

  for (const [zone, states] of Object.entries(zoneMap)) {
    if (states.includes(state)) {
      switch (zone) {
        case "1":
          return 0; // Free shipping
        case "2":
          return 20;
        case "3":
          return 30;
        case "4":
          return 35;
        case "5":
          return 45;
        case "6":
          return 50;
      }
    }
  }

  return 50; // Default shipping if state is not found
}

// Display the invoice
function displayInvoice(subtotal, tax, shipping, total, state) {
  const orderSummary = document.getElementById("order-summary");
  const transactionSummary = document.getElementById("transaction-summary");

  // Build the order details
  let orderDetails = "<h4>Items Purchased:</h4><ul>";
  for (let i = 0; i < purchasedItems.length; i++) {
    orderDetails += `<li>${purchasedQuantities[i]} x ${purchasedItems[i]} @ $${prices[items.indexOf(purchasedItems[i])].toFixed(2)} each</li>`;
  }
  orderDetails += `</ul><p>State: ${state}</p>`;

  orderSummary.innerHTML = orderDetails;

  // Build the transaction details
  const transactionDetails = `
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Tax (15%): $${tax.toFixed(2)}</p>
    <p>Shipping: $${shipping.toFixed(2)}</p>
    <h4>Total: $${total.toFixed(2)}</h4>
  `;

  transactionSummary.innerHTML = transactionDetails;

  // Show the invoice section
  document.getElementById("invoice").classList.remove("hidden");
}

// Reset the app for a new order
function resetApp() {
  purchasedItems = [];
  purchasedQuantities = [];
  document.getElementById("invoice").classList.add("hidden");
}
