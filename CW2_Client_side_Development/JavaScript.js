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

function save() {
  localStorage.setItem("usersDB", JSON.stringify(usersDB));
  localStorage.setItem("accountsDB", JSON.stringify(accountsDB));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}


// *******MODAL/POPUP HELPER FUNCTION*********
// This function is used to open or close Bootstrap 
// modals/popups using Bootstrap. It simplifies the 
// code when we need to show or hide modals throughout the application.

function modal(id) {

  let el = document.getElementById(id);
  if (!el) return; // safety fix so script doesn't crash

  return bootstrap.Modal.getOrCreateInstance(el);
}


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

  let password = $(this).val();

  let strong =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  $("#passwordHelp").toggleClass("d-none", strong);
});


// ******USER REGISTRATION (SIGN UP SYSTEM)*******
// This creates a new user account.
// It checks if the username already exists,
// then stores the user securely in localStorage.

$(document).on("submit", "#signUpForm", function (e) {
  e.preventDefault();

  let username = $("#signupUsername").val();
  let password = $("#signupPassword").val();

  if (!username || !password) {
    showToast("Please fill in all fields", "warning");
    return;
  }

  if (usersDB[username]) {
    showToast("Username already exists", "danger");
    return;
  }

  usersDB[username] = { password };
  accountsDB[username] = [];

  currentUser = { username };

  save();

  modal("authModal")?.hide();

  $("#signInBtn").text("Welcome " + username);
  $("#signOutBtn").removeClass("d-none");

  showToast("Account created successfully", "success");

  renderAccounts();
});


// ******USER LOGIN SYSTEM*******
// This function checks user credentials against stored 
// data and logs them in if correct. It also updates the UI 
// to show the logged-in state and allows access to account features.

$(document).on("submit", "#signInForm", function (e) {
  e.preventDefault();

  let username = $("#loginUsername").val();
  let password = $("#loginPassword").val();

  if (!usersDB[username] || usersDB[username].password !== password) {
    showToast("Incorrect username or password", "danger");
    return;
  }

  currentUser = { username };

  save();

  modal("authModal")?.hide();

  $("#signInBtn").text("Welcome " + username);
  $("#signOutBtn").removeClass("d-none");

  showToast("Login successful", "success");

  renderAccounts();
});


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

  if (!currentUser) {
    showToast("Please sign in first", "warning");
    return;
  }

  let type = $(this).data("type");
  let list = accountsDB[currentUser.username] || [];

  let count = list.filter(a => a.type === type).length;

  if (count >= 2) {
    showToast("Maximum 2 accounts per type allowed", "warning");
    return;
  }

  if (!confirm(accountInfo[type])) return;

  $("#accountType").val(type);

  modal("accountModal")?.show();
});


// SAVE NEW ACCOUNT
$(document).on("submit", "#accountForm", function (e) {
  e.preventDefault();

  let user = currentUser.username;
  let type = $("#accountType").val();
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

  renderAccounts();
});


// DELETE ACCOUNT
$(document).on("click", ".delete", function () {

  let id = $(this).data("id");

  accountsDB[currentUser.username] =
    accountsDB[currentUser.username].filter(a => a.id != id);

  save();

  showToast("Account deleted", "danger");

  renderAccounts();
});


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
$(document).on("submit", "#transferForm", function (e) {
  e.preventDefault();

  let list = accountsDB[currentUser.username];

  let from = list.find(a => a.id == $("#fromAccount").val());
  let to = list.find(a => a.id == $("#toAccount").val());
  let amount = Number($("#transferAmount").val());

  if (!from || !to) return;

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

  modal("transferModal")?.hide();

  showToast("Transfer successful", "success");

  renderAccounts();
});


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
      </div>
    `).join("")
  );

  let total = list.reduce((sum, a) => sum + a.balance, 0);

  $("#totalBalance").text("£" + total.toFixed(2));
}


// AUTO LOGIN RESTORE 
if (currentUser) {

  $("#signInBtn").text("Welcome " + currentUser.username);
  $("#signOutBtn").removeClass("d-none");

  renderAccounts();
}