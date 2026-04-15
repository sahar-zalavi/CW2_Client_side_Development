$(document).ready(function () {

  const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  
  $("#signInBtn, #signUpBtn").on("click", function (e) {
    e.preventDefault();
    const isSignIn = this.id === "signInBtn";
    const target = isSignIn ? "#signInBox" : "#signUpBox";
    const other = isSignIn ? "#signUpBox" : "#signInBox";

    $(other).hide();
    $(target).stop().toggle();
  });

 
  $(document).on("click", (e) => {
    if (!$(e.target).closest(".dropdown").length) $(".dropdown-content").hide();
  });

  // Sign In Submission
  $("#signInForm").on("submit", function (e) {
    e.preventDefault();
    const user = $("#loginUsername").val().trim();
    const pass = $("#loginPassword").val();

    if (!usernameRegex.test(user) || !passwordRegex.test(pass)) {
      return alert("Invalid username or password format.");
    }

    // Success UI State
    $("#signInBox").hide();
    $("#signInBtn").text(`Welcome, ${user}`).css("pointer-events", "none");
    $("#signOutBtn").show();
    alert("Signed in successfully!");
  });

  // Sign Up Submission
  $("#signUpForm").on("submit", function (e) {
    e.preventDefault();
    const vals = {
      user: $("#signupUsername").val().trim(),
      email: $("#signupEmail").val().trim(),
      pass: $("#signupPassword").val(),
      conf: $("#confirmPassword").val()
    };

    if (!usernameRegex.test(vals.user)) return alert("Username: 4-20 alphanumeric characters.");
    if (!emailRegex.test(vals.email)) return alert("Please enter a valid email.");
    if (!passwordRegex.test(vals.pass)) return alert("Password must be strong (8+ chars, upper, lower, digit, symbol).");
    if (vals.pass !== vals.conf) return alert("Passwords do not match!");

    alert("Account created successfully!");
    $("#signUpBox").hide();
  });

  // Sign Out
  $("#signOutBtn").on("click", function (e) {
    e.preventDefault();
    $("#signInBtn").text("Sign in").css("pointer-events", "auto");
    $(this).hide();
    alert("Signed out.");
  });

  
  $("#searchInput").on("input", function () {
    const query = $(this).val().toLowerCase().trim();
    const $results = $("#searchResults").empty();

    if (query.length < 2) return;

    $("h1, h2, h3, p, li").each(function () {
      const $el = $(this);
      if ($el.text().toLowerCase().includes(query)) {
        $("<a href='#'></a>")
          .text($el.text().substring(0, 40) + "...")
          .on("click", (e) => {
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
});