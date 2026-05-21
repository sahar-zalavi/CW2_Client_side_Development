let usersDB = JSON.parse(localStorage.getItem("usersDB")) || {};
let accountsDB = JSON.parse(localStorage.getItem("accountsDB")) || {};
let transactionsDB = JSON.parse(localStorage.getItem("transactionsDB")) || {};
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let selectedAccountType = null;

function save() {
  localStorage.setItem("usersDB", JSON.stringify(usersDB));
  localStorage.setItem("accountsDB", JSON.stringify(accountsDB));
  localStorage.setItem("transactionsDB", JSON.stringify(transactionsDB));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

function popup(id) {
  let el = document.getElementById(id);

  if (!el) {
    return null;
  }

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

function updateUI() {
  if (currentUser) {
    $("#signInBtn").hide();
    $("#signUpBtn").hide();
    $("#signOutBtn").show();
  } else {
    $("#signInBtn").show();
    $("#signUpBtn").show();
    $("#signOutBtn").hide();
  }

  renderAccounts();
  renderTransactions();
}

function addTransaction(text) {
  if (!currentUser) {
    return;
  }

  if (!transactionsDB[currentUser.username]) {
    transactionsDB[currentUser.username] = [];
  }

  transactionsDB[currentUser.username].unshift({
    text: text,
    date: new Date().toLocaleString()
  });

  save();
  renderTransactions();
}

function renderTransactions() {
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
  if (!currentUser) {
    $("#accountList").html("<p>Please sign in to view your accounts.</p>");
    $("#totalBalance").text("£0.00");
    return;
  }

  let list = accountsDB[currentUser.username] || [];

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

$(document).on("click", "#navToggle", function () {
  $("#mainNav").toggleClass("open");
});

$(document).on("click", "#signInBtn, #signUpBtn", function (e) {
  e.preventDefault();

  let dropdown = $(this).closest(".nav-dropdown");

  $(".nav-dropdown").not(dropdown).removeClass("open");
  dropdown.toggleClass("open");
});

$(document).on("click", function (e) {
  if (!$(e.target).closest(".nav-dropdown").length) {
    $(".nav-dropdown").removeClass("open");
  }
});

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

$(document).on("input", "#signupPassword", function () {
  let password = $(this).val();
  let strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  $("#passwordHelp").toggleClass("d-none", strong);
});

$(document).on("submit", "#signUpForm", function (e) {
  e.preventDefault();

  let username = $("#signupUsername").val().trim();
  let email = $("#signupEmail").val().trim();
  let password = $("#signupPassword").val();
  let confirmPassword = $("#confirmPassword").val();

  if (!username || !email || !password || !confirmPassword) {
    showToast("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match");
    return;
  }

  let strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  if (!strong) {
    showToast("Password must be 8+ characters with uppercase, lowercase, number and symbol");
    return;
  }

  if (usersDB[username]) {
    showToast("Username already exists");
    return;
  }

  usersDB[username] = {
    email: email,
    password: password
  };

  accountsDB[username] = [];
  transactionsDB[username] = [];
  currentUser = { username: username };

  save();
  $(".nav-dropdown").removeClass("open");
  this.reset();

  updateUI();
  addTransaction("User account created");
  showToast("Account created successfully");
});

$(document).on("submit", "#signInForm", function (e) {
  e.preventDefault();

  let username = $("#loginUsername").val().trim();
  let password = $("#loginPassword").val();

  if (!usersDB[username] || usersDB[username].password !== password) {
    showToast("Incorrect username or password");
    return;
  }

  currentUser = { username: username };

  save();
  $(".nav-dropdown").removeClass("open");
  this.reset();

  updateUI();
  addTransaction("User logged in");
  showToast("Login successful");
});

$(document).on("click", "#signOutBtn", function (e) {
  e.preventDefault();

  localStorage.removeItem("currentUser");
  currentUser = null;

  updateUI();
  showToast("Signed out");
});

$(document).on("click", ".open-account", function () {
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
  if (!selectedAccountType) {
    return;
  }

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

  save();
  popup("accountPopup")?.hide();
  this.reset();

  selectedAccountType = null;

  renderAccounts();
  showToast("Account saved successfully");
});

$(document).on("click", ".request-card", function () {
  if (!currentUser) {
    return;
  }

  let id = $(this).data("id");
  let account = accountsDB[currentUser.username].find(a => a.id == id);

  if (!account) {
    return;
  }

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

  save();
  addTransaction(`Card requested for ${account.name}`);
  renderAccounts();

  showToast("Card created successfully");
});

$(document).on("click", ".delete", function () {
  if (!currentUser) {
    return;
  }

  let id = $(this).data("id");

  accountsDB[currentUser.username] =
    accountsDB[currentUser.username].filter(a => a.id != id);

  save();
  addTransaction("Account deleted");
  renderAccounts();
});

$(document).on("click", ".transfer-button", function () {
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

  save();
  popup("transferPopup")?.hide();
  this.reset();

  addTransaction(`Transferred £${amount.toFixed(2)} from ${from.name} to ${to.name}`);
  renderAccounts();

  showToast("Transfer successful");
});

$(document).on("click", ".pay-mortgage", function () {
  if (!currentUser) {
    return;
  }

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

  save();
  popup("mortgagePaymentPopup")?.hide();
  this.reset();

  addTransaction(`Paid £${amount.toFixed(2)} towards mortgage from ${from.name}`);
  renderAccounts();

  showToast("Mortgage payment successful");
});

$(document).on("input", "#searchInput", function () {
  let query = $(this).val().toLowerCase().trim();
  let $results = $("#searchResults").show().empty();

  if (query.length < 2) {
    $results.hide();
    return;
  }

  $("h1, h2, h3, p, li").each(function () {
    let $el = $(this);

    if ($el.text().toLowerCase().includes(query)) {
      $("<a href='#'></a>")
        .text($el.text().substring(0, 40) + "...")
        .on("click", function (e) {
          e.preventDefault();

          $("#searchResults").empty().hide();
          $("#searchInput").blur();

          $("html, body").animate({
            scrollTop: $el.offset().top - 100
          }, 500);

          $el.css("background", "yellow");

          setTimeout(function () {
            $el.css("background", "none");
          }, 2000);
        })
        .appendTo($results);
    }
  });

  if ($results.is(":empty")) {
    $results.append("<p>No results found</p>");
  }
});

$(document).ready(function () {
  updateUI();

  let sliderIndex = 0;
  let $slides = $(".slider-img");

  if ($slides.length) {
    setInterval(function () {
      $slides.removeClass("active");
      sliderIndex = (sliderIndex + 1) % $slides.length;
      $slides.eq(sliderIndex).addClass("active");
    }, 3000);
  }
});