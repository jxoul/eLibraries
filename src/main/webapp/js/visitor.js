$("#visitor-btn").click(function () {
  setLoggedInType("visitor");
  loadVisitorHomePage();
});

function loadVisitorHomePage() {
  loadIndexPage(false);
  $("#content").load("html/visitor.html", function () {
    $("#visitor-search-btn").click(function () {
      $("#visitor-output").load("html/search-book-form.html", function () {
        $("#search-book-form").on("submit", function (event) {
          visitorBookSearch();
        });
      });
    });
  });
  changeHeader("Welcome Visitor");
}

function visitorBookSearch() {
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
      loadVisitorBookSearchResults(responseData);
    } else if (xhr.status !== 200) {
      $("#search-book-result").text(responseData["error"]).css("color", "red");
    }
  };

  xhr.open("POST", "/eLibraries/services/data/books/");
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(jsonData);
}

function loadVisitorBookSearchResults(data) {
  $("#visitor-output").load("html/book-results.html", function () {
    $("#new-search-btn").click(function () {
      $("#visitor-output").load("html/search-book-form.html", function () {
        $("#search-book-form").on("submit", function (event) {
          visitorBookSearch();
        });
      });
    });

    $("#book-results-table-div").html(createBookTableFromJSON(data));
  });
}
