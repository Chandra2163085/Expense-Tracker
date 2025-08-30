let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction() {
  // ✅ Get values from input fields
  let date = document.getElementById("date").value;
  let desc = document.getElementById("desc").value;
  let amount = document.getElementById("amount").value;
  let category = document.getElementById("category").value;
  let type = document.getElementById("type").value;
  let error = document.getElementById("error");

  // ✅ Validation
  if (!date || !desc || !amount || !category) {
    error.innerText = "⚠ Please fill all fields!";
    return;
  }
  error.innerText = "";

  // ✅ Create transaction object
  let transaction = {
    id: Date.now(),
    date,
    desc,
    amount: parseFloat(amount),
    category,
    type
  };

  // ✅ Save to localStorage
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  displayTransactions();

  // ✅ Clear input fields
  document.getElementById("date").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "";
  document.getElementById("type").value = "income";
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
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

  document.getElementById("totalIncome").innerText = totalIncome;
  document.getElementById("totalExpense").innerText = totalExpense;
  document.getElementById("balance").innerText = totalIncome - totalExpense;
}

window.onload = displayTransactions;
