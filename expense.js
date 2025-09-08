let currentUser = localStorage.getItem("currentUser") || "guest";

if (currentUser === "guest") {
  alert("⚠ Please login first!");
  window.location.href = "login.html";
}

let transactions = JSON.parse(localStorage.getItem(currentUser + "_transactions")) || [];

function saveTransactions() {
  try {
    if (transactions.length > 100) {
      transactions = transactions.slice(-100);
    }
    localStorage.setItem(currentUser + "_transactions", JSON.stringify(transactions));
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      alert("⚠ Storage full! Oldest transactions will be removed.");
      transactions.shift(); 
      saveTransactions();  
    }
  }
}

function addTransaction() {
  let date = document.getElementById("date").value.trim();
  let desc = document.getElementById("desc").value.trim();
  let amount = document.getElementById("amount").value.trim();
  let category = document.getElementById("category").value.trim();
  let type = document.getElementById("type").value;
  let error = document.getElementById("error");

  if (!date || !desc || !amount || !category) {
    error.innerText = "⚠ Please fill all fields!";
    return;
  }
  if (isNaN(amount) || parseFloat(amount) <= 0) {
    error.innerText = "⚠ Enter a valid amount!";
    return;
  }
  error.innerText = "";

  let transaction = {
    id: Date.now(),
    date,
    desc,
    amount: parseFloat(amount),
    category,
    type
  };

  transactions.push(transaction);
  saveTransactions();
  displayTransactions();

  document.getElementById("date").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "";
  document.getElementById("type").value = "income";
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();
  displayTransactions();
}

function displayTransactions() {
  let list = document.getElementById("transactions");
  list.innerHTML = "";

  let totalIncome = 0, totalExpense = 0;

  transactions.forEach(t => {
    let li = document.createElement("li");
    li.classList.add(t.type);

    li.innerHTML = `
      <span>${t.date} - ${t.desc} (${t.category}): ₹${t.amount}</span>
      <button onclick="deleteTransaction(${t.id})">Delete</button>
    `;

    list.appendChild(li);

    if (t.type === "income") totalIncome += t.amount;
    else totalExpense += t.amount;
  });

  document.getElementById("totalIncome").innerText = totalIncome.toFixed(2);
  document.getElementById("totalExpense").innerText = totalExpense.toFixed(2);
  document.getElementById("balance").innerText = (totalIncome - totalExpense).toFixed(2);
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

window.onload = displayTransactions;
