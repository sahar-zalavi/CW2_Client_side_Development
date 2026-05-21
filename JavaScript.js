$(document).ready(function () {

  let usersDB = JSON.parse(localStorage.getItem("usersDB")) || {};
  let accountsDB = JSON.parse(localStorage.getItem("accountsDB")) || {};
  let transactionsDB = JSON.parse(localStorage.getItem("transactionsDB")) || {};
  let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

  let selectedAccountType = null;

  const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const studentIdRegex = /^[Bb]\d{8}$/;
  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

  function save() {
    localStorage.setItem("usersDB", JSON.stringify(usersDB));
    localStorage.setItem("accountsDB", JSON.stringify(accountsDB));
    localStorage.setItem("transactionsDB", JSON.stringify(transactionsDB));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  function refreshCurrentUser() {
    currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
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

  function updateUI() {

    refreshCurrentUser();

    if (currentUser) {

      $("#signInBtn")
        .text("Account")
        .css("pointer-events", "none");

      $("#signUpBtn").hide();
      $("#signOutBtn").show();

    } else {

      $("#signInBtn")
        .text("Sign in")
        .css({
          "pointer-events": "auto",
          "color": ""
        });

      $("#signUpBtn").show();
      $("#signOutBtn").hide();
    }

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

    save();
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

      $("#accountList").html(`
        <p>Please sign in to view your accounts.</p>
      `);

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

      $("#accountList").html(`
        <p>No accounts opened yet.</p>
      `);

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

                <p>
                  Total mortgage:
                  £${Number(account.mortgageTotal).toFixed(2)}
                </p>

                <p class="balance">
                  Remaining:
                  £${Number(account.mortgageRemaining).toFixed(2)}
                </p>

                <p>
                  Account No:
                  ${account.accountNumber}
                </p>

              </div>

              <div>

                <button class="btn-success btn-sm pay-mortgage"
                        data-id="${account.id}">

                  Pay Mortgage

                </button>

                <button class="btn-danger btn-sm delete"
                        data-id="${account.id}">

                  Delete

                </button>

              </div>

            </div>
          `;
        }

        return `

          <div class="account-card">

            <div class="info">

              <span class="badge">${account.type}</span>

              <h3>${account.name}</h3>

              <p class="balance">
                £${Number(account.balance).toFixed(2)}
              </p>

              <p>
                Account No:
                ${account.accountNumber}
              </p>

              <p>
                Sort Code:
                ${account.sortCode}
              </p>

              <p>
                Card:
                ${account.hasCard ? account.cardNumber : "No card requested"}
              </p>

            </div>

            <div>

              <button class="btn-success btn-sm request-card"
                      data-id="${account.id}">

                Request Card

              </button>

              <button class="btn-danger btn-sm delete"
                      data-id="${account.id}">

                Delete

              </button>

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
      "MORTGAGE ACCOUNT\n\nA long-term home loan account."
  };

  $("#navToggle").on("click", function () {
    $("#mainNav").toggleClass("open");
  });

  $("#mainNav a")
    .not("#signInBtn, #signUpBtn, #signOutBtn")
    .on("click", function () {

      if ($(window).width() <= 768) {
        $("#mainNav").removeClass("open");
      }
    });

  $("#signInBtn, #signUpBtn").on("click", function (e) {

    e.preventDefault();
    e.stopPropagation();

    if (currentUser && this.id === "signInBtn") return;

    const isSignIn = this.id === "signInBtn";
    const target = isSignIn ? "#signInBox" : "#signUpBox";
    const other = isSignIn ? "#signUpBox" : "#signInBox";

    $(other).hide();
    $(target).stop().toggle();
  });

  $(document).on("click", function (e) {

    if (!$(e.target).closest(".nav-dropdown").length) {
      $(".nav-dropdown-content").hide();
    }
  });

  $(".nav-dropdown-content").on("click", function (e) {
    e.stopPropagation();
  });

  $("#signInForm").on("submit", function (e) {

    e.preventDefault();

    const form = $(this);

    const user = $("#loginUsername").val().trim();
    const pass = $("#loginPassword").val();

    form.find(".signin-error, .signin-success").remove();

    const showSignInError = function (msg) {

      form.append(`
        <p class="signin-error"
           style="color:red;font-size:0.85rem;margin-top:8px;">

          ⚠️ ${msg}

        </p>
      `);
    };

    if (!usernameRegex.test(user)) {
      return showSignInError("Username must be 4–20 letters or numbers.");
    }

    if (!passwordRegex.test(pass)) {
      return showSignInError("Password is not strong enough.");
    }

    if (!usersDB[user]) {

      usersDB[user] = {
        password: pass
      };
    }

    currentUser = {
      username: user
    };

    if (!accountsDB[user]) accountsDB[user] = [];
    if (!transactionsDB[user]) transactionsDB[user] = [];

    localStorage.setItem("lastUsername", user);

    save();

    form.append(`
      <p class="signin-success"
         style="color:green;font-size:0.9rem;margin-top:8px;">

        ✅ Signed in successfully!

      </p>
    `);

    setTimeout(function () {

      form[0].reset();

      $("#signInBox").hide();

      updateUI();

    }, 1000);
  });

  $("#signUpForm").on("submit", function (e) {

    e.preventDefault();

    const form = $(this);

    const user = $("#signupUsername").val().trim();
    const email = $("#signupEmail").val().trim();
    const pass = $("#signupPassword").val();
    const conf = $("#confirmPassword").val();

    form.find(".signup-error, .signup-success").remove();

    const showError = function (msg) {

      form.append(`
        <p class="signup-error"
           style="color:red;font-size:0.85rem;margin-top:8px;">

          ⚠️ ${msg}

        </p>
      `);
    };

    if (!usernameRegex.test(user)) {
      return showError("Username must be 4–20 alphanumeric characters.");
    }

    if (!emailRegex.test(email)) {
      return showError("Please enter a valid email address.");
    }

    if (!passwordRegex.test(pass)) {
      return showError("Password must be 8+ chars with upper, lower, digit & symbol.");
    }

    if (pass !== conf) {
      return showError("Passwords do not match.");
    }

    usersDB[user] = {
      email: email,
      password: pass
    };

    currentUser = {
      username: user
    };

    if (!accountsDB[user]) accountsDB[user] = [];
    if (!transactionsDB[user]) transactionsDB[user] = [];

    save();

    form.append(`
      <p class="signup-success"
         style="color:green;font-size:0.9rem;margin-top:8px;">

        ✅ Account created successfully!

      </p>
    `);

    setTimeout(function () {

      form[0].reset();

      $("#signUpBox").hide();

      updateUI();

      addTransaction("User account created");

    }, 1000);
  });

  $("#signOutBtn").on("click", function (e) {

    e.preventDefault();

    currentUser = null;

    localStorage.removeItem("currentUser");
    localStorage.removeItem("lastUsername");

    $("#signOutBtn").hide();

    $("#loginUsername").val("");
    $("#loginPassword").val("");

    $("#signInBox, #signUpBox").hide();

    updateUI();
  });

  $(document).on("click", ".open-account", function () {

    refreshCurrentUser();

    if (!currentUser) {
      showToast("Please sign in first");
      return;
    }

    let type = $(this).data("type");

    selectedAccountType = type;

    $("#infoPopupText").text(accountInfo[type]);

    popup("infoPopup")?.show();
  });

  $(document).on("click", "#continueAccountBtn", function () {

    popup("infoPopup")?.hide();

    $("#accountType").val(selectedAccountType);

    popup("accountPopup")?.show();
  });

  $(document).on("submit", "#accountForm", function (e) {

    e.preventDefault();

    refreshCurrentUser();

    if (!currentUser) return;

    let user = currentUser.username;

    let type = $("#accountType").val();

    let amount = Number($("input[name=deposit]").val()) || 0;

    if (!accountsDB[user]) {
      accountsDB[user] = [];
    }

    accountsDB[user].push({

      id: Date.now(),

      type: type,

      name: type + " Account",

      balance: amount,

      accountNumber: generateAccountNumber(),

      sortCode: generateSortCode(),

      hasCard: false,

      cardNumber: null
    });

    save();

    popup("accountPopup")?.hide();

    this.reset();

    renderAccounts();

    addTransaction(`${type} created`);
  });

  $(document).on("click", ".delete", function () {

    refreshCurrentUser();

    if (!currentUser) return;

    let id = $(this).data("id");

    accountsDB[currentUser.username] =
      accountsDB[currentUser.username].filter(a => a.id != id);

    save();

    renderAccounts();

    addTransaction("Account deleted");
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

  $("#searchInput").on("input", function () {

    const query = $(this).val().toLowerCase().trim();

    const $results = $("#searchResults").show().empty();

    if (query.length < 2) {
      $results.hide();
      return;
    }

    $("h1, h2, h3, p, li").each(function () {

      const $el = $(this);

      if ($el.text().toLowerCase().includes(query)) {

        $("<a href='#'></a>")

          .text($el.text().substring(0, 40) + "...")

          .on("click", function (e) {

            e.preventDefault();

            $("#searchResults").empty().hide();

            $("html, body").animate({

              scrollTop: $el.offset().top - 100

            }, 500);
          })

          .appendTo($results);
      }
    });
  });

  let sliderIndex = 0;

  const $slides = $(".slider-img");

  if ($slides.length) {

    setInterval(function () {

      $slides.removeClass("active");

      sliderIndex = (sliderIndex + 1) % $slides.length;

      $slides.eq(sliderIndex).addClass("active");

    }, 3000);
  }

  updateUI();

});