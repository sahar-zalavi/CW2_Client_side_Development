// LOCAL STORAGE DATA
// -------------------------------------------------

let usersDB = JSON.parse(localStorage.getItem("usersDB")) || {};
let accountsDB = JSON.parse(localStorage.getItem("accountsDB")) || {};
let transactionsDB = JSON.parse(localStorage.getItem("transactionsDB")) || {};
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let selectedAccountType = null;


// SAVE DATA
// -------------------------------------------------

function save() {
  localStorage.setItem("usersDB", JSON.stringify(usersDB));
  localStorage.setItem("accountsDB", JSON.stringify(accountsDB));
  localStorage.setItem("transactionsDB", JSON.stringify(transactionsDB));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}


// POPUP HELPER WITHOUT BOOTSTRAP JS
// -------------------------------------------------

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


// MESSAGE HELPER
// -------------------------------------------------

function showToast(message, type = "primary") {
  alert(message);
}


// CLOSE MODALS
// -------------------------------------------------

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


// MOBILE NAV
// -------------------------------------------------

$(document).on("click", "#navToggle", function () {
  $("#mainNav").toggleClass("open");
});


// TRANSACTION HISTORY
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
// -------------------------------------------------

$(document).on("input", "#signupPassword", function () {
  let password = $(this).val();

  let strong =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  $("#passwordHelp").toggleClass("d-none", strong);
});


// SIGN UP
// -------------------------------------------------

$(document).on("submit", "#signUpForm", function (e) {
  e.preventDefault();

  let username = $("#signupUsername").val().trim();
  let email = $("#signupEmail").val().trim();
  let password = $("#signupPassword").val();
  let confirmPassword = $("#confirmPassword").val();

  if (!username || !email || !password || !confirmPassword) {
    showToast("Please fill in all fields", "warning");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "danger");
    return;
  }

  let strong =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  if (!strong) {
    showToast("Password must be 8+ characters with uppercase, lowercase, number and symbol", "danger");
    return;
  }

  if (usersDB[username]) {
    showToast("Username already exists", "danger");
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

  popup("authPopup")?.hide();

  updateUI();
  addTransaction("User account created");
  showToast("Account created successfully", "success");

  renderAccounts();

  $("#signUpForm")[0].reset();
});


// LOGIN
// -------------------------------------------------

$(document).on("submit", "#signInForm", function (e) {
  e.preventDefault();

  let username = $("#loginUsername").val().trim();
  let password = $("#loginPassword").val();

  if (!usersDB[username] || usersDB[username].password !== password) {
    showToast("Incorrect username or password", "danger");
    return;
  }

  currentUser = { username: username };
  save();

  popup("authPopup")?.hide();

  updateUI();
  addTransaction("User logged in");
  showToast("Login successful", "success");

  renderAccounts();

  $("#signInForm")[0].reset();
});


// OPEN LOGIN / SIGN UP POPUP
// -------------------------------------------------

$(document).on("click", "#signInBtn, #signUpBtn", function (e) {
  e.preventDefault();

  if (currentUser && this.id === "signInBtn") {
    showToast("You are already signed in", "info");
    return;
  }

  popup("authPopup")?.show();
});


// SIGN OUT
// -------------------------------------------------

$(document).on("click", "#signOutBtn", function (e) {
  e.preventDefault();

  localStorage.removeItem("currentUser");
  currentUser = null;

  updateUI();

  $("#accountList").html("");
  $("#transactionList").html("");
  $("#totalBalance").text("£0.00");

  showToast("Signed out", "secondary");
});


// ACCOUNT INFORMATION
// -------------------------------------------------

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


// NUMBER GENERATORS
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
// -------------------------------------------------

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

  selectedAccountType = type;

  $("#infoPopupText").text(accountInfo[type]);
  popup("infoPopup")?.show();
});


// CONTINUE FROM ACCOUNT INFORMATION POPUP
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
// -------------------------------------------------

$(document).on("submit", "#accountForm", function (e) {
  e.preventDefault();

  if (!currentUser) {
    showToast("Please sign in first", "warning");
    return;
  }

  let user = currentUser.username;
  let type = $("#accountType").val();
  let amount = Number($("input[name=deposit]").val()) || 0;

  if (!accountsDB[user]) {
    accountsDB[user] = [];
  }

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
  renderAccounts();
});


// DELETE ACCOUNT
// -------------------------------------------------

$(document).on("click", ".delete", function () {
  if (!currentUser) {
    return;
  }

  let id = $(this).data("id");

  accountsDB[currentUser.username] =
    accountsDB[currentUser.username].filter(a => a.id != id);

  save();

  showToast("Account deleted", "danger");
  addTransaction("Account deleted");

  renderAccounts();
});


// REQUEST CARD
// -------------------------------------------------

$(document).on("click", ".request-card", function () {
  if (!currentUser) {
    return;
  }

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
// -------------------------------------------------

$(document).on("click", ".pay-mortgage", function () {
  if (!currentUser) {
    return;
  }

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
// -------------------------------------------------

$(document).on("submit", "#mortgagePaymentForm", function (e) {
  e.preventDefault();

  if (!currentUser) {
    return;
  }

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

    form.find(".success-text").fadeIn();

    setTimeout(function () {
      form[0].reset();
      form.find("input").css("border-color", "");
    }, 1000);

    setTimeout(function () {
      form.find(".success-text").fadeOut();
    }, 3000);
  });



  // SEARCH


  $("#searchInput").on("input", function () {
    const query    = $(this).val().toLowerCase().trim();
    const $results = $("#searchResults").show().empty();

    if (query.length < 2) return;

    $("h1, h2, h3, p, li").each(function () {
      const $el = $(this);
      if ($el.text().toLowerCase().includes(query)) {
        $("<a href='#'></a>")
          .text($el.text().substring(0, 40) + "...")
          .on("click", function (e) {
            e.preventDefault();
            
            $("#searchResults").empty().hide();  
            $("#searchInput").blur();   

            $("html, body").animate({ scrollTop: $el.offset().top - 100 }, 500);
            $el.css("background", "yellow");
            setTimeout(function () { $el.css("background", "none"); }, 2000);
          })
          .appendTo($results);
      }
    });

    if ($results.is(":empty")) {
      $results.append("<p>No results found</p>");
    }
  });


  // IMAGE SLIDER

$(document).ready(function () {
  let sliderIndex = 0;
  const $slides   = $(".slider-img");

  if ($slides.length) {
    setInterval(function () {
      $slides.removeClass("active");
      sliderIndex = (sliderIndex + 1) % $slides.length;
      $slides.eq(sliderIndex).addClass("active");
    }, 3000);
  }


  
  

});