var booksPerLibrary = [];
var booksPerGenre = [];
var nubOfStudents = [];

var libraries = [];
var students = [];
var booksInLibraries = [];
var booksPerGenreObj = [];

// Load the Visualization API and the corechart package.
google.charts.load("current", { packages: ["corechart"] });

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart1() {
  // Set a callback to run when the Google Visualization API is loaded.

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Topping");
  data.addColumn("number", "Slices");

  data.addRows(booksPerLibrary);

  // Set chart options
  var options = {
    title: "Books per Library",
    width: 400,
    height: 300,
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(
    document.getElementById("charts_cont_libraries")
  );

  chart.draw(data, options);
}

function drawChart2() {
  // Set a callback to run when the Google Visualization API is loaded.

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Topping");
  data.addColumn("number", "Slices");
  data.addRows(booksPerGenre);

  // Set chart options
  var options = {
    title: "Books per Genre",
    width: 400,
    height: 300,
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(
    document.getElementById("charts_cont_books")
  );

  chart.draw(data, options);
}

function drawChart3() {
  // Set a callback to run when the Google Visualization API is loaded.

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Topping");
  data.addColumn("number", "Slices");
  data.addRows(nubOfStudents);

  // Set chart options
  var options = {
    title: "Number of Students per Student Type",
    width: 400,
    height: 300,
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.BarChart(
    document.getElementById("charts_cont_students")
  );

  chart.draw(data, options);
}

function getBooksPerLibrary() {
  getLibraries();
  getBooksInLibraries();
}

function getLibraries() {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      for (var i = 0; i < responseData.length; i++) {
        var library = JSON.parse(responseData[i]);

        libraries.push({
          library_id: library["library_id"],
          name: library["username"],
        });
      }
    }
  };
  xhr.open("GET", "/eLibraries/services/users/librarians/");
  xhr.send();
}

function getBooksInLibraries() {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      for (var i = 0; i < responseData.length; i++) {
        var bookInLibrary = JSON.parse(responseData[i]);

        var targetObj = booksInLibraries.find(
          (obj) => obj.library_id === bookInLibrary["library_id"]
        );

        if (targetObj) {
          targetObj.num++;
        } else {
          booksInLibraries.push({
            library_id: bookInLibrary["library_id"],
            num: 1,
          });
        }
      }
      for (var i = 0; i < libraries.length; i++) {
        var name = libraries[i].name;
        var num = booksInLibraries.find(
          (obj) => obj.library_id === libraries[i].library_id
        )["num"];
        booksPerLibrary.push([name, num]);
      }
      google.charts.setOnLoadCallback(drawChart1);
    }
  };
  xhr.open("GET", "/eLibraries/services/data/booksInLibraries/");
  xhr.send();
}

function getBooksPerGenre() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      for (var i = 0; i < responseData.length; i++) {
        var book = JSON.parse(responseData[i]);

        var targetObj = booksPerGenreObj.find(
          (obj) => obj.genre === book["genre"]
        );

        if (targetObj) {
          targetObj.num++;
        } else {
          booksPerGenreObj.push({
            genre: book["genre"],
            num: 1,
          });
        }
      }
      for (var i = 0; i < booksPerGenreObj.length; i++) {
        booksPerGenre.push([
          booksPerGenreObj[i]["genre"],
          booksPerGenreObj[i]["num"],
        ]);
      }
      google.charts.setOnLoadCallback(drawChart2);
    }
  };
  xhr.open("GET", "/eLibraries/services/data/allBooks/");
  xhr.send();
}

function getNumberOfStudents() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const responseData = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      for (var i = 0; i < responseData.length; i++) {
        var student = JSON.parse(responseData[i]);

        var targetObj = students.find(
          (obj) => obj.student_type === student["student_type"]
        );

        if (targetObj) {
          targetObj.num++;
        } else {
          students.push({
            student_type: student["student_type"],
            num: 1,
          });
        }
      }
      for (var i = 0; i < students.length; i++) {
        nubOfStudents.push([students[i]["student_type"], students[i]["num"]]);
      }
      google.charts.setOnLoadCallback(drawChart3);
    }
  };
  xhr.open("GET", "/eLibraries/services/users/students/");
  xhr.send();
}
