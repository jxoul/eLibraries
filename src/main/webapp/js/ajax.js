function checkDB(field, val) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    var element = "#" + field + "-msg";
    if (xhr.readyState === 4 && xhr.status === 200) {
      $(element).text(responseData["success"]).css("color", "green");
      registration[field] = true;
    } else if (xhr.status !== 200) {
      $(element).text(responseData["error"]).css("color", "red");
      registration[field] = false;
    }
    refreshRegisterBtn();
  };
  xhr.open("GET", "GetUser?field=" + field + "&val=" + val);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send();
}

function RegisterPOST() {
  let myForm = document.getElementById("registration-form");
  let formData = new FormData(myForm);

  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    $("#content").addClass("text-center");
    if (xhr.readyState === 4 && xhr.status === 200) {
      $("#content").html(responseData["success"]);
      $("#content").addClass("green-text");
    } else if (xhr.status !== 200) {
      $("#content").html(responseData["error"]).css("color", "red");
      $("#content").addClass("red-text");
    }
  };

  let isStudent = formData.get("user_type") === "student";
  const data = {};
  if (isStudent) {
    formData.forEach((value, key) => {
      if (
        key !== "libraryname" &&
        key !== "libraryinfo" &&
        key !== "confirmPassword"
      ) {
        if (key === "country") {
          var countryVal = $("#country").val();
          var country = $("#country")
            .children('[value="' + countryVal + '"]')
            .text();
          data[key] = country;
        } else {
          data[key] = value;
        }
      }
    });
  } else {
    formData.forEach((value, key) => {
      if (
        key !== "student_type" &&
        key !== "student_id" &&
        key !== "student_id_from_date" &&
        key !== "department" &&
        key !== "university" &&
        key !== "student_id_to_date" &&
        key !== "confirmPassword"
      ) {
        if (key === "country") {
          var countryVal = $("#country").val();
          var country = $("#country")
            .children('[value="' + countryVal + '"]')
            .text();
          data[key] = country;
        } else {
          data[key] = value;
        }
      }
    });
  }

  xhr.open("POST", "Register?student=" + isStudent);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));
  loadIndexPage(true);
}

function LoginPOST() {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);

    if (xhr.readyState === 4 && xhr.status === 200) {
      $("#login-msg").html("");
      $("#login-form")[0].reset();
      var type = responseData["type"];

      var user = JSON.parse(responseData["success"]);
      setLoggedInType(responseData["type"]);
      setLoggedInUser(user);
      changeHeader("Welcome " + user["firstname"]);
      type === "student" ? loadStudentHomePage() : loadLibrarianHomePage();
    } else if (xhr.status !== 200) {
      $("#login-msg")
        .html("<small>" + responseData["error"] + "</small>")
        .css("color", "red");
    }
  };
  var data = $("#login-form").serialize();

  xhr.open("POST", "Login");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(data);
}

function LogoutPOST() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      setLoggedInUser("");
      setLoggedInType("");
      loadIndexPage(true);
    } else if (xhr.status !== 200) {
      $("#student-msg").text("Something went wrong").css("color", "red");
    }
  };
  xhr.open("POST", "Logout");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send();
}

function LoginGET() {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      var type = responseData["type"];
      var user = JSON.parse(responseData["success"]);
      setLoggedInType(responseData["type"]);
      setLoggedInUser(user);
      changeHeader("Welcome Back " + user["firstname"]);
      type === "student" ? loadStudentHomePage() : loadLibrarianHomePage();
    }
  };
  xhr.open("GET", "Login");
  xhr.send();
}

function UpdatePOST() {
  var type = getLoggedInType();
  let myForm = document.getElementById("edit-form");
  let formData = new FormData(myForm);
  var xhr = new XMLHttpRequest();
  const data = {};
  formData.forEach((value, key) => {
    if (key === "country") {
      var countryVal = $("#edit-country").val();
      var country = $("#edit-country")
        .children('[value="' + countryVal + '"]')
        .text();
      data[key] = country;
    } else {
      data[key] = value;
    }
    //console.log("key:" + key + " val:" + value);
  });

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      var user = JSON.parse(responseData["success"]);
      setLoggedInUser(user);
      changeHeader("Welcome Back " + user["firstname"]);

      $("#" + type + "-output")
        .text("Update complete")
        .addClass("green-text");
    } else if (xhr.status !== 200) {
      $("#" + type + "-output")
        .text("Something went wrong")
        .addClass("red-text");
    }
  };
  xhr.open("POST", "Update?type=" + type);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));
  type === "student" ? loadStudentHomePage() : loadLibrarianHomePage();
}
