<<<<<<< HEAD
// ******DATA STORAGE******* 
// We load existing data from localStorage so that
// user accounts and login sessions are not lost
// when the page is refreshed or reopened.

let usersDB = JSON.parse(localStorage.getItem("usersDB")) || {};
let accountsDB = JSON.parse(localStorage.getItem("accountsDB")) || {};
let currentUser = JSON.parse(localStorage.getItem("currentUser"));


// *******SAVE FUNCTION******
// This function ensures all changes made by the user
// (such as creating accounts or transferring money)
// are saved in the browser storage.
=======
// LOCAL STORAGE DATA
// -------------------------------------------------

let usersDB = JSON.parse(localStorage.getItem("usersDB")) || {};
let accountsDB = JSON.parse(localStorage.getItem("accountsDB")) || {};
let transactionsDB = JSON.parse(localStorage.getItem("transactionsDB")) || {};
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let selectedAccountType = null;

// SAVE DATA
// Saves the latest users, accounts and transactions.
// -----------------------------------------------------
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f

function save() {
  localStorage.setItem("usersDB", JSON.stringify(usersDB));
  localStorage.setItem("accountsDB", JSON.stringify(accountsDB));
<<<<<<< HEAD
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}


// *******MODAL/POPUP HELPER FUNCTION*********
// This function is used to open or close Bootstrap 
// modals/popups using Bootstrap. It simplifies the 
// code when we need to show or hide modals throughout the application.

function modal(id) {

  let el = document.getElementById(id);
  if (!el) return; // safety fix so script doesn't crash
=======
  localStorage.setItem("transactionsDB", JSON.stringify(transactionsDB));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

// POPUP HELPER
// Bootstrap calls these "modals", but these are used
// as popups in the banking page.
// -------------------------------------------------

function popup(id) {
  let el = document.getElementById(id);

  if (!el) {
    return null;
  }
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f

  return bootstrap.Modal.getOrCreateInstance(el);
}

<<<<<<< HEAD

// ================= TOAST NOTIFICATIONS =================
// Replaces alerts with modern UI messages (better UX + higher marks)

function showToast(message, type = "primary") {

  let el = document.getElementById("appToast");
  let body = document.getElementById("toastMessage");

  if (!el || !body) return;

  body.textContent = message;

  el.className = `toast text-bg-${type} border-0`;

  bootstrap.Toast.getOrCreateInstance(el).show();
}


// ******PASSWORD VALIDATION (SIGN UP SECURITY RULES)*******
// This section checks password strength.
// It tells users to create secure passwords that includes:
// - uppercase letters
// - lowercase letters
// - numbers
// - special characters
// - minimum length of 8 characters

$(document).on("input", "#signupPassword", function () {

=======
// TOAST MESSAGE
// Shows small messages on screen instead of alerts.
// -------------------------------------------------

function showToast(message, type = "primary") {
  let toastEl = document.getElementById("appToast");
  let toastMsg = document.getElementById("toastMessage");

  if (!toastEl || !toastMsg) {
    return;
  }

  toastMsg.textContent = message;
  toastEl.className = `toast text-bg-${type} border-0`;

  bootstrap.Toast.getOrCreateInstance(toastEl).show();
}

// TRANSACTION HISTORY
// Adds and displays account activity.
// -------------------------------------------------

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
    $("#transactionList").html(`
      <div class="transaction">
        No transactions yet
      </div>
    `);

    return;
  }

  $("#transactionList").html(
    list.map(t => `
      <div class="transaction">
        <strong>${t.text}</strong>
        <br>
        <small>${t.date}</small>
      </div>
    `).join("")
  );
}


// PASSWORD VALIDATION
// Checks that the password is strong enough.
// -------------------------------------------------

$(document).on("input", "#signupPassword", function () {
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
  let password = $(this).val();

  let strong =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  $("#passwordHelp").toggleClass("d-none", strong);
});


<<<<<<< HEAD
// ******USER REGISTRATION (SIGN UP SYSTEM)*******
// This creates a new user account.
// It checks if the username already exists,
// then stores the user securely in localStorage.
=======
// SIGN UP
// Creates a new user and saves it in localStorage.
// -------------------------------------------------
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f

$(document).on("submit", "#signUpForm", function (e) {
  e.preventDefault();

<<<<<<< HEAD
  let username = $("#signupUsername").val();
  let password = $("#signupPassword").val();

  if (!username || !password) {
=======
  let username = $("#signupUsername").val().trim();
  let email = $("#signupEmail").val().trim();
  let password = $("#signupPassword").val();

  if (!username || !email || !password) {
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
    showToast("Please fill in all fields", "warning");
    return;
  }

<<<<<<< HEAD
=======
  let strong =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  if (!strong) {
    showToast("Password is not strong enough", "danger");
    return;
  }

>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
  if (usersDB[username]) {
    showToast("Username already exists", "danger");
    return;
  }

<<<<<<< HEAD
  usersDB[username] = { password };
  accountsDB[username] = [];

  currentUser = { username };

  save();

  modal("authModal")?.hide();

  $("#signInBtn").text("Welcome " + username);
  $("#signOutBtn").removeClass("d-none");

=======
  usersDB[username] = {
    email: email,
    password: password
  };

  accountsDB[username] = [];
  transactionsDB[username] = [];
  currentUser = { username: username };

  save();

  popup("authPopup")?.hide();

  updateUI();
  addTransaction("User account created");
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
  showToast("Account created successfully", "success");

  renderAccounts();
});


<<<<<<< HEAD
// ******USER LOGIN SYSTEM*******
// This function checks user credentials against stored 
// data and logs them in if correct. It also updates the UI 
// to show the logged-in state and allows access to account features.
=======
// LOGIN
// Checks username and password against stored users.
// -------------------------------------------------
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f

$(document).on("submit", "#signInForm", function (e) {
  e.preventDefault();

<<<<<<< HEAD
  let username = $("#loginUsername").val();
=======
  let username = $("#loginUsername").val().trim();
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
  let password = $("#loginPassword").val();

  if (!usersDB[username] || usersDB[username].password !== password) {
    showToast("Incorrect username or password", "danger");
    return;
  }

<<<<<<< HEAD
  currentUser = { username };

  save();

  modal("authModal")?.hide();

  $("#signInBtn").text("Welcome " + username);
  $("#signOutBtn").removeClass("d-none");

=======
  currentUser = { username: username };
  save();

  popup("authPopup")?.hide();

  updateUI();
  addTransaction("User logged in");
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
  showToast("Login successful", "success");

  renderAccounts();
});


<<<<<<< HEAD
// Open login/signup modal when sign in/up buttons are clicked
$(document).on("click", "#signInBtn, #signUpBtn", function () {
  modal("authModal")?.show();
});


// Logout resets session and reloads the page to clear data and return to initial state.
$(document).on("click", "#signOutBtn", function () {
  location.reload();
});


// *****ACCOUNT INFORMATION SYSTEM*****
// This stores descriptions of each account type.
// It helps users understand what each account does before creating one.

const accountInfo = {
  "Current Account":
    "A Current Account is designed for everyday banking. It allows frequent transactions such as payments, withdrawals, and transfers but does not earn interest.",

  "Savings Account":
    "A Savings Account helps users store money safely and earn interest over time.",

  "Student Account":
    "A Student Account is designed for students and includes reduced fees and banking benefits.",

  "Business Account":
    "A Business Account supports companies and higher transaction activity."
};


// ******CREATE NEW BANK ACCOUNT******
// This allows users to create new accounts of different types

$(document).on("click", ".open-account", function () {

=======
// ======================================================
// OPEN LOGIN / SIGN UP POPUP
// ======================================================

$(document).on("click", "#signInBtn, #signUpBtn", function () {
  if (currentUser && this.id === "signInBtn") {
    showToast("You are already signed in", "info");
    return;
  }

  popup("authPopup")?.show();
});


// ======================================================
// SIGN OUT
// Clears the current session only.
// ======================================================

$(document).on("click", "#signOutBtn", function () {
  localStorage.removeItem("currentUser");
  currentUser = null;

  updateUI();

  $("#accountList").html("");
  $("#transactionList").html("");
  $("#totalBalance").text("£0.00");

  showToast("Signed out", "secondary");
});


// ======================================================
// ACCOUNT INFORMATION
// Text shown before opening each account.
// ======================================================

const accountInfo = {
  "Current Account":
    "CURRENT ACCOUNT\n\nA current account is designed for everyday banking. It can be used for wages, shopping, bills, direct debits, withdrawals and transfers.\n\nAPR / Interest: 0% AER. This account does not normally earn interest.\n\nCard: A card can be requested after opening the account.\n\nFees: No monthly fee in this demo banking system.",

  "Savings Account":
    "SAVINGS ACCOUNT\n\nA savings account is designed to help customers put money aside and separate savings from daily spending.\n\nAPR / Interest: Example 3.5% AER variable interest in this demo.\n\nCard: A card can be requested if required.\n\nFees: No monthly fee in this demo banking system.",

  "Student Account":
    "STUDENT ACCOUNT\n\nA student account is designed for students managing student finance, rent, shopping and everyday spending.\n\nAPR / Interest: 0% AER on balance. A real bank may offer student overdraft support.\n\nCard: A student card can be requested after opening the account.\n\nFees: No monthly fee in this demo system.",

  "Business Account":
    "BUSINESS ACCOUNT\n\nA business account is designed for business income, expenses, supplier payments and company transactions.\n\nAPR / Interest: 0% AER on balance.\n\nCard: A business card can be requested.\n\nFees: A real bank may charge a monthly service fee, but this demo does not.",

  "Credit Card":
    "CREDIT CARD\n\nA credit card allows customers to spend using credit and repay later. It can be useful for purchases, emergencies and building credit history.\n\nRepresentative APR: Example 24.9% variable APR in this demo.\n\nCard: A credit card can be requested after opening the account.\n\nFees: Interest may apply if the balance is not repaid in full.",

  "Mortgage":
    "MORTGAGE ACCOUNT\n\nA mortgage is a long-term home loan account. Customers borrow money and repay it gradually over time.\n\nRepresentative APR: Example 5.2% variable APR in this demo.\n\nCard: Mortgages do not have bank cards.\n\nFees: Real mortgages may include arrangement fees, valuation fees and early repayment charges."
};


// NUMBER GENERATOR
// Creates account numbers, sort codes and cards.
// -------------------------------------------------

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


// OPEN ACCOUNT INFORMATION POPUP
// Shows what the account offers before creating it.
// -------------------------------------------------

$(document).on("click", ".open-account", function () {
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
  if (!currentUser) {
    showToast("Please sign in first", "warning");
    return;
  }

  let type = $(this).data("type");
  let list = accountsDB[currentUser.username] || [];
<<<<<<< HEAD

=======
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
  let count = list.filter(a => a.type === type).length;

  if (count >= 2) {
    showToast("Maximum 2 accounts per type allowed", "warning");
    return;
  }

<<<<<<< HEAD
  if (!confirm(accountInfo[type])) return;

  $("#accountType").val(type);

  modal("accountModal")?.show();
});


// SAVE NEW ACCOUNT
=======
  selectedAccountType = type;

  $("#infoPopupText").text(accountInfo[type]);
  popup("infoPopup")?.show();
});


// CONTINUE FROM ACCOUNT INFORMATION POPUP
// Opens the account creation popup.
// -------------------------------------------------

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


// CREATE ACCOUNT
// Creates either a normal account or mortgage account.
// -------------------------------------------------

>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
$(document).on("submit", "#accountForm", function (e) {
  e.preventDefault();

  let user = currentUser.username;
  let type = $("#accountType").val();
<<<<<<< HEAD
  let list = accountsDB[user];

  let deposit = Number($("input[name=deposit]").val()) || 0;

  let account = {
    id: Date.now(),
    type,
    name: type + " " + (list.filter(a => a.type === type).length + 1),
    balance: deposit
  };

  accountsDB[user].push(account);

  save();

  modal("accountModal")?.hide();

  showToast("Account created successfully", "success");

=======
  let amount = Number($("input[name=deposit]").val()) || 0;
  let list = accountsDB[user];

  if (amount < 0) {
    showToast("Enter a valid amount", "danger");
    return;
  }

  if (type === "Mortgage") {
    if (!amount || amount <= 0) {
      showToast("Enter a valid mortgage amount", "danger");
      return;
    }

    let account = {
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
    };

    list.push(account);
    save();

    popup("accountPopup")?.hide();
    $("#accountForm")[0].reset();

    showToast("Mortgage approved", "success");
    addTransaction(`Mortgage approved for £${amount.toFixed(2)}`);

    selectedAccountType = null;
    renderAccounts();

    return;
  }

  let account = {
    id: Date.now(),
    type: type,
    name: type + " " + (list.filter(a => a.type === type).length + 1),
    balance: amount,
    accountNumber: generateAccountNumber(),
    sortCode: generateSortCode(),
    hasCard: false,
    cardNumber: null
  };

  list.push(account);
  save();

  popup("accountPopup")?.hide();
  $("#accountForm")[0].reset();

  showToast("Account created successfully", "success");
  addTransaction(`${type} created with £${amount.toFixed(2)}`);

  selectedAccountType = null;
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
  renderAccounts();
});


<<<<<<< HEAD
// DELETE ACCOUNT
$(document).on("click", ".delete", function () {

=======
// DELETE ACCOUNT BUTTON
// Removes an account from the current user.
// -------------------------------------------------

$(document).on("click", ".delete", function () {
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
  let id = $(this).data("id");

  accountsDB[currentUser.username] =
    accountsDB[currentUser.username].filter(a => a.id != id);

  save();

  showToast("Account deleted", "danger");
<<<<<<< HEAD
=======
  addTransaction("Account deleted");
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f

  renderAccounts();
});


<<<<<<< HEAD
// *****TRANSFER MONEY SYSTEM*****

$(document).on("click", ".transfer-button", function () {

  let list = accountsDB[currentUser.username] || [];

  if (list.length < 2) {
    showToast("You need at least 2 accounts", "warning");
    return;
  }

  let options = list.map(a =>
    `<option value="${a.id}">${a.name} (£${a.balance.toFixed(2)})</option>`
  );

  $("#fromAccount, #toAccount").html(options);

  modal("transferModal")?.show();
});


// PROCESS TRANSFER REQUEST
=======

// REQUEST CARD
// Gives a card number to accounts that can have cards.
// -------------------------------------------------

$(document).on("click", ".request-card", function () {
  let id = $(this).data("id");
  let list = accountsDB[currentUser.username];
  let account = list.find(a => a.id == id);

  if (!account) {
    return;
  }

  if (account.type === "Mortgage") {
    showToast("Mortgage accounts cannot request cards", "danger");
    return;
  }

  if (account.hasCard) {
    showToast("Card already exists", "warning");
    return;
  }

  account.hasCard = true;
  account.cardNumber = generateCardNumber();

  save();

  showToast("New card requested successfully", "success");
  addTransaction(`New bank card requested for ${account.name}`);

  renderAccounts();
});


// OPEN MORTGAGE PAYMENT POPUP
// ------------------------------------------------

$(document).on("click", ".pay-mortgage", function () {
  let id = $(this).data("id");
  let list = accountsDB[currentUser.username];
  let mortgage = list.find(a => a.id == id);

  if (!mortgage) {
    return;
  }

  $("#mortgagePaymentAccountId").val(id);
  $("#mortgageRemainingText").text(
    "Remaining mortgage: £" + mortgage.mortgageRemaining.toFixed(2)
  );
  $("#mortgagePaymentAmount").val("");

  popup("mortgagePaymentPopup")?.show();
});


// MAKE MORTGAGE PAYMENT
// Allows your mortgage to be paid bit by bit.
// ------------------------------------------------

$(document).on("submit", "#mortgagePaymentForm", function (e) {
  e.preventDefault();

  let id = $("#mortgagePaymentAccountId").val();
  let payment = Number($("#mortgagePaymentAmount").val());

  let list = accountsDB[currentUser.username];
  let mortgage = list.find(a => a.id == id);

  if (!mortgage) {
    return;
  }

  if (!payment || payment <= 0) {
    showToast("Invalid payment amount", "danger");
    return;
  }

  if (payment > mortgage.mortgageRemaining) {
    payment = mortgage.mortgageRemaining;
  }

  mortgage.mortgageRemaining -= payment;

  addTransaction(`Mortgage payment made: £${payment.toFixed(2)}`);

  if (mortgage.mortgageRemaining <= 0) {
    mortgage.mortgageRemaining = 0;
    showToast("Mortgage fully paid off", "success");
    addTransaction("Mortgage fully repaid");
  } else {
    showToast(`Mortgage payment successful (£${payment.toFixed(2)})`, "success");
  }

  save();

  popup("mortgagePaymentPopup")?.hide();
  $("#mortgagePaymentForm")[0].reset();

  renderAccounts();
});



// OPEN TRANSFER POPUP
// ------------------------------------------------

$(document).on("click", ".transfer-button", function () {
  if (!currentUser) {
    showToast("Please sign in first", "warning");
    return;
  }

  let list = accountsDB[currentUser.username] || [];
  let validAccounts = list.filter(a => a.type !== "Mortgage");

  if (validAccounts.length < 2) {
    showToast("You need at least 2 non-mortgage accounts", "warning");
    return;
  }

  let options = validAccounts.map(a => `
    <option value="${a.id}">
      ${a.name} (£${a.balance.toFixed(2)})
    </option>
  `);

  $("#fromAccount, #toAccount").html(options);
  popup("transferPopup")?.show();
});


// PROCESS TRANSFER
// Move your money from one account to another.
// ------------------------------------------------

>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
$(document).on("submit", "#transferForm", function (e) {
  e.preventDefault();

  let list = accountsDB[currentUser.username];

  let from = list.find(a => a.id == $("#fromAccount").val());
  let to = list.find(a => a.id == $("#toAccount").val());
  let amount = Number($("#transferAmount").val());

<<<<<<< HEAD
  if (!from || !to) return;
=======
  if (!from || !to) {
    return;
  }
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f

  if (from.id === to.id) {
    showToast("Cannot transfer to same account", "danger");
    return;
  }

  if (amount <= 0) {
    showToast("Enter valid amount", "warning");
    return;
  }

  if (from.balance < amount) {
    showToast("Insufficient balance", "danger");
    return;
  }

  from.balance -= amount;
  to.balance += amount;

  save();

<<<<<<< HEAD
  modal("transferModal")?.hide();

  showToast("Transfer successful", "success");

=======
  popup("transferPopup")?.hide();
  $("#transferForm")[0].reset();

  showToast("Transfer successful", "success");

  addTransaction(
    `Transferred £${amount.toFixed(2)} from ${from.name} to ${to.name}`
  );

>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
  renderAccounts();
});


<<<<<<< HEAD
// ******DISPLAY ACCOUNTS FUNCTION******
// Shows all accounts and calculates total balance

function renderAccounts() {

  if (!currentUser) return;

  let list = accountsDB[currentUser.username] || [];

  $("#accountList").html(
    list.map(a => `
      <div class="border p-2 mb-2 bg-white">
        <b>${a.name}</b><br>
        Balance: £${a.balance.toFixed(2)}
        <button class="btn btn-danger btn-sm delete" data-id="${a.id}">
          Delete
        </button>
=======
// MAKE ACCOUNTS
// Displays all accounts on the page.
// ------------------------------------------------

function renderAccounts() {
  if (!currentUser) {
    return;
  }

  let list = accountsDB[currentUser.username] || [];

  if (!list.length) {
    $("#accountList").html(`
      <p class="muted">No accounts created yet.</p>
    `);

    $("#totalBalance").text("£0.00");
    renderTransactions();

    return;
  }

  $("#accountList").html(
    list.map(a => `
      <div class="account-card">

        <div class="info">

          <div class="badge">${a.type}</div>

          <div class="balance">
            ${
              a.type === "Mortgage"
              ? `£${a.mortgageRemaining.toFixed(2)} remaining`
              : `£${a.balance.toFixed(2)}`
            }
          </div>

          <div class="acc-name">${a.name}</div>

          <small>Account No: ${a.accountNumber}</small>

          ${
            a.sortCode
            ? `<small>Sort Code: ${a.sortCode}</small>`
            : `<small>Sort Code: Not applicable</small>`
          }

          ${
            a.hasCard
            ? `<small>Card: ${a.cardNumber}</small>`
            : a.type !== "Mortgage"
              ? `
                <button class="btn btn-primary btn-sm mt-2 request-card" data-id="${a.id}">
                  Request Card
                </button>
              `
              : `<small>No card required for mortgage</small>`
          }

          ${
            a.type === "Mortgage"
            ? `
              <div class="mt-2">
                <strong>Total Mortgage:</strong>
                £${a.mortgageTotal.toFixed(2)}
                <br>
                <strong>Remaining:</strong>
                £${a.mortgageRemaining.toFixed(2)}
                <br>
                <button class="btn btn-success btn-sm mt-2 pay-mortgage" data-id="${a.id}">
                  Pay Mortgage
                </button>
              </div>
            `
            : ""
          }

        </div>

        <button class="btn btn-danger btn-sm delete" data-id="${a.id}">
          Delete
        </button>

>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
      </div>
    `).join("")
  );

<<<<<<< HEAD
  let total = list.reduce((sum, a) => sum + a.balance, 0);

  $("#totalBalance").text("£" + total.toFixed(2));
}


// AUTO LOGIN RESTORE 
if (currentUser) {

  $("#signInBtn").text("Welcome " + currentUser.username);
  $("#signOutBtn").removeClass("d-none");

  renderAccounts();
=======
  let total = list.reduce((sum, a) => sum + (a.balance || 0), 0);

  $("#totalBalance").text("£" + total.toFixed(2));

  renderTransactions();
}


// UPDATE HEADER
// Shows correct buttons depending on login state.
// ------------------------------------------------

function updateUI() {
  if (currentUser) {
    $("#signInBtn").text("Welcome " + currentUser.username);
    $("#signUpBtn").hide();
    $("#signOutBtn").removeClass("d-none").show();
  } else {
    $("#signInBtn").text("Sign In");
    $("#signUpBtn").show();
    $("#signOutBtn").addClass("d-none").hide();
  }
}


// START PAGE
// Restores logged-in user if one exists.
// ------------------------------------------------
updateUI();

if (currentUser) {
  renderAccounts();
  renderTransactions();
>>>>>>> 3f97b2ecdcacf49a2f5090d762f63a943bd4c83f
}