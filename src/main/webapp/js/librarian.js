function loadLibrarianHomePage() {
  loadIndexPage(false);
  $("#content").load("html/librarian.html", function () {
    $("#librarian-edit-btn").click(function () {
      $("#librarian-output").html(createTableFromJSON(getLoggedInUser()));
      $("#librarian-output").append(`<div class="text-center">
      <div class="btn btn-secondary" onclick="loadEditForm()">Edit</div>
      </div>`);
    });

    $("#librarian-add-btn").click(function () {
      $("#librarian-output").load("html/add-book-form.html");
    });

    $("#librarian-availability-btn").click(function () {
      $("#librarian-output").html(`
      <form
        id="book-available-form"
        name="book-available-form"
        onsubmit="addBookInLibrary();return false;"
      >
    
        <div class="form-group">
          <label for="book-available-isbn">ISBN</label>
          <input
            type="text"
            class="form-control"
            id="book-available-isbn"
            name="isbn"
            required
          />
        </div>

        <div class="text-center">
          <button id="book-available-btn" type="submit" class="btn btn-primary">
            Add Book In Library
          </button>
        </div>
      </form>
      <p id="book-available-result" class="text-center my-2"></p>`);
    });

    $("#librarian-borrowings-btn").click(function () {
      $("#librarian-output")
        .html(
          `
        <div id="requested-borrowings" class="text-center">
          <h2 class="special-section my-2" style="color:white">New Borrowing Requests</h2>
        </div>
        <div id="active-borrowings" class="text-center">
          <h2 class="special-section my-2" style="color:white">Active Borrowings</h2>
        </div>
        <div id="completed-requests" class="text-center">
          <h2 class="special-section my-2" style="color:white">Completed Borrowing Requests</h2>
        </div>
        <div id="completed-borrowings" class="text-center">
          <h2 class="special-section my-2" style="color:white">Completed Borrowings</h2>
        </div>  
      `
        )
        .promise()
        .then(function () {
          loadRequestedBorrowings();
        })
        .then(function () {
          loadLibrarianActiveBorrowings();
        })
        .then(function () {
          loadLibrarianCompletedRequests();
        })
        .then(function () {
          loadLibrarianCompletedBorrowigs();
        });
    });
  });
}

function addBookToDatabase() {
  let myForm = document.getElementById("add-book-form");
  let formData = new FormData(myForm);
  const data = {};
  formData.forEach((value, key) => (data[key] = value));
  var jsonData = JSON.stringify(data);
  //console.log(jsonData);
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      $("#add-book-result").text(responseData["success"]).css("color", "green");
      $("#add-book-form")[0].reset();
    } else if (xhr.status !== 200) {
      $("#add-book-result").text(responseData["error"]).css("color", "red");
    }
  };

  xhr.open("POST", "/eLibraries/services/data/newBook/");
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(jsonData);
}

function addBookInLibrary() {
  var isbn = $("#book-available-isbn").val();
  var id = getLoggedInUser()["library_id"];

  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      $("#book-available-result")
        .text(responseData["success"])
        .css("color", "green");
      $("#book-available-form")[0].reset();
    } else if (xhr.status !== 200) {
      $("#book-available-result")
        .text(responseData["error"])
        .css("color", "red");
    }
  };

  xhr.open(
    "POST",
    "/eLibraries/services/data/bookInLibrary/" + id + "/" + isbn
  );
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send();
}

function loadRequestedBorrowings() {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      printBorrowRequests(responseData);
    } else if (xhr.status !== 200) {
      $("#requested-borrowings").append(responseData["error"]);
    }
  };

  xhr.open(
    "GET",
    "/eLibraries/services/borrowings/library/" +
      getLoggedInUser()["library_id"] +
      "/requested"
  );
  xhr.send();
}

function printBorrowRequests(data) {
  var html = `
  <div class="table-responsive"><table id="requests-table" class="table table-hover">
  <thead >
    <tr>
      <th class="col-3 text-center">Borrowing ID</th>
      <th class="col-3 text-center">Book Photo</th>
      <th class="col-3 text-center">Bookcopy ID</th>
      <th class="col-3 text-center">Book Title</th>
      <th class="col-3 text-center">Book ISBN</th>
      <th class="col-3 text-center">From Date</th>
      <th class="col-3 text-center">To Date</th>
      <th class="col-3 text-center">Student Name</th>
      <th class="col-3 text-center">Student ID</th>
      <th class="col-3 text-center">Student Email</th>
      <th class="col-3 text-center">Student Telephone</th>    
      
    </tr>
  </thead>
  <tbody>`;

  for (var i = 0; i < data.length; i++) {
    html += printBorrowing(data[i]);
  }
  html += `</tbody>
  </table></div><div id="accept-borrow-div" class="my-2"></div>`;
  var borrowing_id;
  $("#requested-borrowings")
    .append(html)
    .promise()
    .then(function () {
      $("#requests-table tbody tr").on("click", function () {
        var i = 0;
        var key = [
          "borrowing_id",
          "book_photo",
          "bookcopy_id",
          "book_title",
          "book_isbn",
          "fromdate",
          "todate",
          "student_name",
          "student_id",
          "student_email",
          "student_telephone",
        ];
        $(this)
          .find("td")
          .each(function () {
            if (key[i] === "borrowing_id") {
              borrowing_id = $(this).text();
            }
            i++;
          });
        $("#accept-borrow-div")
          .html(
            `<div id="accept-borrow-btn" class="btn btn-warning btn-lg">Accept Borrowing Request with ID [` +
              borrowing_id +
              `]</div>`
          )
          .promise()
          .then(function () {
            $("#accept-borrow-btn").click(function () {
              changeBorrowingStatus(borrowing_id, "borrowed");
            });
          });
      });
    });
}

function printBorrowing(data) {
  var borrowing = JSON.parse(data);
  var html =
    "<tr><td class='col-3 text-center'>" + borrowing.borrowing_id + "</td>";

  html +=
    "<td class='col-3 '><img height=300 src='" +
    borrowing.book_photo +
    "'/></td>";
  html += "<td class='col-3 text-center'>" + borrowing.bookcopy_id + "</td>";
  html += "<td class='col-3 text-center'>" + borrowing.book_title + "</td>";
  html += "<td class='col-3 text-center'>" + borrowing.book_isbn + "</td>";
  html += "<td class='col-3 text-center'>" + borrowing.fromdate + "</td>";
  html += "<td class='col-3 text-center'>" + borrowing.todate + "</td>";
  html += "<td class='col-3 text-center'>" + borrowing.student_name + "</td>";
  html += "<td class='col-3 text-center'>" + borrowing.student_id + "</td>";
  html += "<td class='col-3 text-center'>" + borrowing.student_email + "</td>";
  html +=
    "<td class='col-3 text-center'>" +
    borrowing.student_telephone +
    "</td></tr>";
  return html;
}

function loadLibrarianActiveBorrowings() {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      printActiveRequests(responseData);
    } else if (xhr.status !== 200) {
      $("#active-borrowings").append(responseData["error"]);
    }
  };

  xhr.open(
    "GET",
    "/eLibraries/services/borrowings/library/" +
      getLoggedInUser()["library_id"] +
      "/borrowed"
  );
  xhr.send();
}

function printActiveRequests(data) {
  var html = `
  <div class="table-responsive"><table id="active-table" class="table table-hover">
  <thead >
    <tr>
      <th class="col-3 text-center">Borrowing ID</th>
      <th class="col-3 text-center">Book Photo</th>
      <th class="col-3 text-center">Bookcopy ID</th>
      <th class="col-3 text-center">Book Title</th>
      <th class="col-3 text-center">Book ISBN</th>
      <th class="col-3 text-center">From Date</th>
      <th class="col-3 text-center">To Date</th>
      <th class="col-3 text-center">Student Name</th>
      <th class="col-3 text-center">Student ID</th>
      <th class="col-3 text-center">Student Email</th>
      <th class="col-3 text-center">Student Telephone</th>    
      
    </tr>
  </thead>
  <tbody>`;
  for (var i = 0; i < data.length; i++) {
    html += printBorrowing(data[i]);
  }
  html += `</tbody>
  </table></div><div id="end-borrow-div" class="my-2"></div>`;

  var borrowing_id;
  var bookcopy_id;
  var todate;
  $("#active-borrowings")
    .append(html)
    .promise()
    .then(function () {
      $("#active-table tbody tr").on("click", function () {
        var i = 0;
        var key = [
          "borrowing_id",
          "book_photo",
          "bookcopy_id",
          "book_title",
          "book_isbn",
          "fromdate",
          "todate",
          "student_name",
          "student_id",
          "student_email",
          "student_telephone",
        ];
        $(this)
          .find("td")
          .each(function () {
            if (key[i] === "borrowing_id") {
              borrowing_id = $(this).text();
            }
            if (key[i] === "bookcopy_id") {
              bookcopy_id = $(this).text();
            }
            if (key[i] === "todate") {
              todate = $(this).text();
            }
            i++;
          });
        $("#end-borrow-div")
          .html(
            `
            <p style="font-size: larger;">Borrowing ID: ` +
              borrowing_id +
              `<p>
            <div id="days-borrow-btn" class="btn btn-warning btn-lg">Days Remaining</div>
            <div id="pdf-borrow-btn" class="btn btn-secondary btn-lg">Download Info PDF</div>`
          )
          .promise()
          .then(function () {
            $("#days-borrow-btn").click(function () {
              alert(calcDaysRemaining(todate) + " days remaining");
            });

            $("#pdf-borrow-btn").click(function () {
              downloadPDF(borrowing_id, bookcopy_id, todate);
            });
          });
      });
    });
}

function loadLibrarianCompletedRequests() {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      printCompleteRequests(responseData);
    } else if (xhr.status !== 200) {
      $("#completed-requests").append(responseData["error"]);
    }
  };

  xhr.open(
    "GET",
    "/eLibraries/services/borrowings/library/" +
      getLoggedInUser()["library_id"] +
      "/returned"
  );
  xhr.send();
}

function printCompleteRequests(data) {
  var html = `
  <div class="table-responsive"><table id="complete-table" class="table table-hover">
  <thead >
    <tr>
      <th class="col-3 text-center">Borrowing ID</th>
      <th class="col-3 text-center">Book Photo</th>
      <th class="col-3 text-center">Bookcopy ID</th>
      <th class="col-3 text-center">Book Title</th>
      <th class="col-3 text-center">Book ISBN</th>
      <th class="col-3 text-center">From Date</th>
      <th class="col-3 text-center">To Date</th>
      <th class="col-3 text-center">Student Name</th>
      <th class="col-3 text-center">Student ID</th>
      <th class="col-3 text-center">Student Email</th>
      <th class="col-3 text-center">Student Telephone</th>    
      
    </tr>
  </thead>
  <tbody>`;
  for (var i = 0; i < data.length; i++) {
    html += printBorrowing(data[i]);
  }
  html += `</tbody>
  </table></div><div id="confirm-return-div" class="my-2"></div>`;
  var borrowing_id;
  var bookcopy_id;
  $("#completed-requests")
    .append(html)
    .promise()
    .then(function () {
      $("#complete-table tbody tr").on("click", function () {
        var i = 0;
        var key = [
          "borrowing_id",
          "book_photo",
          "bookcopy_id",
          "book_title",
          "book_isbn",
          "fromdate",
          "todate",
          "student_name",
          "student_id",
          "student_email",
          "student_telephone",
        ];
        $(this)
          .find("td")
          .each(function () {
            if (key[i] === "borrowing_id") {
              borrowing_id = $(this).text();
            }
            if (key[i] === "bookcopy_id") {
              bookcopy_id = $(this).text();
            }
            i++;
          });
        $("#confirm-return-div")
          .html(
            `<div id="confirm-return-btn" class="btn btn-warning btn-lg">Confirm Return of Borrowing with ID [` +
              borrowing_id +
              `]</div>`
          )
          .promise()
          .then(function () {
            $("#confirm-return-btn").click(function () {
              changeBorrowingStatus(borrowing_id, "successEnd", bookcopy_id);
            });
          });
      });
    });
}

function changeBorrowingStatus(borrowing_id, status, bookcopy_id) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      if (bookcopy_id) {
        makeBookAvailable(bookcopy_id);
      }
      $("#librarian-borrowings-btn").click();
    }
  };

  xhr.open(
    "PUT",
    "/eLibraries/services/borrowings/borrowStatus/" +
      borrowing_id +
      "/" +
      status
  );
  xhr.send();
}

function makeBookAvailable(bookcopy_id) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "PUT",
    "/eLibraries/services/borrowings/availability/" + bookcopy_id
  );
  xhr.send();
}

function downloadPDF(borrowing_id) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.onload = function () {
    var blob = xhr.response;
    if (xhr.readyState === 4 && xhr.status === 200) {
      const filename = xhr
        .getResponseHeader("Content-Disposition")
        .split(";")[1]
        .split("=")[1];
      var pdf = document.createElement("a");
      pdf.href = window.URL.createObjectURL(blob);
      pdf.download = filename;
      pdf.click();
    }
  };

  xhr.open("GET", "PdfCreator?borrowing_id=" + borrowing_id);
  xhr.send();
}

function loadLibrarianCompletedBorrowigs() {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      printCompletedBorrowings(responseData);
    } else if (xhr.status !== 200) {
      $("#completed-borrowings").append(responseData["error"]);
    }
  };

  xhr.open(
    "GET",
    "/eLibraries/services/borrowings/library/" +
      getLoggedInUser()["library_id"] +
      "/successEnd"
  );
  xhr.send();
}

function printCompletedBorrowings(data) {
  var html = `
  <div class="table-responsive"><table id="completed-borrowings-table" class="table table-hover">
  <thead >
    <tr>
      <th class="col-3 text-center">Borrowing ID</th>
      <th class="col-3 text-center">Book Photo</th>
      <th class="col-3 text-center">Bookcopy ID</th>
      <th class="col-3 text-center">Book Title</th>
      <th class="col-3 text-center">Book ISBN</th>
      <th class="col-3 text-center">From Date</th>
      <th class="col-3 text-center">To Date</th>
      <th class="col-3 text-center">Student Name</th>
      <th class="col-3 text-center">Student ID</th>
      <th class="col-3 text-center">Student Email</th>
      <th class="col-3 text-center">Student Telephone</th>    
      
    </tr>
  </thead>
  <tbody>`;
  for (var i = 0; i < data.length; i++) {
    html += printBorrowing(data[i]);
  }
  html += `</tbody>
  </table></div>`;
  $("#completed-borrowings").append(html);
}
