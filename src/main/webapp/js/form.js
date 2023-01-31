"use strict";

class Registration {
  constructor() {
    this.username = false;
    this.email = false;
    this.password = false;
    this.fname = false;
    this.lname = false;
    this.phone = true;
    this.city = true;
    this.address = true;
    this.student_id = false;
    this.id_date = true;
    this.uni = true;
    this.department = false;
    this.libname = false;
    this.libinfo = false;
    this.terms = false;
  }

  canRegisterStudent() {
    return (
      this.username &&
      this.email &&
      this.password &&
      this.fname &&
      this.lname &&
      this.phone &&
      this.city &&
      this.address &&
      this.student_id &&
      this.id_date &&
      this.uni &&
      this.department &&
      this.terms
    );
  }

  canRegisterLibrarian() {
    return (
      this.username &&
      this.email &&
      this.password &&
      this.fname &&
      this.lname &&
      this.phone &&
      this.city &&
      this.address &&
      this.libname &&
      this.libinfo &&
      this.terms
    );
  }

  resetRegistration() {
    this.username = false;
    this.email = false;
    this.password = false;
    this.fname = false;
    this.lname = false;
    this.phone = true;
    this.city = true;
    this.address = true;
    this.student_id = false;
    this.id_date = true;
    this.uni = true;
    this.department = false;
    this.libname = false;
    this.libinfo = false;
    this.terms = false;
  }
}

const registration = new Registration();

const objEmail = {
  domain: "uoc",
};

$("#sign-up-btn").click(function () {
  loadIndexPage(false);

  $("#content").load("html/signup.html", function () {
    refreshRegisterBtn();
    forUserType();
    forUsername();
    forEmail();
    forPassword();
    forFirstName();
    forLastName();
    forGender();
    forWebPage();
    forPhone();
    forCountry();
    forCity();
    forAddress();
    forStudentType();
    forID();
    forDates();
    forUni();
    forDepartment();
    forValidation();
    forLibname();
    forLibinfo();
    forTerms();
    forMap();
  });
  changeHeader("Sign Up");
});

function forLibinfo() {
  $("#libinfo-msg").toggle(false);
  $("#lib-info").change(function () {
    var info = $(this).val();
    if (info.length < 3 || info.length > 50) {
      $("#libinfo-msg").toggle(true).css("color", "red");
      msg("libinfo", "Library Info must be between 3 and 50 latin characters");
      registration.libinfo = false;
    } else {
      registration.libinfo = true;
      $("#libinfo-msg").toggle(false);
    }
    refreshRegisterBtn();
  });
}

function forLibname() {
  $("#libname-msg").toggle(false);
  $("#lib-name").change(function () {
    var name = $(this).val();
    if (name.length < 3 || name.length > 50) {
      $("#libname-msg").toggle(true).css("color", "red");
      msg("libname", "Library name must be between 3 and 50 latin characters");
      registration.libname = false;
    } else {
      registration.libname = true;
      $("#libname-msg").toggle(false);
    }
    refreshRegisterBtn();
  });
}

function forValidation() {
  $("#map-btn").click(function () {
    var toogle = $("#map-div").prop("hidden");
    $("#map-div").prop("hidden", !toogle);

    if (toogle) {
      $("#map-btn").text("Hide Map");
    } else {
      $("#map-btn").text("Show Map");
    }
  });

  $("#validate-btn").click(function () {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    var mapBtn = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        const response = JSON.parse(this.responseText);
        if (response.length > 0) {
          var lat = response[0].lat;
          var lon = response[0].lon;
          $("#lat").val(lat);
          $("#lon").val(lon);

          $("#validate-btn").addClass("disabled");

          $("#validate-info")
            .html(
              "<strong>Location Found</strong> <br><strong>Name:</strong> " +
                response[0].display_name +
                "<br><strong>Lat:</strong> " +
                lat +
                "<br><strong>Lon:</strong> " +
                lon
            )
            .css("color", "green")
            .css("margin", "15px")
            .css("border", " 2px solid green");

          var inCrete =
            response[0].display_name.includes("Κρήτης") ||
            response[0].display_name.includes("Crete");
          if (inCrete) {
            var addr = $("#address").val();
            var caddr = convertToEnglish(addr);
            mapBtn = false;
            $("#address").val(caddr);
            $("#validate-warning").html("");
          } else {
            $("#validate-warning")
              .html(
                "<strong>The service is only available in Crete right now</strong>"
              )
              .css("color", "red")
              .css("margin-bottom", "15px");
          }
        } else {
          $("#validate-info")
            .text("Invalid Location")
            .css("color", "red")
            .css("margin", "15px")
            .css("border", " 2px solid red");
        }
        $("#map-btn").prop("hidden", mapBtn);
      }
    });

    const location = getLocation();
    const apiKey = "03cce65e35msh4d9a125991b6a2bp18e5e3jsna68b13de7fb0";
    const url = `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1&key=${apiKey}`;

    xhr.open("GET", url);
    xhr.setRequestHeader(
      "X-RapidAPI-Key",
      "03cce65e35msh4d9a125991b6a2bp18e5e3jsna68b13de7fb0"
    );
    xhr.setRequestHeader(
      "X-RapidAPI-Host",
      "forward-reverse-geocoding.p.rapidapi.com"
    );

    xhr.send(data);
  });
}

function resetValidation() {
  $("#validate-info").html("").css("border", "none");
  $("#validate-warning").html("");
  $("#validate-btn").removeClass("disabled");
  $("#map-btn").text("Show Map");
  $("#map-btn").prop("hidden", true);
  $("#map").empty();
  $("#map-div").prop("hidden", true);
}

function forDepartment() {
  var field = "dep";

  $("#dep-msg").toggle(false);

  $("#dep-help").click(function () {
    $("#dep-help-info").toggle(true);
  });

  $("#dep-help").mouseleave(function () {
    $("#dep-help-info").toggle(false);
  });

  $("#dep").change(function () {
    var dep = $(this).val();
    var isValid = validLength(dep) && validContent(dep);

    if (isValid) {
      $("#dep-msg").toggle(false);
      registration.department = true;
    } else {
      $("#dep-msg").toggle(true).css("color", "red");
      registration.department = false;
    }
    refreshRegisterBtn();
  });

  function validLength(dep) {
    return (dep.length < 3 || dep.length > 50) &&
      msg(field, "Department must be between 3 and 50 latin characters")
      ? false
      : true;
  }

  function validContent(dep) {
    for (var i = 0; i < dep.length; ++i) {
      let c = dep[i];
      if (!isCharacter(c) && c !== " ") {
        msg(
          field,
          "Department must include only lower/ upper case latin characters and spaces"
        );
        return false;
      }
    }
    return true;
  }
}

function forUni() {
  $("#uni").change(function () {
    $("#email").change();
    refreshRegisterBtn();
  });
}

function forDates() {
  $("#id-date-msg").toggle(false);

  $("#id-sday-help").click(function () {
    $("#id-sday-help-info").toggle(true);
  });

  $("#id-sday-help").mouseleave(function () {
    $("#id-sday-help-info").toggle(false);
  });

  $("#id-eday-help").click(function () {
    $("#id-eday-help-info").toggle(true);
  });

  $("#id-eday-help").mouseleave(function () {
    $("#id-eday-help-info").toggle(false);
  });

  $("#id-sday").change(function () {
    checkDates();
    refreshRegisterBtn();
  });

  $("#id-eday").change(function () {
    checkDates();
    refreshRegisterBtn();
  });
}

function forID() {
  var field = "student_id";

  $("#student_id-msg").toggle(false);

  $("#student_id-help").click(function () {
    $("#student_id-help-info").toggle(true);
  });

  $("#student_id-help").mouseleave(function () {
    $("#student_id-help-info").toggle(false);
  });

  $("#student_id").change(function () {
    $("#student_id-msg").toggle(true);
    var id = $(this).val();
    var isValid = validLength(id) && validContent(id);

    if (!isValid) {
      $("#student_id-msg").css("color", "red");
      registration.student_id = false;
      return;
    }

    checkDB("student_id", id);
  });

  function validLength(id) {
    return id.length !== 12 &&
      msg(field, "Student ID must be exactly 12 digits")
      ? false
      : true;
  }

  function validContent(id) {
    for (var i = 0; i < id.length; ++i) {
      if (!isNumeric(id[i])) {
        msg(field, "Student ID must contain only numbers");
        return false;
      }
    }
    return true;
  }
}

function forStudentType() {
  $("#student-type").change(function () {
    checkDates();
    refreshRegisterBtn();
  });
}

function forAddress() {
  var field = "address";

  $("#address-help").click(function () {
    $("#address-help-info").toggle(true);
  });

  $("#address-help").mouseleave(function () {
    $("#address-help-info").toggle(false);
  });

  $("#address").change(function () {
    resetValidation();
    var address = $(this).val();
    if (address.length === 0) {
      $("#address-msg").toggle(false);
      registration.address = true;
      refreshRegisterBtn();
      return;
    }

    var isValid = validLength(address) && validContent(address);

    if (isValid) {
      $("#address-msg").toggle(false);
      registration.address = true;
    } else {
      $("#address-msg").toggle(true).css("color", "red");
      registration.address = false;
    }
    refreshRegisterBtn();
  });

  function validLength(address) {
    return (address.length < 3 || address.length > 50) &&
      msg(field, "Address must be between 5 and 50 latin characters")
      ? false
      : true;
  }

  function validContent(address) {
    for (var i = 0; i < address.length; ++i) {
      let c = address[i];
      if (
        !isCharacter(c) &&
        !isNumeric(c) &&
        c !== "." &&
        c !== "," &&
        c !== "-" &&
        c !== " "
      ) {
        msg(
          field,
          "Address must be a compination of upper case/ lower case characters, numbers, the . , - signs and spaces"
        );
        return false;
      }
    }
    return true;
  }
}

function forCity() {
  var field = "city";
  $("#city-help").click(function () {
    $("#city-help-info").toggle(true);
  });
  $("#city-help").mouseleave(function () {
    $("#city-help-info").toggle(false);
  });

  $("#city").change(function () {
    resetValidation();
    var city = $(this).val();
    if (city.length === 0) {
      $("#city-msg").toggle(false);
      registration.city = true;
      refreshRegisterBtn();
      return;
    }

    var isValid = validLength(city) && validContent(city);

    if (isValid) {
      $("#city-msg").toggle(false);
      registration.city = true;
    } else {
      $("#city-msg").toggle(true).css("color", "red");
      registration.city = false;
    }
    refreshRegisterBtn();
  });

  function validLength(city) {
    return (city.length < 3 || city.length > 50) &&
      msg(field, "City must be between 5 and 50 latin characters")
      ? false
      : true;
  }

  function validContent(city) {
    for (var i = 0; i < city.length; ++i) {
      if (!isCharacter(city[i])) {
        msg(field, "City must include only lower/ upper case latin characters");
        return false;
      }
    }
    return true;
  }
}

function forCountry() {
  $("#country").change(function () {
    resetValidation();
  });
}

function forPhone() {
  var field = "phone";

  $("#phone-help").click(function () {
    $("#phone-help-info").toggle(true);
  });

  $("#phone-help").mouseleave(function () {
    $("#phone-help-info").toggle(false);
  });

  $("#phone").change(function () {
    var phone = $(this).val();
    if (phone.length === 0) {
      $("#phone-msg").toggle(false);
      registration.phone = true;
      refreshRegisterBtn();
      return;
    }

    var isValid = validLength(phone) && validContent(phone);

    if (isValid) {
      $("#phone-msg").toggle(false);
      registration.phone = true;
    } else {
      $("#phone-msg").toggle(true).css("color", "red");
      registration.phone = false;
    }
    refreshRegisterBtn();
  });

  function validLength(phone) {
    return phone.length !== 10 &&
      msg(field, "Telephone must be exactly 10 digits")
      ? false
      : true;
  }

  function validContent(phone) {
    for (var i = 0; i < phone.length; ++i) {
      if (!isNumeric(phone[i])) {
        msg(field, "Telephone must contain only numbers");
        return false;
      }
    }
    return true;
  }
}

function forWebPage() {
  $("#page-help").click(function () {
    $("#page-help-info").toggle(true);
  });

  $("#page-help").mouseleave(function () {
    $("#page-help-info").toggle(false);
  });
}

function forTerms() {
  $("#terms").prop("required", true);

  $("#terms").change(function () {
    var terms = $("#terms").prop("checked");
    if (terms) {
      $("#terms-msg").toggle(false);
      registration.terms = true;
    } else {
      $("#terms-msg")
        .toggle(true)
        .text("You must agree to terms and conditions")
        .css("color", "red");
      registration.terms = false;
    }
    refreshRegisterBtn();
  });
}

function forGender() {
  $("#male-radio").prop("required", true);
}

function forLastName() {
  var field = "lname";

  $("#lname").prop("required", true);

  $("#lname-help").click(function () {
    $("#lname-help-info").toggle(true);
  });

  $("#lname-help").mouseleave(function () {
    $("#lname-help-info").toggle(false);
  });

  $("#lname").change(function () {
    var lname = $(this).val();
    var isValid = validLength(lname) && validContent(lname);

    $("#lname-msg").toggle(!isValid).css("color", "red");
    registration.lname = isValid;
    refreshRegisterBtn();
  });

  function validLength(lname) {
    return (lname.length < 3 || lname.length > 30) &&
      msg(field, "Last name must be between 3 and 30 latin characters")
      ? false
      : true;
  }

  function validContent(lname) {
    for (var i = 0; i < lname.length; ++i) {
      if (!isCharacter(lname[i])) {
        msg(
          field,
          "Last name must include only lower case and upper case latin characters"
        );
        return false;
      }
    }
    return true;
  }
}

function forFirstName() {
  var field = "fname";

  $("#fname").prop("required", true);

  $("#fname-help").click(function () {
    $("#fname-help-info").toggle(true);
  });

  $("#fname-help").mouseleave(function () {
    $("#fname-help-info").toggle(false);
  });

  $("#fname").change(function () {
    var fname = $(this).val();
    var isValid = validLength(fname) && validContent(fname);

    $("#fname-msg").toggle(!isValid).css("color", "red");
    registration.fname = isValid;
    refreshRegisterBtn();
  });

  function validLength(fname) {
    return (fname.length < 3 || fname.length > 30) &&
      msg(field, "First name must be between 3 and 30 latin characters")
      ? false
      : true;
  }

  function validContent(fname) {
    for (var i = 0; i < fname.length; ++i) {
      if (!isCharacter(fname[i])) {
        msg(
          field,
          "First name must include only lower case and upper case latin characters"
        );
        return false;
      }
    }
    return true;
  }
}

function forPassword() {
  var field = "password";

  $("#password").prop("required", true);

  $("#confirmPassword").prop("required", true);

  $("#password-help").click(function () {
    $("#password-help-info").toggle(true);
  });

  $("#password-help").mouseleave(function () {
    $("#password-help-info").toggle(false);
  });

  $("#confirmPassword-help").click(function () {
    $("#confirmPassword-help-info").toggle(true);
  });

  $("#confirmPassword-help").mouseleave(function () {
    $("#confirmPassword-help-info").toggle(false);
  });

  $("#password-btn").click(function () {
    var type = $("#password").prop("type");
    type === "password"
      ? $("#password").prop("type", "text")
      : $("#password").prop("type", "password");
  });

  $("#confirmPassword-btn").click(function () {
    var type = $("#confirmPassword").prop("type");
    type === "password"
      ? $("#confirmPassword").prop("type", "text")
      : $("#confirmPassword").prop("type", "password");
  });

  $("#password").change(function () {
    checkPasswords();
    refreshRegisterBtn();
  });

  $("#confirmPassword").change(function () {
    checkPasswords();
    refreshRegisterBtn();
  });

  function checkPasswords() {
    var password1 = $("#password").val();
    var password2 = $("#confirmPassword").val();

    if (password1.length === 0 || password2.length === 0) {
      registration.password = false;
      return;
    }
    var isValid =
      match(password1, password2) &&
      validLength(password1) &&
      validContent(password1) &&
      validSequence(password1);

    if (!isValid) {
      $("#password-msg").css("color", "red");
      registration.password = false;
      return;
    }

    var securityColor = securityPassword(password1);
    $("#password-msg").css("color", securityColor);
  }

  function match(password1, password2) {
    return password1 !== password2 && msg(field, "Passwords dont match")
      ? false
      : true;
  }

  function validLength(password) {
    return (password.length < 8 || password.length > 12) &&
      msg(field, "Password length must be between 8 and 12")
      ? false
      : true;
  }

  function validContent(password) {
    var hasChar = false;
    var hasNum = false;
    var hasSign = false;
    for (let i = 0; i < password.length; ++i) {
      let c = password[i];
      isCharacter(c) && (hasChar = true);
      isNumeric(c) && (hasNum = true);
      c === "~" && (hasSign = true);
      c === "!" && (hasSign = true);
      c === "?" && (hasSign = true);
      c === "@" && (hasSign = true);
      c === "#" && (hasSign = true);
      c === "$" && (hasSign = true);
      c === "%" && (hasSign = true);
      c === "&" && (hasSign = true);
      c === "." && (hasSign = true);
      c === "*" && (hasSign = true);
      c === "-" && (hasSign = true);
      c === "+" && (hasSign = true);
    }

    !hasChar && msg(field, "Password must include a latin character");
    !hasNum && msg(field, "Password must include a number");
    !hasSign && msg(field, "Password must include a sign");

    return hasChar && hasNum && hasSign;
  }

  function validSequence(password) {
    return (password.includes("helmepa") ||
      password.includes("uoc") ||
      password.includes("tuc")) &&
      msg(field, 'Dont include "helmepa" , "uoc" or "tuc" in your password')
      ? false
      : true;
  }

  function securityPassword(password) {
    var totalNums = 0;
    var totalSymbols = "";
    var lowCounter = 0;
    var upperCounter = 0;

    for (let i = 0; i < password.length; ++i) {
      let c = password[i];
      if (isNumeric(c)) {
        totalNums++;
      } else {
        if (isCharacter(c)) {
          c === c.toLowerCase() ? lowCounter++ : upperCounter++;
        } else {
          !totalSymbols.includes(c) && (totalSymbols += c);
        }
      }
    }

    if (totalNums >= (password.length / 2).toFixed(0)) {
      registration.password = false;
      msg(field, "Weak Password");
      return "red";
    } else if (lowCounter > 0 && upperCounter > 0 && totalSymbols.length > 1) {
      registration.password = true;
      msg(field, "Strong Password");
      return "green";
    } else {
      registration.password = true;
      msg(field, "Medium Password");
      return "orange";
    }
  }
}

function forEmail() {
  var field = "email";

  $("#email").prop("required", true);

  $("#email-help").click(function () {
    $("#email-help-info").toggle(true);
  });

  $("#email-help").mouseleave(function () {
    $("#email-help-info").toggle(false);
  });

  $("#email").change(function () {
    var email = $(this).val();
    var isValid = validLength(email) && validContent(email);

    $("#user-type").val() === "student" && (isValid = isValid && validDomain());

    if (!isValid) {
      $("#email-msg").css("color", "red");
      registration.email = false;
      return;
    }

    checkDB("email", email);
  });

  function validLength(email) {
    return email.length < 6 && msg(field, "Enter a valid email") ? false : true;
  }

  function validContent(email) {
    //prepei na exei @
    const array1 = email.split("@");
    if (array1.length === 1) {
      msg(field, "A valid email must contain the @ sign");
      return false;
    }

    //elegxw to 1o kommati
    var name = array1[0];
    for (let i = 0; i < name.length; ++i) {
      let c = name[i];
      if (
        !isCharacter(c) &&
        !isNumeric(c) &&
        c !== "." &&
        c !== "_" &&
        c !== "-"
      ) {
        msg(
          field,
          "A valid name for the email must contain a compination of upper case/ lower case characters, numbers and the . - _ signs"
        );
        return false;
      }
    }

    //meta to @ prepei na exei 2 h 3 kommatia
    var array2 = array1[1].split(".");
    if (array2.length < 2 || array2.length > 3) {
      msg("A valid email must have 2 or 3 domain segments");
      return false;
    }

    var param1, param2, param3;
    if (array2.length === 2) {
      //elegxo to 1o
      param1 = array2[0];
      if (param1.length < 2 || param1.length > 8) {
        msg(
          field,
          "A valid first domain segment must be between 2 and 8 latin characters"
        );
        return false;
      }
      for (let i = 0; i < param1.length; ++i) {
        let c = param1[i];
        if (!isCharacter(c) || c !== c.toLowerCase()) {
          msg(
            field,
            "A valid first domain segment must contain only lower case characters"
          );
          return false;
        }
      }

      //elegxo to 2o
      param2 = array2[1];
      if (param2.length < 2 || param2.length > 8) {
        msg(
          field,
          "A valid second domain segment must be between 2 and 8 latin characters"
        );
        return false;
      }
      for (let i = 0; i < param2.length; ++i) {
        let c = param2[i];
        if (!isCharacter(c) || c !== c.toLowerCase()) {
          msg(
            field,
            "A valid second domain segment must contain only lower case characters"
          );
          return false;
        }
      }

      objEmail["domain"] = param1;
    } else {
      //elegxo to 1o
      param1 = array2[0];
      for (let i = 0; i < param1.length; ++i) {
        let c = param1[i];
        if (!isCharacter(c) && !isNumeric(c) && c !== "-") {
          msg(
            field,
            "A valid first domain segment must contain a compination of upper/ lower case characters, numbers and the - sign"
          );
          return false;
        }
      }

      //elegxo to 2o
      param2 = array2[1];
      if (param2.length < 2 || param2.length > 8) {
        msg(
          field,
          "A valid second domain segment must be between 2 and 8 latin characters"
        );
        return false;
      }
      for (let i = 0; i < param2.length; ++i) {
        let c = param2[i];
        if (!isCharacter(c) || c !== c.toLowerCase()) {
          msg(
            field,
            "A valid second domain segment must contain only lower case characters"
          );
          return false;
        }
      }

      //elegxo to 3o
      param3 = array2[2];
      if (param3.length < 2 || param3.length > 8) {
        msg(
          field,
          "A valid third domain segment must be between 2 and 8 latin characters"
        );
        return false;
      }
      for (let i = 0; i < param3.length; ++i) {
        let c = param3[i];
        if (!isCharacter(c) || c !== c.toLowerCase()) {
          msg(
            field,
            "A third second domain segment must contain only lower case characters"
          );
          return false;
        }
      }

      objEmail["domain"] = param2;
    }

    return true;
  }

  function validDomain() {
    var uni = $("#uni").val();

    var validDomain = uni.toLowerCase() === objEmail["domain"];

    !validDomain &&
      msg(field, "Your email should be in the " + uni + ".gr domain!");

    return validDomain ? true : false;
  }
}

function forUsername() {
  var field = "username";

  $("#username").prop("required", true);

  $("#username-help").click(function () {
    $("#username-help-info").toggle(true);
  });

  $("#username-help").mouseleave(function () {
    $("#username-help-info").toggle(false);
  });

  $("#username").change(function () {
    var username = $(this).val();
    var isValid = validLength(username) && validContent(username);
    if (!isValid) {
      $("#username-msg").css("color", "red");
      registration.username = false;
      return;
    }

    checkDB("username", username);
  });

  function validLength(username) {
    return username.length < 8 &&
      msg(field, "Username must be over 8 latin characters")
      ? false
      : true;
  }

  function validContent(username) {
    for (let i = 0; i < username.length; ++i) {
      if (!isCharacter(username[i])) {
        msg(
          field,
          "Username must include only lower case and upper case latin characters"
        );
        return false;
      }
    }
    return true;
  }
}

function forUserType() {
  $("#user-type").change(function () {
    var type = $("#user-type").val();
    if (type === "student") {
      $("#special-section-title").text("For Students");
      $(".student-div").prop("hidden", false);
      $(".student-input").prop("required", true);
      $(".librarian-div").prop("hidden", true);
      $(".librarian-input").prop("required", false);
    } else {
      $("#special-section-title").text("For Librarians");
      $(".student-div").prop("hidden", true);
      $(".student-input").prop("required", false);
      $(".librarian-div").prop("hidden", false);
      $(".librarian-input").prop("required", true);
    }
    !($("#email").val() === "") && $("#email").change();
  });

  $("#user-type").change();
}

function msg(field, msg) {
  var element = "#" + field + "-msg";
  $(element).text(msg);
  return true;
}

function checkDates() {
  var sdate = $("#id-sday").val();
  var edate = $("#id-eday").val();
  sdate < edate
    ? (registration.id_date = true)
    : (registration.id_date = false);

  if (!registration.id_date) {
    $("#id-date-msg")
      .toggle(true)
      .text("Starting date cant be after ending date")
      .css("color", "red");
    return;
  }

  sdate = sdate.split("-");
  edate = edate.split("-");
  var type = $("#student-type").val();
  var limit;

  switch (type) {
    case "BSc":
      limit = 6;
      break;
    case "MSc":
      limit = 2;
      break;
    case "PhD":
      limit = 5;
      break;
  }

  Number(edate[0]) - Number(sdate[0]) <= limit
    ? (registration.id_date = true)
    : (registration.id_date = false);

  registration.id_date
    ? $("#id-date-msg").toggle(false)
    : $("#id-date-msg")
        .toggle(true)
        .text(
          "The expiration date for " +
            type +
            "'s ID must be " +
            limit +
            " years!"
        )
        .css("color", "red");
}

function refreshRegisterBtn() {
  var canRegister =
    $("#user-type").val() === "student"
      ? registration.canRegisterStudent()
      : registration.canRegisterLibrarian();

  canRegister
    ? $("#register-btn").prop("disabled", false)
    : $("#register-btn").prop("disabled", true);
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isCharacter(n) {
  return n.toLowerCase() !== n.toUpperCase();
}

function getLocation() {
  var address = $("#address").val();
  var city = $("#city").val();
  var countryVal = $("#country").val();

  var country = $("#country")
    .children('[value="' + countryVal + '"]')
    .text();

  return address + " " + city + " " + country;
}

const convertToEnglish = (str) => {
  var conv = "";
  for (let i = 0; i < str.length; ++i) {
    if (!isCharacter(str[i])) {
      conv += str[i];
    } else {
      switch (str[i]) {
        case "Α":
          conv += "A";
          break;
        case "Ά":
          conv += "A";
          break;
        case "α":
          conv += "a";
          break;
        case "ά":
          conv += "a";
          break;
        case "Β":
          conv += "B";
          break;
        case "β":
          conv += "b";
          break;
        case "Γ":
          conv += "G";
          break;
        case "γ":
          conv += "g";
          break;
        case "Δ":
          conv += "D";
          break;
        case "δ":
          conv += "d";
          break;
        case "Ε":
          conv += "E";
          break;
        case "Έ":
          conv += "E";
          break;
        case "ε":
          conv += "e";
          break;
        case "έ":
          conv += "e";
          break;
        case "Ζ":
          conv += "Z";
          break;
        case "ζ":
          conv += "z";
          break;
        case "Η":
          conv += "I";
          break;
        case "Ή":
          conv += "I";
          break;
        case "ή":
          conv += "i";
          break;
        case "η":
          conv += "i";
          break;
        case "Θ":
          conv += "Th";
          break;
        case "θ":
          conv += "th";
          break;
        case "Ι":
          conv += "I";
          break;
        case "Ί":
          conv += "I";
          break;
        case "Ϊ":
          conv += "I";
          break;
        case "ϊ":
          conv += "i";
          break;
        case "ί":
          conv += "i";
          break;
        case "ΐ":
          conv += "i";
          break;
        case "ι":
          conv += "i";
          break;
        case "Κ":
          conv += "K";
          break;
        case "κ":
          conv += "k";
          break;
        case "Λ":
          conv += "L";
          break;
        case "λ":
          conv += "l";
          break;
        case "Μ":
          conv += "M";
          break;
        case "μ":
          conv += "m";
          break;
        case "Ν":
          conv += "N";
          break;
        case "ν":
          conv += "n";
          break;
        case "Ξ":
          conv += "Ks";
          break;
        case "ξ":
          conv += "ks";
          break;
        case "Ο":
          conv += "O";
          break;
        case "Ό":
          conv += "O";
          break;
        case "ό":
          conv += "o";
          break;
        case "ο":
          conv += "o";
          break;
        case "Π":
          conv += "P";
          break;
        case "π":
          conv += "p";
          break;
        case "Ρ":
          conv += "R";
          break;
        case "ρ":
          conv += "r";
          break;
        case "Σ":
          conv += "S";
          break;
        case "σ":
          conv += "s";
          break;
        case "ς":
          conv += "s";
          break;
        case "Τ":
          conv += "T";
          break;
        case "τ":
          conv += "t";
          break;
        case "Υ":
          conv += "Y";
          break;
        case "Ύ":
          conv += "Y";
          break;
        case "Ϋ":
          conv += "y";
          break;
        case "υ":
          conv += "u";
          break;
        case "ϋ":
          conv += "u";
          break;
        case "ύ":
          conv += "u";
          break;
        case "Φ":
          conv += "F";
          break;
        case "φ":
          conv += "f";
          break;
        case "Χ":
          conv += "X";
          break;
        case "χ":
          conv += "x";
          break;
        case "Ψ":
          conv += "Ps";
          break;
        case "ψ":
          conv += "ps";
          break;
        case "Ω":
          conv += "O";
          break;
        case "Ώ":
          conv += "O";
          break;
        case "ώ":
          conv += "o";
          break;
        case "ω":
          conv += "o";
          break;
        default:
          conv += str[i];
      }
    }
  }
  return conv;
};

$("#login-btn").click(function () {
  loadIndexPage(false);
  $("#content").load("html/login.html", function () {
    forLoginPassword();
  });
  changeHeader("Login");
});

function forLoginPassword() {
  $("#login-password-btn").click(function () {
    var type = $("#login-password").prop("type");
    type === "password"
      ? $("#login-password").prop("type", "text")
      : $("#login-password").prop("type", "password");
  });
}
