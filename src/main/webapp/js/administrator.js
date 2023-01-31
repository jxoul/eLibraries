const userForDelete = {
  username: "",
  type: "",
};

var books;
function loadAdminHomePage() {
  $("#content").load("html/administrator.html", function () {
    $("#admin-stats-btn").click(function () {
      $("#admin-output").load("html/administrator-stats.html", function () {
        getBooksPerLibrary();
        getBooksPerGenre();
        getNumberOfStudents();
      });
    });

    $("#admin-users-btn").click(function () {
      $("#admin-output").load("html/administrator-users.html", () => {
        var xhr = new XMLHttpRequest();

        xhr.onload = function () {
          const responseData = JSON.parse(xhr.responseText);
          if (xhr.readyState === 4 && xhr.status === 200) {
            loadUsersResults(responseData);
          }
        };
        xhr.open("GET", "/eLibraries/services/users/all/");
        xhr.send();
      });
    });
  });
}

function AdminLogout() {
  location.reload();
}

function loadUsersResults(data) {
  var students = [];
  for (var i = 0; i < data["students"].length; i++) {
    var student = JSON.parse(data["students"][i]);
    students[i] = student;
  }
  var librarians = [];
  for (var i = 0; i < data["librarians"].length; i++) {
    var librarian = JSON.parse(data["librarians"][i]);
    librarians[i] = librarian;
  }

  $("#users-results").html(createUsersTableFromJSON(students, librarians));

  $("#students-table tbody tr").on("click", function () {
    var username;
    var i = 0;
    var key = ["username", "firstname", "lastname"];
    $(this)
      .find("td")
      .each(function () {
        if (key[i] === "username") {
          username = $(this).text();
        }
        i++;
      });

    var selectedStudent;
    for (var j = 0; j < students.length; j++) {
      if (students[j]["username"] === username) {
        selectedStudent = students[j];
      }
    }

    userForDelete.type = "student";
    loadSelectedUser(selectedStudent);
    userForDelete.username = username;
  });

  $("#librarians-table tbody tr").on("click", function () {
    var username;
    var i = 0;
    var key = ["username", "firstname", "lastname"];
    $(this)
      .find("td")
      .each(function () {
        if (key[i] === "username") {
          username = $(this).text();
        }
        i++;
      });

    var selectedLibrarian;
    for (var j = 0; j < librarians.length; j++) {
      if (librarians[j]["username"] === username) {
        selectedLibrarian = librarians[j];
      }
    }

    userForDelete.type = "librarian";
    loadSelectedUser(selectedLibrarian);
    userForDelete.username = username;
  });
}

function createUsersTableFromJSON(studentsData, librariansData) {
  var html = `<h2 class="special-section" style="color:white; margin-top: 20px;margin-left: 20px; margin-right: 20px">Students</h2><div class="table-responsive"><table id="students-table" class="table table-hover">
                <thead >
                  <tr>
                    <th class="col-3 text-center">Username</th>
                    <th class="col-3 text-center">First Name</th>
                    <th class="col-3 text-center">Last Name</th>
                  </tr>
                </thead>
                <tbody >`;
  for (var i = 0; i < studentsData.length; i++) {
    var student = studentsData[i];
    html += "<tr><td class='col-3 text-center'>" + student.username + "</td>";
    html += "<td class='col-3 text-center'>" + student.firstname + "</td>";
    html += "<td class='col-3 text-center'>" + student.lastname + "</td>";
  }
  html += `</tbody>
  </table></div>`;

  html += `<h2 class="special-section" style="color:white; margin: 20px">Librarians</h2><div class="table-responsive"><table id="librarians-table" class="table table-hover">
                <thead >
                  <tr>
                    <th class="col-3 text-center">Username</th>
                    <th class="col-3 text-center">First Name</th>
                    <th class="col-3 text-center">Last Name</th>
                  </tr>
                </thead>
                <tbody>`;
  for (var i = 0; i < librariansData.length; i++) {
    var librarian = librariansData[i];
    html += "<tr><td class='col-3 text-center'>" + librarian.username + "</td>";
    html += "<td class='col-3 text-center'>" + librarian.firstname + "</td>";
    html += "<td class='col-3 text-center'>" + librarian.lastname + "</td>";
  }
  html += `</tbody>
  </table></div>`;
  return html;
}

function loadSelectedUser(data) {
  if (userForDelete.type === "student") {
    $("#selected-user").html(
      `<div
      class="container"
      style="border: 20px solid darkblue; border-radius: 20px; padding: 25px; max-width:600px;"
    >
      <div id="selected-student-header" class="row">
        <div class="col-12 text-center">
          <h2>` +
        data["firstname"] +
        ` ` +
        data["lastname"] +
        `</h2>
          <p class="text-muted">` +
        data["username"] +
        `</p>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-center">
          <div id="selected-student-info">
            <div>
              <div><strong>User ID:</strong> ` +
        data["user_id"] +
        `</div>
              <div><strong>Email:</strong> ` +
        data["email"] +
        `</div>
              <div><strong>Password:</strong> ` +
        data["password"] +
        `</div>
              <div><strong>Birthdate:</strong> ` +
        data["birthdate"] +
        `</div>
        <div><strong>Gender:</strong> ` +
        data["gender"] +
        `</div><div><strong>Telephone:</strong> ` +
        data["telephone"] +
        `</div><div><strong>Personal Page:</strong> ` +
        data["personalpage"] +
        `</div><div><strong>Country:</strong> ` +
        data["country"] +
        `</div><div><strong>City:</strong> ` +
        data["city"] +
        `</div><div><strong>Address:</strong> ` +
        data["address"] +
        `</div><div><strong>Lat:</strong> ` +
        data["lat"] +
        `</div><div><strong>Lon:</strong> ` +
        data["lon"] +
        `</div><div><strong>Student Type:</strong> ` +
        data["student_type"] +
        `</div><div><strong>Department:</strong> ` +
        data["department"] +
        `</div><div><strong>University:</strong> ` +
        data["university"] +
        `</div><div><strong>Student ID:</strong> ` +
        data["student_id"] +
        `</div><div><strong>Student ID From Date:</strong> ` +
        data["student_id_from_date"] +
        `</div><div><strong>Student ID To Date:</strong> ` +
        data["student_id_to_date"] +
        `</div>
            <div id="selected-student-delete" class="text-center mt-3">
              <button class="btn btn-danger" onclick="deleteUser()">Delete ` +
        data["username"] +
        `</button>
            </div>
            
          </div>
        </div>
      </div>
    </div>`
    );
  } else {
    $("#selected-user").html(
      `<div
      class="container"
      style="border: 20px solid darkblue; border-radius: 20px; padding: 25px; max-width:600px;"
    >
      <div id="selected-student-header" class="row">
        <div class="col-12 text-center">
          <h2>` +
        data["firstname"] +
        ` ` +
        data["lastname"] +
        `</h2>
          <p class="text-muted">` +
        data["username"] +
        `</p>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-center">
          <div id="selected-student-info">
            <div>
              <div><strong>Library ID:</strong> ` +
        data["library_id"] +
        `</div>
              <div><strong>Email:</strong> ` +
        data["email"] +
        `</div>
              <div><strong>Password:</strong> ` +
        data["password"] +
        `</div>
              <div><strong>Birthdate:</strong> ` +
        data["birthdate"] +
        `</div>
        <div><strong>Gender:</strong> ` +
        data["gender"] +
        `</div><div><strong>Telephone:</strong> ` +
        data["telephone"] +
        `</div><div><strong>Personal Page:</strong> ` +
        data["personalpage"] +
        `</div><div><strong>Country:</strong> ` +
        data["country"] +
        `</div><div><strong>City:</strong> ` +
        data["city"] +
        `</div><div><strong>Address:</strong> ` +
        data["address"] +
        `</div><div><strong>Lat:</strong> ` +
        data["lat"] +
        `</div><div><strong>Lon:</strong> ` +
        data["lon"] +
        `</div><div><strong>Library Name:</strong> ` +
        data["libraryname"] +
        `</div><div><strong>Library Info:</strong> ` +
        data["libraryinfo"] +
        `</div>
            <div id="selected-student-delete" class="text-center mt-3">
              <button class="btn btn-danger" onclick="deleteUser()">Delete ` +
        data["username"] +
        `</button>
            </div>
            
          </div>
        </div>
      </div>
    </div>`
    );
  }
}

function deleteUser() {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      $("#admin-users-btn").click();
      alert(responseData["success"]);
    }
  };
  xhr.open(
    "DELETE",
    "/eLibraries/services/users/user/" +
      userForDelete.username +
      "/" +
      userForDelete.type
  );
  xhr.send();
}
