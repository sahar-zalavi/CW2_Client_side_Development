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

    if (!usernameRegex.test(user))  {
      return alert("Username must be 4–20 letters or numbers.");
    }

    if (!passwordRegex.test(pass)) {
       alert("Password is not strong enough.");
       return;
  }

   
    $("#signInBox").hide();
   
$("#signInBtn").text("Account").css("pointer-events", "none");
    $("#signOutBtn").show();
    alert("Signed in successfully!");
  });
  
//sign out
$("#signOutBtn").on("click", function (e) {
  e.preventDefault();

  $("#signInBtn")
    .text("Sign in")
    .css("pointer-events", "auto");

  $("#signOutBtn").hide();

  $("#loginUsername").val("");
  $("#loginPassword").val("");

  $("#signInBox, #signUpBox").hide();

  localStorage.removeItem("lastUsername");

  alert("Signed out.");
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



  //search input 
  
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

//images

$(document).ready(function () {
  $(".trust-toggle").on("click", function () {
    $(".trust-points").slideToggle();
  });
});

$(document).ready(function () {
  $(".journey-btn").on("click", function () {
    $(".journey-text").hide();
    $($(this).data("target")).fadeIn();
  });
});


$(document).ready(function () {
  let index = 0;
  const slides = $(".slider-img");

  setInterval(function () {
    slides.removeClass("active");
    index = (index + 1) % slides.length;
    slides.eq(index).addClass("active");
  }, 3000); // change every 3 seconds
});

//products
$(document).ready(function () {
  $(".loan-form").on("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    const form = $(this);

    form.find("input[required]").each(function () {
      if ($(this).val().trim() === "") {
        isValid = false;
      }
    });

    if (!isValid) {
      form.find(".error-text").fadeIn();
    } else {
      form.find(".error-text").fadeOut();
      alert("Your application has been submitted successfully.");
      form[0].reset();
    }
  });
});