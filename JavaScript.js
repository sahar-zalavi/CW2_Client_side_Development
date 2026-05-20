$(document).ready(function () {

  
  // REGEX PATTERNS 
 

  const usernameRegex  = /^[a-zA-Z0-9]{4,20}$/;
  const emailRegex     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const studentIdRegex = /^[Bb]\d{8}$/;
  const nameRegex      = /^[A-Za-z\s]{2,50}$/;
  const numberRegex    = /^[0-9]+(\.[0-9]{1,2})?$/;


 
  // HAMBURGER MENU


  $("#navToggle").on("click", function () {
    $("#mainNav").toggleClass("open");
  });

  $("#mainNav a").not("#signInBtn, #signUpBtn, #signOutBtn").on("click", function () {
    if ($(window).width() <= 768) {
      $("#mainNav").removeClass("open");
    }
  });


 
  // SIGN IN / SIGN UP DROPDOWNS


  $("#signInBtn, #signUpBtn").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const isSignIn = this.id === "signInBtn";
    const target   = isSignIn ? "#signInBox" : "#signUpBox";
    const other    = isSignIn ? "#signUpBox" : "#signInBox";

    if (isSignIn) {
      const saved = localStorage.getItem("lastUsername");
      if (saved) {
        $("#loginUsername").val(saved);
        setTimeout(function () { $("#loginPassword").focus(); }, 50);
      }
    }

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


 
  // SIGN IN SUBMISSION
 

  $("#signInForm").on("submit", function (e) {
    e.preventDefault();

    const form = $(this);
    const user = $("#loginUsername").val().trim();
    const pass = $("#loginPassword").val();

    form.find(".signin-error, .signin-success").remove();

    const showSignInError = function (msg) {
      form.append('<p class="signin-error" style="color:red;font-size:0.85rem;margin-top:8px;">⚠️ ' + msg + "</p>");
    };

    if (!usernameRegex.test(user)) return showSignInError("Username must be 4–20 letters or numbers.");
    if (!passwordRegex.test(pass)) return showSignInError("Password is not strong enough.");

    localStorage.setItem("lastUsername", user);
    form.append('<p class="signin-success" style="color:green;font-size:0.9rem;margin-top:8px;">✅ Signed in successfully!</p>');

    setTimeout(function () {
      form.find(".signin-success").remove();
      form[0].reset();
      $("#signInBox").hide();
      $("#signInBtn").text("Account").css("pointer-events", "none");
      $("#signOutBtn").show();
    }, 1500);
  });



  // SIGN OUT


  $("#signOutBtn").on("click", function (e) {
    e.preventDefault();

    $("#signOutBtn").hide();
    $("#loginUsername").val("");
    $("#loginPassword").val("");
    $("#signInBox, #signUpBox").hide();
    localStorage.removeItem("lastUsername");

    var $btn = $("#signInBtn");
    $btn.text("Signed out").css({ "pointer-events": "none", "color": "green" });
    setTimeout(function () {
      $btn.text("Sign in").css({ "pointer-events": "auto", "color": "" });
    }, 1500);
  });


  // SIGN UP SUBMISSION


  $("#signUpForm").on("submit", function (e) {
    e.preventDefault();

    const form  = $(this);
    const user  = $("#signupUsername").val().trim();
    const email = $("#signupEmail").val().trim();
    const pass  = $("#signupPassword").val();
    const conf  = $("#confirmPassword").val();

    form.find(".signup-error, .signup-success").remove();

    const showError = function (msg) {
      form.append('<p class="signup-error" style="color:red;font-size:0.85rem;margin-top:8px;">⚠️ ' + msg + "</p>");
    };

    if (!usernameRegex.test(user))  return showError("Username must be 4–20 alphanumeric characters.");
    if (!emailRegex.test(email))    return showError("Please enter a valid email address.");
    if (!passwordRegex.test(pass))  return showError("Password must be 8+ chars with upper, lower, digit & symbol.");
    if (pass !== conf)              return showError("Passwords do not match.");

    form.append('<p class="signup-success" style="color:green;font-size:0.9rem;margin-top:8px;">✅ Account created successfully!</p>');

    setTimeout(function () {
      form[0].reset();
      form.find(".signup-success").fadeOut(400, function () { $(this).remove(); });
      $("#signUpBox").hide();
    }, 2000);
  });


 
  // MONEY INPUT 


  $(".money-input").on("focus", function () {
    this.value = this.value.replace(/[^0-9.]/g, "");
  });

  $(".money-input").on("blur", function () {
    let value = this.value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) value = parts[0] + "." + parts[1];

    const number = parseFloat(value);
    if (!isNaN(number) && value !== "") {
      this.value = number.toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      this.value = "";
    }
  });


 
  // STUDENT


  $("#studentId").on("input", function () {
    const value = this.value.toUpperCase();
    this.value  = value;

    if (value.length === 0) {
      $("#studentIdError").hide();
      $(this).css("border-color", "");
      return;
    }

    if (!studentIdRegex.test(value)) {
      $("#studentIdError").show();
      $(this).css("border-color", "red");
    } else {
      $("#studentIdError").hide();
      $(this).css("border-color", "green");
    }
  });


 
  // LOAN FORM SUBMISSION 
 

  $(".loan-form").on("submit", function (e) {
    e.preventDefault();

    const form    = $(this);
    let   isValid = true;

    form.find(".success-text, .error-text").hide();
    form.find("input").css("border-color", "");

    form.find("input[required]").each(function () {
      const input      = $(this);
      const value      = input.val().trim();
      const type       = input.attr("type");
      const ph         = (input.attr("placeholder") || "").toLowerCase();
      let   fieldValid = true;

      if (value === "") {
        fieldValid = false;
      } else {
        if (ph.includes("name")) {
          if (!nameRegex.test(value)) fieldValid = false;
        }
        if (type === "email") {
          if (!emailRegex.test(value)) fieldValid = false;
        }
        if (input.hasClass("money-input") || type === "number") {
          const raw = value.replace(/[^0-9.]/g, "");
          if (!numberRegex.test(raw) || Number(raw) <= 0) fieldValid = false;
        }
        if (input.hasClass("studentId") || input.attr("id") === "studentId") {
          if (!studentIdRegex.test(value)) {
            fieldValid = false;
            form.find(".studentIdError").show();
          }
        }
      }

      input.css("border-color", fieldValid ? "green" : "red");
      if (!fieldValid) isValid = false;
    });

    if (!isValid) {
      form.find(".error-text").fadeIn();
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