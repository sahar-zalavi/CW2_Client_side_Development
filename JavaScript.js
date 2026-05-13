$(document).ready(function () {

  // =====================
  // HAMBURGER MENU
  // =====================
  $("#navToggle").on("click", function () {
    $("#mainNav").toggleClass("open");
  });

  // Close nav when a link is clicked on mobile
  $("#mainNav a").not("#signInBtn, #signUpBtn, #signOutBtn").on("click", function () {
  if ($(window).width() <= 768) {
    $("#mainNav").removeClass("open");
  }
});
  // =====================
  // VALIDATION RULES
  // =====================
  const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  // =====================
  // SIGN IN / SIGN UP DROPDOWNS
  // =====================
  $("#signInBtn, #signUpBtn").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const isSignIn = this.id === "signInBtn";
    const target = isSignIn ? "#signInBox" : "#signUpBox";
    const other  = isSignIn ? "#signUpBox" : "#signInBox";

    $(other).hide();
    $(target).stop().toggle();
  });

  // Close dropdowns when clicking outside
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".nav-dropdown").length) {
      $(".nav-dropdown-content").hide();
    }
  });

  // Prevent clicks inside the form from closing the dropdown
  $(".nav-dropdown-content").on("click", function (e) {
    e.stopPropagation();
  });

  // =====================
  // SIGN IN SUBMISSION
  // =====================
  $("#signInForm").on("submit", function (e) {
    e.preventDefault();
    const user = $("#loginUsername").val().trim();
    const pass = $("#loginPassword").val();

    if (!usernameRegex.test(user)) {
      return alert("Username must be 4–20 letters or numbers.");
    }
    if (!passwordRegex.test(pass)) {
      return alert("Password is not strong enough.");
    }

    $("#signInBox").hide();
    $("#signInBtn").text("Account").css("pointer-events", "none");
    $("#signOutBtn").show();
    alert("Signed in successfully!");
  });

  // =====================
  // SIGN OUT
  // =====================
  $("#signOutBtn").on("click", function (e) {
    e.preventDefault();
    $("#signInBtn").text("Sign in").css("pointer-events", "auto");
    $("#signOutBtn").hide();
    $("#loginUsername").val("");
    $("#loginPassword").val("");
    $("#signInBox, #signUpBox").hide();
    localStorage.removeItem("lastUsername");
    alert("Signed out.");
  });

  // =====================
  // SIGN UP SUBMISSION
  // =====================
  $("#signUpForm").on("submit", function (e) {
    e.preventDefault();
    const vals = {
      user:  $("#signupUsername").val().trim(),
      email: $("#signupEmail").val().trim(),
      pass:  $("#signupPassword").val(),
      conf:  $("#confirmPassword").val()
    };

    if (!usernameRegex.test(vals.user))  return alert("Username: 4-20 alphanumeric characters.");
    if (!emailRegex.test(vals.email))    return alert("Please enter a valid email.");
    if (!passwordRegex.test(vals.pass))  return alert("Password must be strong (8+ chars, upper, lower, digit, symbol).");
    if (vals.pass !== vals.conf)         return alert("Passwords do not match!");

    alert("Account created successfully!");
    $("#signUpBox").hide();
  });

  // =====================
  // SEARCH
  // =====================
  $("#searchInput").on("input", function () {
    const query = $(this).val().toLowerCase().trim();
    const $results = $("#searchResults").empty();

    if (query.length < 2) return;

    $("h1, h2, h3, p, li").each(function () {
      const $el = $(this);
      if ($el.text().toLowerCase().includes(query)) {
        $("<a href='#'></a>")
          .text($el.text().substring(0, 40) + "...")
          .on("click", function (e) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: $el.offset().top - 100 }, 500);
            $el.css("background", "yellow");
            setTimeout(() => $el.css("background", "none"), 2000);
          })
          .appendTo($results);
      }
    });

    if ($results.is(":empty")) $results.append("<p>No results found</p>");
  });

  // =====================
  // IMAGE SLIDER
  // =====================
  let index = 0;
  const slides = $(".slider-img");

  setInterval(function () {
    slides.removeClass("active");
    index = (index + 1) % slides.length;
    slides.eq(index).addClass("active");
  }, 3000);

  // =====================
  // TRUST / JOURNEY TOGGLES
  // =====================
  $(document).ready(function () {

  // =====================
  // TRUST / JOURNEY (unchanged)
  // =====================
  $(".trust-toggle").on("click", function () {
    $(".trust-points").slideToggle();
  });

  $(".journey-btn").on("click", function () {
    $(".journey-text").hide();
    $($(this).data("target")).fadeIn();
  });

  // =====================
  // REGEX PATTERNS
  // =====================
  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  $(document).ready(function () {

  // =====================
  // REGEX PATTERNS
  // =====================
  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
  const studentIdRegex = /^[A-Za-z0-9]{5,15}$/;

  // =====================
  // LIVE VALIDATION (WHILE TYPING)
  // =====================
  $(".loan-form input").on("input", function () {
    const input = $(this);
    const value = input.val().trim();
    const type = input.attr("type");
    let isValid = true;

    // Required check
    if (input.prop("required") && value === "") {
      isValid = false;
    }

    // Name validation
    if (input.attr("placeholder")?.toLowerCase().includes("name")) {
      isValid = nameRegex.test(value);
    }

    // Email validation
    if (type === "email") {
      isValid = emailRegex.test(value);
    }

    // Student ID validation
    if (input.attr("id") === "studentId") {
      isValid = studentIdRegex.test(value);
    }

    // Loan amount / number validation
    if (type === "number" || input.attr("placeholder")?.includes("£")) {
      isValid = numberRegex.test(value) && Number(value) > 0;
    }

    // Visual feedback
    input.removeClass("input-valid input-error");
    if (value !== "") {
      input.addClass(isValid ? "input-valid" : "input-error");
    }
  });

  // =====================
  // LOAN FORM SUBMISSION
  // =====================
  $(".loan-form").on("submit", function (e) {
    e.preventDefault();

    const form = $(this);
    let isValid = true;

    // Hide messages
    form.find(".error-text").hide();
    form.find(".success-text").hide();

    form.find("input[required]").each(function () {
      const input = $(this);
      const value = input.val().trim();
      const type = input.attr("type");

      if (value === "") isValid = false;

      if (input.attr("placeholder")?.toLowerCase().includes("name")) {
        if (!nameRegex.test(value)) isValid = false;
      }

      if (type === "email") {
        if (!emailRegex.test(value)) isValid = false;
      }

      if (type === "number" || input.attr("placeholder")?.includes("£")) {
        if (!numberRegex.test(value) || Number(value) <= 0) isValid = false;
      }

      if (input.attr("id") === "studentId") {
        if (!studentIdRegex.test(value)) isValid = false;
      }
    });

    // Final result
    if (!isValid) {
      form.find(".error-text").fadeIn();
    } else {
    form.closest("details").next(".success-text").fadeIn();
 
      form[0].reset();
      form.find("input").removeClass("input-valid input-error");
    }
  });

});