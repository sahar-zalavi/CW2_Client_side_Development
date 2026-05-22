let accountsDB = JSON.parse(localStorage.getItem("accountsDB")) || {};
let transactionsDB = JSON.parse(localStorage.getItem("transactionsDB")) || {};
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let selectedAccountType = null;

function refreshCurrentUser() {
  currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

  if (!currentUser) {
    const savedUsername = localStorage.getItem("lastUsername");

    if (savedUsername) {
      currentUser = {
        username: savedUsername
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }
}

function saveAccountsData() {
  localStorage.setItem("accountsDB", JSON.stringify(accountsDB));
  localStorage.setItem("transactionsDB", JSON.stringify(transactionsDB));
}

function popup(id) {
  let el = document.getElementById(id);

  if (!el) return null;

  return {
    show() {
      el.style.display = "block";
      el.classList.add("show");
      document.body.style.overflow = "hidden";
    },

    hide() {
      el.style.display = "none";
      el.classList.remove("show");
      document.body.style.overflow = "";
    }
  };
}

function showToast(message) {
  alert(message);
}

function generateAccountNumber() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

function generateSortCode() {
  return (
    Math.floor(10 + Math.random() * 89) +
    "-" +
    Math.floor(10 + Math.random() * 89) +
    "-" +
    Math.floor(10 + Math.random() * 89)
  );
}

function generateCardNumber() {
  let card = "";

  for (let i = 0; i < 16; i++) {
    card += Math.floor(Math.random() * 10);

    if ((i + 1) % 4 === 0 && i !== 15) {
      card += " ";
    }
  }

  return card;
}

function updateAccountsUI() {
  refreshCurrentUser();
  renderAccounts();
  renderTransactions();
}

function addTransaction(text) {
  refreshCurrentUser();

  if (!currentUser) return;

  if (!transactionsDB[currentUser.username]) {
    transactionsDB[currentUser.username] = [];
  }

  transactionsDB[currentUser.username].unshift({
    text: text,
    date: new Date().toLocaleString()
  });

  saveAccountsData();
  renderTransactions();
}

function renderTransactions() {
  refreshCurrentUser();

  if (!$("#transactionList").length) return;

  if (!currentUser) {
    $("#transactionList").html("");
    return;
  }

  let list = transactionsDB[currentUser.username] || [];

  if (!list.length) {
    $("#transactionList").html("<div class='transaction'>No transactions yet</div>");
    return;
  }

  $("#transactionList").html(
    list.map(t => `
      <div class="transaction">
        <strong>${t.text}</strong><br>
        <small>${t.date}</small>
      </div>
    `).join("")
  );
}

function renderAccounts() {
  refreshCurrentUser();

  if (!$("#accountList").length) return;

  if (!currentUser) {
    $("#accountList").html("<p>Please sign in to view your accounts.</p>");
    $("#totalBalance").text("£0.00");
    return;
  }

  if (!accountsDB[currentUser.username]) {
    accountsDB[currentUser.username] = [];
  }

  let list = accountsDB[currentUser.username];

  let total = list
    .filter(a => a.type !== "Mortgage")
    .reduce((sum, a) => sum + Number(a.balance || 0), 0);

  $("#totalBalance").text("£" + total.toFixed(2));

  if (!list.length) {
    $("#accountList").html("<p>No accounts opened yet.</p>");
    return;
  }

  $("#accountList").html(
    list.map(account => {
      if (account.type === "Mortgage") {
        return `
          <div class="account-card">
            <div class="info">
              <span class="badge">${account.type}</span>
              <h3>${account.name}</h3>
              <p>Total mortgage: £${Number(account.mortgageTotal).toFixed(2)}</p>
              <p class="balance">Remaining: £${Number(account.mortgageRemaining).toFixed(2)}</p>
              <p>Account No: ${account.accountNumber}</p>
            </div>

            <div>
              <button class="btn-success btn-sm pay-mortgage" data-id="${account.id}">Pay Mortgage</button>
              <button class="btn-danger btn-sm delete" data-id="${account.id}">Delete</button>
            </div>
          </div>
        `;
      }

      return `
        <div class="account-card">
          <div class="info">
            <span class="badge">${account.type}</span>
            <h3>${account.name}</h3>
            <p class="balance">£${Number(account.balance).toFixed(2)}</p>
            <p>Account No: ${account.accountNumber}</p>
            <p>Sort Code: ${account.sortCode}</p>
            <p>Card: ${account.hasCard ? account.cardNumber : "No card requested"}</p>
          </div>

          <div>
            <button class="btn-success btn-sm request-card" data-id="${account.id}">Request Card</button>
            <button class="btn-danger btn-sm delete" data-id="${account.id}">Delete</button>
          </div>
        </div>
      `;
    }).join("")
  );
}

const accountInfo = {
  "Current Account":
    "CURRENT ACCOUNT\n\nUsed for everyday banking, wages, bills, shopping and transfers.\n\nCard: Available after opening.",

  "Savings Account":
    "SAVINGS ACCOUNT\n\nUsed for saving money separately from daily spending.\n\nCard: Optional.",

  "Student Account":
    "STUDENT ACCOUNT\n\nDesigned for students managing student finance and daily spending.\n\nCard: Available.",

  "Business Account":
    "BUSINESS ACCOUNT\n\nDesigned for business income, expenses and supplier payments.\n\nCard: Available.",

  "Credit Card":
    "CREDIT CARD\n\nLets customers spend using credit and repay later.\n\nCard: Available.",

  "Mortgage":
    "MORTGAGE ACCOUNT\n\nA long-term home loan account. You can pay it down using available funds from another account."
};

$(document).on("click", "[data-close='modal']", function () {
  $(this).closest(".modal").removeClass("show").hide();
  document.body.style.overflow = "";
});

$(document).on("click", ".modal", function (e) {
  if (e.target === this) {
    $(this).removeClass("show").hide();
    document.body.style.overflow = "";
  }
});

$(document).on("click", ".open-account", function () {
  refreshCurrentUser();

  if (!currentUser) {
    showToast("Please sign in first");
    return;
  }
  let type = $(this).data("type");
  let list = accountsDB[currentUser.username] || [];
  let count = list.filter(a => a.type === type).length;
  
  if (count >= 2) {
    showToast("Maximum 2 accounts per type allowed");
    return;
  }
  selectedAccountType = type;
  $("#infoPopupText").text(accountInfo[type]);
  popup("infoPopup")?.show();
});

$(document).on("click", "#continueAccountBtn", function () {
  if (!selectedAccountType) return;

  let type = selectedAccountType;

  popup("infoPopup")?.hide();

  $("#accountType").val(type);

  $("#accountPopupTitle").text(
    type === "Mortgage" ? "Apply for Mortgage" : "Create Account"
  );

  $("#accountAmountLabel").text(
    type === "Mortgage" ? "Mortgage Amount" : "Initial Deposit"
  );

  $("#accountSubmitBtn").text(
    type === "Mortgage" ? "Apply for Mortgage" : "Create Account"
  );

  popup("accountPopup")?.show();
});

$(document).on("submit", "#accountForm", function (e) {
  e.preventDefault();

  refreshCurrentUser();

  if (!currentUser) {
    showToast("Please sign in first");
    return;
  }

  let user = currentUser.username;
  let type = $("#accountType").val();
  let amount = Number($("input[name=deposit]").val()) || 0;

  if (amount < 0) {
    showToast("Enter a valid amount");
    return;
  }

  if (!accountsDB[user]) {
    accountsDB[user] = [];
  }

  let list = accountsDB[user];

  if (type === "Mortgage") {
    if (amount <= 0) {
      showToast("Enter a valid mortgage amount");
      return;
    }

    list.push({
      id: Date.now(),
      type: "Mortgage",
      name: "Mortgage Account",
      balance: 0,
      mortgageTotal: amount,
      mortgageRemaining: amount,
      accountNumber: generateAccountNumber(),
      sortCode: null,
      hasCard: false,
      cardNumber: null
    });

    addTransaction(`Mortgage approved for £${amount.toFixed(2)}`);
  } else {
    list.push({
      id: Date.now(),
      type: type,
      name: type + " " + (list.filter(a => a.type === type).length + 1),
      balance: amount,
      accountNumber: generateAccountNumber(),
      sortCode: generateSortCode(),
      hasCard: false,
      cardNumber: null
    });

    addTransaction(`${type} created with £${amount.toFixed(2)}`);
  }

  saveAccountsData();
  popup("accountPopup")?.hide();
  this.reset();

  selectedAccountType = null;

  renderAccounts();
  showToast("Account saved successfully");
});

$(document).on("click", ".request-card", function () {
  refreshCurrentUser();

  if (!currentUser) return;

  let id = $(this).data("id");
  let account = accountsDB[currentUser.username].find(a => a.id == id);

  if (!account) return;

  if (account.type === "Mortgage") {
    showToast("Mortgage accounts cannot have cards");
    return;
  }

  if (account.hasCard) {
    showToast("Card already requested");
    return;
  }

  account.hasCard = true;
  account.cardNumber = generateCardNumber();

  saveAccountsData();
  addTransaction(`Card requested for ${account.name}`);
  renderAccounts();

  showToast("Card created successfully");
});

$(document).on("click", ".delete", function () {
  refreshCurrentUser();

  if (!currentUser) return;

  let id = $(this).data("id");

  accountsDB[currentUser.username] =
    accountsDB[currentUser.username].filter(a => a.id != id);

  saveAccountsData();
  addTransaction("Account deleted");
  renderAccounts();
});

$(document).on("click", ".transfer-button", function () {
  refreshCurrentUser();

  if (!currentUser) {
    showToast("Please sign in first");
    return;
  }

  let accounts = (accountsDB[currentUser.username] || []).filter(a => a.type !== "Mortgage");

  if (accounts.length < 2) {
    showToast("You need at least two normal accounts to transfer money");
    return;
  }

  $("#fromAccount").html(
    accounts.map(a => `
      <option value="${a.id}">
        ${a.name} - £${Number(a.balance).toFixed(2)}
      </option>
    `).join("")
  );

  $("#toAccount").html(
    accounts.map(a => `
      <option value="${a.id}">
        ${a.name} - £${Number(a.balance).toFixed(2)}
      </option>
    `).join("")
  );

  popup("transferPopup")?.show();
});

$(document).on("submit", "#transferForm", function (e) {
  e.preventDefault();

  refreshCurrentUser();

  let fromId = $("#fromAccount").val();
  let toId = $("#toAccount").val();
  let amount = Number($("#transferAmount").val());

  if (fromId === toId) {
    showToast("Choose two different accounts");
    return;
  }

  if (!amount || amount <= 0) {
    showToast("Enter a valid amount");
    return;
  }

  let list = accountsDB[currentUser.username];
  let from = list.find(a => a.id == fromId);
  let to = list.find(a => a.id == toId);

  if (!from || !to) {
    showToast("Account not found");
    return;
  }

  if (from.balance < amount) {
    showToast("Insufficient funds");
    return;
  }

  from.balance -= amount;
  to.balance += amount;

  saveAccountsData();
  popup("transferPopup")?.hide();
  this.reset();

  addTransaction(`Transferred £${amount.toFixed(2)} from ${from.name} to ${to.name}`);
  renderAccounts();

  showToast("Transfer successful");
});

$(document).on("click", ".pay-mortgage", function () {
  refreshCurrentUser();

  if (!currentUser) return;

  let mortgageId = $(this).data("id");
  let list = accountsDB[currentUser.username];
  let mortgage = list.find(a => a.id == mortgageId);

  if (!mortgage) {
    showToast("Mortgage account not found");
    return;
  }

  let normalAccounts = list.filter(a => a.type !== "Mortgage" && Number(a.balance) > 0);

  if (!normalAccounts.length) {
    showToast("You need money in a normal account to pay the mortgage");
    return;
  }

  $("#mortgagePaymentAccountId").val(mortgageId);

  $("#mortgageRemainingText").text(
    "Remaining mortgage: £" + Number(mortgage.mortgageRemaining).toFixed(2)
  );

  $("#mortgagePayFromAccount").html(
    normalAccounts.map(a => `
      <option value="${a.id}">
        ${a.name} - £${Number(a.balance).toFixed(2)}
      </option>
    `).join("")
  );

  $("#mortgagePaymentAmount").val("");

  popup("mortgagePaymentPopup")?.show();
});

$(document).on("submit", "#mortgagePaymentForm", function (e) {
  e.preventDefault();

  refreshCurrentUser();

  let mortgageId = $("#mortgagePaymentAccountId").val();
  let fromId = $("#mortgagePayFromAccount").val();
  let amount = Number($("#mortgagePaymentAmount").val());

  let list = accountsDB[currentUser.username];
  let mortgage = list.find(a => a.id == mortgageId);
  let from = list.find(a => a.id == fromId);

  if (!mortgage || !from) {
    showToast("Account not found");
    return;
  }

  if (!amount || amount <= 0) {
    showToast("Enter a valid payment amount");
    return;
  }

  if (from.balance < amount) {
    showToast("Insufficient funds");
    return;
  }

  if (amount > mortgage.mortgageRemaining) {
    showToast("Payment cannot be more than the remaining mortgage");
    return;
  }

  from.balance -= amount;
  mortgage.mortgageRemaining -= amount;

  if (mortgage.mortgageRemaining < 0) {
    mortgage.mortgageRemaining = 0;
  }

  saveAccountsData();
  popup("mortgagePaymentPopup")?.hide();
  this.reset();

  addTransaction(`Paid £${amount.toFixed(2)} towards mortgage from ${from.name}`);
  renderAccounts();

  showToast("Mortgage payment successful");
});

$(document).on("click", "#toggleTransactionsBtn", function () {
  let transactionSection = $("#transactionSection");

  if (transactionSection.is(":visible")) {
    transactionSection.hide();
    $(this).text("Show Transaction History");
  } else {
    transactionSection.show();
    $(this).text("Hide Transaction History");
  }
});

$(document).ready(function () {
  updateAccountsUI();
});