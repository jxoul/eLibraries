"use strict";

const loggedin = {
  type: "",
  info: "",
};

function setLoggedInType(type) {
  loggedin.type = type;
}

function setLoggedInUser(user) {
  loggedin.info = user;
}

function getLoggedInType() {
  return loggedin.type;
}

function getLoggedInUser() {
  return loggedin.info;
}

$(document).ready(function () {
  loadIndexPage(true);
  LoginGET();
});

function loadIndexPage(bool) {
  if (bool) {
    $("#index").prop("hidden", false);
    $("#content").html("");
    changeHeader("eLibraries");
  } else {
    $("#index").prop("hidden", true);
    $("#content").removeClass("text-center");
    removeTextColor("content");
  }
}

function changeHeader(text) {
  $("h1").text(text);
}

function createTableFromJSON(data) {
  var html =
    '<table class="table table-striped"><thead><tr><th class="text-center">Category</th><th class="text-center">Value</th></tr></thead><tbody>';
  for (const x in data) {
    var category = x;
    var value = data[x];
    if (x !== "user_id" && x !== "lat" && x !== "lon" && x !== "library_id") {
      html +=
        "<tr><td class='text-center'>" +
        tableCategory(category) +
        "</td><td class='text-center'>" +
        value +
        "</td></tr>";
    }
  }
  html += "<tbody></table>";
  return html;
}

function createBookTableFromJSON(data) {
  var html = `<div class="table-responsive"><table id="book-results-table" class="table table-hover">
                <thead >
                  <tr>
                    <th class="col-3 text-center">ISBN</th>
                    <th class="col-3 text-center">Title</th>
                    <th class="col-3 text-center">Authors</th>
                    <th class="col-3 text-center">Genre</th>
                    <th class="col-3 text-center">Pages</th>
                    <th class="col-3 text-center">Publication Year</th>
                    <th class="col-3 text-center">URL</th>
                    <th class="col-3 text-center">Photo</th>
                  </tr>
                </thead>
                <tbody>`;
  for (var i = 0; i < data.length; i++) {
    var book = JSON.parse(data[i]);
    html += "<tr><td class='col-3 text-center'>" + book.isbn + "</td>";
    html += "<td class='col-3 text-center'>" + book.title + "</td>";
    html += "<td class='col-3 text-center'>" + book.authors + "</td>";
    html += "<td class='col-3 text-center'>" + book.genre + "</td>";
    html += "<td class='col-3 text-center'>" + book.pages + "</td>";
    html += "<td class='col-3 text-center'>" + book.publicationyear + "</td>";
    html += "<td class='col-3 text-center big-text'>" + book.url + "</td>";
    html +=
      "<td class='col-3 '><img height=300 src='" + book.photo + "'/></td></tr>";
  }
  html += `</tbody>
  </table></div>`;
  return html;
}

function tableCategory(category) {
  switch (category) {
    case "student_id":
      return "Student ID";
    case "university":
      return "University";
    case "department":
      return "Department";
    case "student_type":
      return "Student Type";
    case "student_id_from_date":
      return "Starting Date (Student ID)";
    case "student_id_to_date":
      return "Ending Date (Student ID)";
    case "username":
      return "Username";
    case "email":
      return "Email";
    case "password":
      return "Password";
    case "firstname":
      return "First Name";
    case "lastname":
      return "Last Name";
    case "birthdate":
      return "Birthdate";
    case "gender":
      return "Gender";
    case "country":
      return "Country";
    case "city":
      return "City";
    case "address":
      return "Address";
    case "telephone":
      return "Telephone";
    case "personalpage":
      return "Personal Page";
    case "libraryname":
      return "Library Name";
    case "libraryinfo":
      return "Library Info";
    default:
      return "Error";
  }
}

function loadEditForm() {
  var type = getLoggedInType();
  var element = type + "-output";
  removeTextColor(element);
  $("#" + type + "-output").load("html/edit-form.html", function () {
    type === "librarian" &&
      $("#edit-lib-name").val(getLoggedInUser().libraryname) &&
      $("#edit-lib-info").val(getLoggedInUser().libraryinfo) &&
      $("#edit-email").val(getLoggedInUser().email);

    type === "student" && $(".lib-edit-div").prop("hidden", true);

    type === "student" &&
      $("#edit-lib-name").prop("disabled", true) &&
      $("#edit-lib-info").prop("disabled", true) &&
      $("#edit-email").prop("disabled", true);

    $("#edit-password").val(getLoggedInUser().password);
    $("#edit-fname").val(getLoggedInUser().firstname);
    $("#edit-lname").val(getLoggedInUser().lastname);
    var gender = getLoggedInUser().gender;
    var id = "#edit-" + gender.toLowerCase() + "-radio";
    $(id).prop("checked", true);
    $("#edit-bday").val(getLoggedInUser().birthdate);
    $("#edit-phone").val(getLoggedInUser().telephone);
    $("#edit-page").val(getLoggedInUser().personalpage);
    var country = getLoggedInUser().country;
    $("#edit-country option")
      .filter(function () {
        return $(this).text() == country;
      })
      .prop("selected", true);
    $("#edit-city").val(getLoggedInUser().city);
    $("#edit-address").val(getLoggedInUser().address);
  });
}

function removeTextColor(element) {
  var element = "#" + element;
  $(element).removeClass("red-text");
  $(element).removeClass("green-text");
}

function convertDateToString(date) {
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var dateString = year + "-" + month + "-" + day;
  return dateString;
}
