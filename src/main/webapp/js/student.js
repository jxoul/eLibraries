const selected = {
  book: "",
  library: "",
};

function loadStudentHomePage() {
  loadIndexPage(false);
  $("#content").load("html/student.html", function () {
    $("#student-edit-btn").click(function () {
      $("#student-output").html(createTableFromJSON(getLoggedInUser()));
      $("#student-output").append(`<div class="text-center">
      <div class="btn btn-secondary" onclick="loadEditForm()">Edit</div>
    </div>`);
    });

    $("#student-search-btn").click(function () {
      removeTextColor("student-output");
      $("#student-output").load("html/search-book-form.html");
    });

    $("#student-borrowings-btn").click(function () {
      removeTextColor("student-output");
      $("#student-output")
        .html(
          `
        <div id="user-active-borrowings" class="text-center">
          <h2 class="special-section my-2" style="color:white">Active Borrowings</h2>
        </div>
        <div id="user-completed-borrowings" class="text-center">
          <h2 class="special-section my-2" style="color:white">Completed Borrowings</h2>
        </div>
      `
        )
        .promise()
        .then(function () {
          loadUserActiveBorrowings();
        })
        .then(function () {
          loadUserCompletedBorrowings();
        });
    });

    $("#notifications-btn").click(function () {
      loadNotifications();
    });

    $("#notifications-btn").click();
  });
}

function loadNotifications() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      printNotifications(responseData);
    } else if (xhr.status !== 200) {
      $("#student-output").html(`<p>No notifications</p>`);
    }
  };
  xhr.open(
    "GET",
    "/eLibraries/services/borrowings/student/" +
      getLoggedInUser()["user_id"] +
      "/borrowed"
  );
  xhr.send();
}

function printNotifications(data) {
  var html = `<div id="notifications-div" class="container" >`;
  var j = 0;
  for (var i = 0; i < data.length; i++) {
    var borrowing = JSON.parse(data[i]);
    var daysLeft = calcDaysRemaining(borrowing.todate);
    if (daysLeft <= 3) {
      html += `<div class="blue-border my-2 text-center">`;
      j++;
      if (daysLeft < 0) {
        html +=
          `<p>Your subscription for ` +
          borrowing.book_title +
          ` has expired</p>`;
      } else if (daysLeft == 0) {
        html +=
          `<p>Your subscription for ` +
          borrowing.book_title +
          ` ends today</p>`;
      } else {
        html +=
          `<p>Your subscription for ` +
          borrowing.book_title +
          ` ends in ` +
          daysLeft +
          ` days</p>`;
      }
      html += `</div>`;
    }
  }
  if (j == 0) {
    html += `<p>No notifications</p>`;
  }
  html += `</div>`;
  $("#student-output").html(html);
}

function studentBookSearch() {
  let myForm = document.getElementById("search-book-form");
  let formData = new FormData(myForm);
  var isEmpty = true;
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
    value !== "" && (isEmpty = false);
  });
  if (isEmpty) {
    $("#search-book-result")
      .text("Insert at least one field to search for")
      .css("color", "red");
    return;
  }
  var jsonData = JSON.stringify(data);
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      loadBookSearchResults(responseData);
    } else if (xhr.status !== 200) {
      $("#search-book-result").text(responseData["error"]).css("color", "red");
    }
  };

  xhr.open("POST", "/eLibraries/services/data/books/");
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(jsonData);
}

function loadBookSearchResults(data) {
  $("#student-output").load("html/book-results.html", function () {
    $("#new-search-btn").click(function () {
      $("#student-output").load("html/search-book-form.html");
    });

    $("#book-results-table-div").html(createBookTableFromJSON(data));

    $("#book-results-table tbody tr").on("click", function () {
      var rowData = {};
      var i = 0;
      var key = [
        "isbn",
        "title",
        "authors",
        "genre",
        "pages",
        "publicationyear",
        "url",
        "photo",
      ];
      $(this)
        .find("td")
        .each(function () {
          if (key[i] === "photo") {
            rowData[key[i]] = $(this).find("img").prop("src");
          } else {
            rowData[key[i]] = $(this).text();
          }

          i++;
        });

      loadSelectedBook(rowData);
    });
  });
}

function loadSelectedBook(data) {
  selected.book = data;
  $("#clicked-book")
    .html(
      `<div
    class="container"
    style="border: 20px solid darkblue; border-radius: 20px; padding: 25px; "
  >

    <div id="selected-book-header" class="row">
      <div class="col-12 text-center">
        <h2>` +
        data["title"] +
        `</h2>
        <p class="text-muted">` +
        data["authors"] +
        `</p>
      </div>
    </div>
    <div class="row">
      <div id="selected-book-cover" class="col-4">
        <img
          src="` +
        data["photo"] +
        `"
          alt="Book Cover"
          class="img-fluid rounded"
        />
      </div>
      <div class="col-8">
        <div id="selected-book-info">
          <div>
            <div><strong>ISBN:</strong> ` +
        data["isbn"] +
        `</div>
            <div><strong>Genre:</strong> ` +
        data["genre"] +
        `</div>
            <div><strong>Pages:</strong> ` +
        data["pages"] +
        `</div>
            <div><strong>Publication Year:</strong> ` +
        data["publicationyear"] +
        `</div>
            <div >
              <strong>URL:</strong>
              <a
                href="` +
        data["url"] +
        `"
                >Visit the Site</a
              >
            </div>
          </div>
        </div>
        <div id="users-review-div" class="my-2">
          <h4 id="user-reviews-header">User Reviews</h4>
        </div>
      </div>
    </div>
    <div id="available-libraries-div" class="row my-2"></div>
  </div>`
    )
    .promise()
    .then(function () {
      loadUsersReviews(data["isbn"]);
    })
    .then(function () {
      if (getLoggedInUser()["lat"] == 0 && getLoggedInUser()["lon"] == 0) {
        $("#available-libraries-div")
          .html(
            "<p class='text-center'>You have to define my location lat and lon get the nearest libraries</p>"
          )
          .css("color", "red");
      } else {
        getAvailableLibraries(data["isbn"]);
      }
    });
}

function loadUsersReviews(isbn) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      printUserReviews(responseData);
    } else if (xhr.status !== 200) {
      $("#user-reviews-header").prepend("No ");
      $("#users-review-div").append(
        "<p class='text-center'>" + responseData["error"] + "</p>"
      );
    }
  };
  xhr.open("GET", "/eLibraries/services/reviews/usersReviews/" + isbn);
  xhr.send();
}

function printUserReviews(data) {
  var averageScore = 0;
  var i;
  var html = `
  <div id="reviews-scroll-div" class="container" >`;
  for (i = 0; i < data.length; i++) {
    var review = JSON.parse(data[i]);
    averageScore += parseInt(review.reviewScore);
    html +=
      `
    <div class="row special-section my-1">
      <div class="col-sm-2">
        <h6>` +
      review.name +
      `</h6>
        <p>Score: ` +
      review.reviewScore +
      `/5.0</p>
      </div>
      <div class="col-sm-1"></div>
      <div class="col-sm-9">
        <p>` +
      review.reviewText +
      `</p>
      </div>
    </div>
    `;
  }
  html +=
    `</div><h5 class="text-muted my-2">Average Score: ` +
    (averageScore / i).toFixed(1) +
    `/5.0</h5>`;
  $("#user-reviews-header").prepend(i + " ");
  $("#users-review-div").append(html);
}

function getAvailableLibraries(isbn) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      var libraries = [];
      for (var i = 0; i < responseData.length; i++) {
        var library = JSON.parse(responseData[i]);
        libraries.push([library["library_id"], library["bookcopy_id"]]);
      }

      getAvailableLibrariesInfo(libraries);
    } else if (xhr.status !== 200) {
      $("#available-libraries-div")
        .html("<p class='text-center'>" + responseData["error"] + "</p>")
        .css("color", "red");
    }
  };
  xhr.open("GET", "/eLibraries/services/data/bookInLibraries/" + isbn);
  xhr.send();
}

function getAvailableLibrariesInfo(libraries) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      var librariesInfo = [];
      for (var i = 0; i < responseData.length; i++) {
        var libraryInfo = JSON.parse(responseData[i]);
        if (libraryInfo["lat"] != 0 && libraryInfo["lon"] != 0) {
          librariesInfo.push(libraryInfo);
        }
        libraries.filter((obj) => {
          obj[0] === libraryInfo["library_id"] &&
            (libraryInfo["bookcopy_id"] = obj[1]);
        });
      }
      getDistancefromEndpoints(librariesInfo);
    }
  };
  var librariesIDs = [];
  for (var i = 0; i < libraries.length; i++) {
    librariesIDs.push(libraries[i][0]);
  }

  xhr.open("POST", "/eLibraries/services/users/libraries/");
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(librariesIDs));
}

function getDistancefromEndpoints(librariesInfo) {
  const data = null;
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      const responseData = JSON.parse(xhr.responseText);
      var distances = responseData["distances"][0];
      var durations = responseData["durations"][0];

      for (var i = 0; i < librariesInfo.length; i++) {
        librariesInfo[i]["distance"] = distances[i];
        librariesInfo[i]["duration"] = durations[i];
      }
      printAvailableLibraries(librariesInfo);
    }
  });

  var url =
    "https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?" +
    "origins=" +
    getLoggedInUser()["lat"] +
    "%2C" +
    getLoggedInUser()["lon"] +
    "&destinations=";

  for (var i = 0; i < librariesInfo.length; i++) {
    url += "%3B" + librariesInfo[i]["lat"] + "%2C" + librariesInfo[i]["lon"];
  }

  xhr.open("GET", url);
  xhr.setRequestHeader(
    "X-RapidAPI-Key",
    "03cce65e35msh4d9a125991b6a2bp18e5e3jsna68b13de7fb0"
  );
  xhr.send(data);
}

function printAvailableLibraries(librariesInfo) {
  $("#available-libraries-div")
    .html(
      `<div class="special-section">
    <label>Show libraries by shorter</label>
    <div>
      <input
        type="radio"
        name="sorting-type"
        id="distance-radio"
        value="distance"
        checked
      />
      <label for="distance-radio">Distance</label>
    </div>
    <div>
      <input
        type="radio"
        name="sorting-type"
        id="duration-radio"
        value="duration"
      />
      <label for="duration-radio">Duration</label>
    </div>
  </div>
  <div id="libraries-results-div" class="my-2"></div>
  <div id="borrow-div" class="my-2"></div>`
    )
    .promise()
    .then(function () {
      var basedOnDistance = librariesInfo.sort(
        (a, b) => a.distance - b.distance
      );
      var basedOnDuration = librariesInfo.sort(
        (a, b) => a.duration - b.duration
      );
      $("#libraries-results-div")
        .html(createLibraryTableFromJSON(basedOnDistance))
        .promise()
        .then(function () {
          $("#library-results-table tbody tr").on("click", function () {
            var rowData = {};
            var i = 0;
            var key = [
              "libraryname",
              "libraryinfo",
              "distance",
              "duration",
              "location",
              "telephone",
              "personalpage",
              "email",
              "librarian",
            ];
            $(this)
              .find("td")
              .each(function () {
                rowData[key[i]] = $(this).text();
                i++;
              });

            librariesInfo.filter(function (obj) {
              if (obj["libraryname"] === rowData["libraryname"]) {
                selected.library = obj;
              }
            });

            $("#borrow-div")
              .html(
                `
          <div class="text-center">
            <div class="btn btn-warning btn-lg" id="borrow-btn">Borrow from "` +
                  rowData["libraryname"] +
                  `" for 1 month 
            </div>
          </div>
          `
              )
              .promise()
              .then(function () {
                $("#borrow-btn").click(function () {
                  makeBookUnavailable();
                  borrowBook();
                });
              });
          });
        });

      $("input[name='sorting-type']").change(function () {
        let selectedValue = $("input[name='sorting-type']:checked").val();
        if (selectedValue === "distance") {
          $("#libraries-results-div")
            .html(createLibraryTableFromJSON(basedOnDistance))
            .promise()
            .then(function () {
              $("#library-results-table tbody tr").on("click", function () {
                var rowData = {};
                var i = 0;
                var key = [
                  "libraryname",
                  "libraryinfo",
                  "distance",
                  "duration",
                  "location",
                  "telephone",
                  "personalpage",
                  "email",
                  "librarian",
                ];
                $(this)
                  .find("td")
                  .each(function () {
                    rowData[key[i]] = $(this).text();
                    i++;
                  });

                librariesInfo.filter(function (obj) {
                  if (obj["libraryname"] === rowData["libraryname"]) {
                    selected.library = obj;
                  }
                });

                $("#borrow-div")
                  .html(
                    `
                <div class="text-center">
                  <div class="btn btn-warning btn-lg" id="borrow-btn">Borrow from "` +
                      rowData["libraryname"] +
                      ` for 1 month 
                  </div>
                </div>
                `
                  )
                  .promise()
                  .then(function () {
                    $("#borrow-btn").click(function () {
                      borrowBook();
                    });
                  });
              });
            });
        } else {
          $("#libraries-results-div")
            .html(createLibraryTableFromJSON(basedOnDuration))
            .promise()
            .then(function () {
              $("#library-results-table tbody tr").on("click", function () {
                var rowData = {};
                var i = 0;
                var key = [
                  "libraryname",
                  "libraryinfo",
                  "distance",
                  "duration",
                  "location",
                  "telephone",
                  "personalpage",
                  "email",
                  "librarian",
                ];
                $(this)
                  .find("td")
                  .each(function () {
                    rowData[key[i]] = $(this).text();
                    i++;
                  });

                librariesInfo.filter(function (obj) {
                  if (obj["libraryname"] === rowData["libraryname"]) {
                    selected.library = obj;
                  }
                });

                $("#borrow-div")
                  .html(
                    `
              <div class="text-center">
                <div class="btn btn-warning btn-lg" id="borrow-btn">Borrow from "` +
                      rowData["libraryname"] +
                      ` for 1 month 
                </div>
              </div>
              `
                  )
                  .promise()
                  .then(function () {
                    $("#borrow-btn").click(function () {
                      borrowBook();
                    });
                  });
              });
            });
        }
      });
    });
}

function createLibraryTableFromJSON(libraries) {
  var html = `<div class="table-responsive"><table id="library-results-table" class="table table-hover">
                <thead >
                  <tr>
                    <th class="col-3 text-center">Library Name</th>
                    <th class="col-3 text-center">Library Info</th>
                    <th class="col-3 text-center">Distance</th>
                    <th class="col-3 text-center">Duration by car</th>
                    <th class="col-3 text-center">Location</th>
                    <th class="col-3 text-center">Telephone</th>
                    <th class="col-3 text-center">Personal Page</th>
                    <th class="col-3 text-center">Email</th>
                    <th class="col-3 text-center">Librarian</th>
                  </tr>
                </thead>
                <tbody>`;
  for (var i = 0; i < libraries.length; i++) {
    html +=
      "<tr><td class='col-3 text-center'>" + libraries[i].libraryname + "</td>";
    html +=
      "<td class='col-3 text-center'>" + libraries[i].libraryinfo + "</td>";
    html +=
      "<td class='col-3 text-center'>" +
      (libraries[i].distance / 1000).toFixed(2) +
      " km</td>";
    html +=
      "<td class='col-3 text-center'>" +
      (libraries[i].duration / 60).toFixed(2) +
      " min</td>";
    html +=
      "<td class='col-3 text-center'>" +
      libraries[i].address +
      " " +
      libraries[i].city +
      ", " +
      libraries[i].country +
      "</td>";
    html += "<td class='col-3 text-center'>" + libraries[i].telephone + "</td>";
    html +=
      "<td class='col-3 text-center big-text'>" +
      libraries[i].personalpage +
      "</td>";
    html += "<td class='col-3 text-center'>" + libraries[i].email + "</td>";
    html +=
      "<td class='col-3 text-center'>" +
      libraries[i].firstname +
      " " +
      libraries[i].lastname +
      "</td>";
  }
  html += `</tbody>
  </table></div>`;
  return html;
}

function makeBookUnavailable() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "PUT",
    "/eLibraries/services/borrowings/availability/" +
      selected.library["bookcopy_id"]
  );
  xhr.send();
}

function borrowBook() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      $("#student-output").html(
        'Your borrow request of "' +
          selected.book["title"] +
          '" from ' +
          selected.library["libraryname"] +
          " was successfull"
      );
    } else if (xhr.status !== 200) {
    }
  };
  var today = new Date();
  var nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);
  var fromDate = convertDateToString(today);
  var toDate = convertDateToString(nextMonth);

  var data = {
    bookcopy_id: selected.library["bookcopy_id"],
    user_id: getLoggedInUser()["user_id"],
    fromDate: fromDate,
    toDate: toDate,
    status: "requested",
  };

  xhr.open("POST", "/eLibraries/services/borrowings/request/");
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));
}

function loadUserActiveBorrowings() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      printUserActiveRequests(responseData);
    } else if (xhr.status !== 200) {
      $("#user-active-borrowings").append(responseData["error"]);
    }
  };
  xhr.open(
    "GET",
    "/eLibraries/services/borrowings/student/" +
      getLoggedInUser()["user_id"] +
      "/borrowed"
  );
  xhr.send();
}

function printUserActiveRequests(data) {
  var html = `
  <div class="table-responsive"><table id="user-active-table" class="table table-hover">
  <thead >
    <tr>
      <th class="col-3 text-center">Borrowing ID</th>
      <th class="col-3 text-center">Book Photo</th>
      <th class="col-3 text-center">Book Title</th>
      <th class="col-3 text-center">From Date</th>
      <th class="col-3 text-center">To Date</th>  
      <th class="col-3 text-center">Library Name</th>
      <th class="col-3 text-center">Library Info</th>
      <th class="col-3 text-center">Library Telephone</th>
    </tr>
  </thead>
  <tbody>`;
  for (var i = 0; i < data.length; i++) {
    let borrowing = JSON.parse(data[i]);
    html +=
      "<tr><td class='col-3 text-center'>" + borrowing.borrowing_id + "</td>";
    html +=
      "<td class='col-3 '><img height=300 src='" +
      borrowing.book_photo +
      "'/></td>";
    html += "<td class='col-3 text-center'>" + borrowing.book_title + "</td>";
    html += "<td class='col-3 text-center'>" + borrowing.fromdate + "</td>";
    html += "<td class='col-3 text-center'>" + borrowing.todate + "</td>";
    html += "<td class='col-3 text-center'>" + borrowing.lib_name + "</td>";
    html += "<td class='col-3 text-center'>" + borrowing.lib_info + "</td>";
    html +=
      "<td class='col-3 text-center'>" + borrowing.lib_telephone + "</td></tr>";
  }
  html += `</tbody>
  </table></div>
  
  <div id="active-borrowing-opt-div" class="my-2"></div>`;

  $("#user-active-borrowings")
    .append(html)
    .promise()
    .then(function () {
      var todate;
      var booktitle;
      var libname;
      var borrowing_id;
      $("#user-active-table tbody tr").on("click", function () {
        var i = 0;
        var key = [
          "borrowing_id",
          "book_photo",
          "book_title",
          "fromdate",
          "todate",
          "lib_name",
          "lib_info",
          "lib_telephone",
        ];
        $(this)
          .find("td")
          .each(function () {
            if (key[i] === "borrowing_id") {
              borrowing_id = $(this).text();
            }
            if (key[i] === "todate") {
              todate = $(this).text();
            }
            if (key[i] === "book_title") {
              booktitle = $(this).text();
            }
            if (key[i] === "lib_name") {
              libname = $(this).text();
            }
            i++;
          });
        $("#active-borrowing-opt-div")
          .html(
            `
            <p style="font-size: larger;">Book: ` +
              booktitle +
              `<p>
            <div id="days-remaining-btn" class="btn btn-warning btn-lg">Days Remaining</div>
            <div id="returned-btn" class="btn btn-danger btn-lg">I returned this book</div>
            `
          )
          .promise()
          .then(function () {
            $("#days-remaining-btn").click(function () {
              if (calcDaysRemaining(todate) < 0) {
                alert(`Borrowing has expired`);
              } else {
                alert(
                  `There are ` +
                    calcDaysRemaining(todate) +
                    ` days remaining before returning ` +
                    booktitle +
                    ` at ` +
                    libname
                );
              }
            });
            $("#returned-btn").click(function () {
              setReturned(borrowing_id, booktitle);
            });
          });
      });
    });
}

function calcDaysRemaining(toDate) {
  var today = new Date();
  var givenDate = new Date(toDate);
  if (givenDate < today) {
    return -1;
  }
  var timeDiff = Math.abs(today.getTime() - givenDate.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return diffDays;
}

function loadUserCompletedBorrowings() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      printUserCompletedRequests(responseData);
    } else if (xhr.status !== 200) {
      $("#user-completed-borrowings").append(responseData["error"]);
    }
  };
  xhr.open(
    "GET",
    "/eLibraries/services/borrowings/student/" +
      getLoggedInUser()["user_id"] +
      "/successEnd"
  );
  xhr.send();
}

function printUserCompletedRequests(data) {
  var html = `
  <div class="table-responsive"><table id="user-completed-table" class="table table-hover">
  <thead >
    <tr>  
      <th class="col-3 text-center">Book Photo</th>
      <th class="col-3 text-center">Book Title</th>
      <th class="col-3 text-center">Book ISBN</th>
      <th class="col-3 text-center">From Date</th>
      <th class="col-3 text-center">To Date</th>  
      <th class="col-3 text-center">Library Name</th>
      <th class="col-3 text-center">Library Telephone</th>
    </tr>
  </thead>
  <tbody>`;
  for (var i = 0; i < data.length; i++) {
    let borrowing = JSON.parse(data[i]);
    html +=
      "<tr ><td class='col-3 '><img height=300 src='" +
      borrowing.book_photo +
      "'/></td>";
    html += "<td class='col-3 text-center'>" + borrowing.book_title + "</td>";
    html += "<td class='col-3 text-center'>" + borrowing.book_isbn + "</td>";
    html += "<td class='col-3 text-center'>" + borrowing.fromdate + "</td>";
    html += "<td class='col-3 text-center'>" + borrowing.todate + "</td>";
    html += "<td class='col-3 text-center'>" + borrowing.lib_name + "</td>";
    html +=
      "<td class='col-3 text-center'>" + borrowing.lib_telephone + "</td></tr>";
  }
  html += `</tbody>
  </table></div><div id="review-div" class="my-2"></div>`;

  var isbn;
  var title;

  $("#user-completed-borrowings")
    .append(html)
    .promise()
    .then(function () {
      $("#user-completed-table tbody tr").on("click", function () {
        var i = 0;
        var key = [
          "book_photo",
          "book_title",
          "book_isbn",
          "fromdate",
          "todate",
          "lib_name",
          "lib_telephone",
        ];

        $(this)
          .find("td")
          .each(function () {
            if (key[i] === "book_title") {
              title = $(this).text();
            }
            if (key[i] === "book_isbn") {
              isbn = $(this).text();
            }
            i++;
          });
        $("#review-div")
          .html(
            `<div id="review-btn" class="btn btn-warning btn-lg">Review ` +
              title +
              `</div>`
          )
          .promise()
          .then(function () {
            $("#review-btn").click(function () {
              printReviewForm(isbn, title);
            });
          });
      });
    });
}

function printReviewForm(isbn, title) {
  $("#review-div")
    .html(
      `
  <form id="review-form">
  <div class="form-group">
    <label for="review">Review:</label>
    <textarea class="form-control" id="review" name="reviewText" rows="3" required></textarea>
  </div>
  <div class="form-group">
    <label for="score">Score:</label>
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="reviewScore" id="score0" value="0" checked required>
      <label class="form-check-label" for="score0">0</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="reviewScore" id="score1" value="1" >
      <label class="form-check-label" for="score1">1</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="reviewScore" id="score2" value="2" >
      <label class="form-check-label" for="score2">2</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="reviewScore" id="score3" value="3" >
      <label class="form-check-label" for="score3">3</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="reviewScore" id="score4" value="4" >
      <label class="form-check-label" for="score4">4</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="reviewScore" id="score5" value="5" >
      <label class="form-check-label" for="score5">5</label>
    </div>
  </div>
  <div class="form-group" id="review-form-btns">
    <input type="submit" id="submit-review-btn" class="btn btn-primary" >
  </div>
</form>
<input type="text" id="reviewID" hidden>`
    )
    .promise()
    .then(function () {
      loadReview(isbn, title);
    })
    .then(function () {
      $("#review-form").submit(function (event) {
        event.preventDefault();
        var formData = $(this).serializeArray();
        var jsonData = {};
        $(formData).each(function (i, field) {
          jsonData[field.name] = field.value;
        });
        jsonData["user_id"] = getLoggedInUser()["user_id"];
        jsonData["isbn"] = isbn;
        var review_id = $("#reviewID").val();
        var submitBtn = $("#submit-review-btn").val();
        if (submitBtn.includes("Edit")) {
          $.ajax({
            type: "PUT",
            url: "/eLibraries/services/reviews/reviewID/" + review_id,
            data: JSON.stringify(jsonData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
              alert(data["success"]);
              $("#student-borrowings-btn").click();
            },
          });
        } else {
          $.ajax({
            type: "POST",
            url: "/eLibraries/services/reviews/newReview/",
            data: JSON.stringify(jsonData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
              alert(data["success"]);
              $("#student-borrowings-btn").click();
            },
          });
        }
      });
    });
}

function loadReview(isbn, title) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      var text = responseData["reviewText"];
      var score = responseData["reviewScore"];
      var review_id = responseData["review_id"];
      $("#reviewID").val(review_id);
      $("#review").val(text);
      $("input[name='reviewScore'][value='" + score + "']").attr(
        "checked",
        true
      );
      $("#submit-review-btn").val("Edit Review");
      $("#review-form-btns")
        .append(
          `<div id="delete-review-btn" class="btn btn-danger" >Delete Review</div>`
        )
        .promise()
        .then(function () {
          $("#delete-review-btn").click(function () {
            deleteReview(review_id, title);
          });
        });
    } else if (xhr.status !== 200) {
      $("#submit-review-btn").val("Submit Review");
    }
  };
  xhr.open(
    "GET",
    "/eLibraries/services/reviews/review/" +
      getLoggedInUser()["user_id"] +
      "/" +
      isbn
  );
  xhr.send();
}

function setReturned(borrowing_id, booktitle) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      alert("Your request for returning " + booktitle + " has been submited");
      $("#student-borrowings-btn").click();
    }
  };
  xhr.open(
    "PUT",
    "/eLibraries/services/borrowings/borrowStatus/" + borrowing_id + "/returned"
  );
  xhr.send();
}

function deleteReview(review_id, title) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      alert("Your review for " + title + " has been deleted");
      $("#student-borrowings-btn").click();
    }
  };
  xhr.open("DELETE", "/eLibraries/services/reviews/review/" + review_id);
  xhr.send();
}
