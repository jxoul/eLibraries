package rest;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import database.tables.EditBooksInLibraryTable;
import database.tables.EditBooksTable;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import mainClasses.Book;
import mainClasses.BookInLibrary;

/**
 * REST Web Service
 *
 * @author stavros
 */
@Path("data")
public class BooksAPI {

    public BooksAPI() {
    }

    @GET
    @Path("/allBooks")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getAllBooks() throws ClassNotFoundException, SQLException {
        int i;
        EditBooksTable ebt = new EditBooksTable();
        ArrayList<Book> allBooks = ebt.databaseToBooks();
        JsonArray ja = new JsonArray();
        for (i = 0; i < allBooks.size(); ++i) {
            ja.add(ebt.bookToJSON(allBooks.get(i)));
        }
        return Response.status(Response.Status.OK)
                .type("application/json")
                .entity(ja.toString())
                .build();
    }

    @POST
    @Path("/books")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getBooks(String book) throws ClassNotFoundException, SQLException {
        int i;
        String title, authors, genre;
        int fromPages, toPages, fromYear, toYear;
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(book, JsonObject.class);

        EditBooksTable ebt = new EditBooksTable();
        ArrayList<Book> availableBooks = ebt.databaseToBooks();
        JsonArray ja = new JsonArray();

        if (!("".equals(jsonObject.get("title").getAsString()))) {
            title = jsonObject.get("title").getAsString();
        } else {
            title = null;
        }

        if (!("".equals(jsonObject.get("authors").getAsString()))) {
            authors = jsonObject.get("authors").getAsString();
        } else {
            authors = null;
        }

        if (!("".equals(jsonObject.get("genre").getAsString()))) {
            genre = jsonObject.get("genre").getAsString();
        } else {
            genre = null;
        }

        if (!("".equals(jsonObject.get("fpages").getAsString()))) {
            fromPages = Integer.parseInt(jsonObject.get("fpages").getAsString());
        } else {
            fromPages = 0;
        }

        if (!("".equals(jsonObject.get("tpages").getAsString()))) {
            toPages = Integer.parseInt(jsonObject.get("tpages").getAsString());
        } else {
            toPages = 0;
        }

        if (!("".equals(jsonObject.get("fyear").getAsString()))) {
            fromYear = Integer.parseInt(jsonObject.get("fyear").getAsString());
        } else {
            fromYear = 0;
        }

        if (!("".equals(jsonObject.get("tyear").getAsString()))) {
            toYear = Integer.parseInt(jsonObject.get("tyear").getAsString());
        } else {
            toYear = 0;
        }

        if (title == null && authors == null && genre == null
                && fromPages == 0 && toPages == 0
                && fromYear == 0 && toYear == 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .type("application/json")
                    .entity("{\"error\":\"Invalid search\"}")
                    .build();
        }

        boolean valid;
        for (i = 0; i < availableBooks.size(); ++i) {
            valid = true;
            if (title != null && valid) {
                if (!availableBooks.get(i).getTitle().toString().contains(title)) {
                    valid = false;
                }
            }
            if (authors != null && valid) {
                if (!availableBooks.get(i).getAuthors().toString().contains(authors)) {
                    valid = false;
                }
            }
            if (genre != null && valid) {
                if (!"all".equals(genre)) {
                    if (!availableBooks.get(i).getGenre().toString().contains(genre)) {
                        valid = false;
                    }
                }

            }

            if (fromPages != 0 && valid) {
                if (availableBooks.get(i).getPages() < fromPages) {
                    valid = false;
                }
            }

            if (toPages != 0 && valid) {
                if (availableBooks.get(i).getPages() > toPages) {
                    valid = false;
                }
            }

            if (fromYear != 0 && valid) {
                if (availableBooks.get(i).getPublicationyear() < fromYear) {
                    valid = false;
                }
            }

            if (toYear != 0 && valid) {
                if (availableBooks.get(i).getPublicationyear() > toYear) {
                    valid = false;
                }
            }

            if (valid) {
                ja.add(ebt.bookToJSON(availableBooks.get(i)));
            }
        }
        if (ja.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .type("application/json")
                    .entity("{\"error\":\"No book found\"}")
                    .build();
        } else {
            return Response.status(Response.Status.OK)
                    .type("application/json")
                    .entity(ja.toString())
                    .build();
        }
    }

    @POST
    @Path("/newBook")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response addBookInDatabase(String book) throws ClassNotFoundException, SQLException {
        EditBooksTable ebt = new EditBooksTable();
        Book bk = ebt.jsonToBook(book);

        String isbn = bk.getIsbn();
        if (isbn.length() != 10 && isbn.length() != 13) {
            return Response.status(Response.Status.NOT_ACCEPTABLE)
                    .type("application/json")
                    .entity("{\"error\":\"ISBN length must be 10 or 13 digits\"}")
                    .build();
        }

        Book bookInDB = ebt.databaseToBook(isbn);
        if (bookInDB != null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .type("application/json")
                    .entity("{\"error\":\"Book with ISBN " + isbn + " already in Database\"}")
                    .build();
        }

        int pages = bk.getPages();
        if (pages <= 0) {
            return Response.status(Response.Status.NOT_ACCEPTABLE)
                    .type("application/json")
                    .entity("{\"error\":\"Pages must be more than 0\"}")
                    .build();
        }

        int year = bk.getPublicationyear();
        if (year < 1200) {
            return Response.status(Response.Status.NOT_ACCEPTABLE)
                    .type("application/json")
                    .entity("{\"error\":\"Publication year must be after 1200\"}")
                    .build();
        }

        String url = bk.getUrl();
        if (!url.startsWith("http")) {
            return Response.status(Response.Status.NOT_ACCEPTABLE)
                    .type("application/json")
                    .entity("{\"error\":\"URL must start with 'http'\"}")
                    .build();
        }

        String photo = bk.getPhoto();
        if (!photo.startsWith("http")) {
            return Response.status(Response.Status.NOT_ACCEPTABLE)
                    .type("application/json")
                    .entity("{\"error\":\"Photo must start with 'http'\"}")
                    .build();
        }

        ebt.createNewBook(bk);
        return Response.status(Response.Status.OK)
                .type("application/json")
                .entity("{\"success\":\"Book Added in Database\"}")
                .build();

    }

    @POST
    @Path("/bookInLibrary/{library_id}/{isbn}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response addBookInLibrary(@PathParam("library_id") int library_id, @PathParam("isbn") String isbn) throws ClassNotFoundException, SQLException {
        EditBooksTable ebt = new EditBooksTable();
        EditBooksInLibraryTable ebilt = new EditBooksInLibraryTable();
        JsonObject jo = new JsonObject();

        if (isbn.length() != 10 && isbn.length() != 13) {
            return Response.status(Response.Status.NOT_ACCEPTABLE)
                    .type("application/json")
                    .entity("{\"error\":\"ISBN length must be 10 or 13 digits\"}")
                    .build();
        }

        Book book = ebt.databaseToBook(isbn);

        if (book == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .type("application/json")
                    .entity("{\"error\":\"The book with isbn " + isbn + " does not exist in the Database\"}")
                    .build();
        }

        BookInLibrary bookInLibrary = ebilt.databaseToBookInLibrary(library_id, isbn);

        if (bookInLibrary == null) {
            jo.addProperty("isbn", isbn);
            jo.addProperty("library_id", library_id);
            jo.addProperty("available", "true");
            String str = jo.toString();
            ebilt.addBookInLibraryFromJSON(str);
            return Response.status(Response.Status.OK)
                    .type("application/json")
                    .entity("{\"success\":\"Book Added in Library\"}")
                    .build();
        } else {

            return Response.status(Response.Status.BAD_REQUEST)
                    .type("application/json")
                    .entity("{\"error\":\"Book already in Library\"}")
                    .build();
        }


    }

    @GET
    @Path("/booksInLibraries")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getBooksInLibraries() throws ClassNotFoundException, SQLException {
        int i;
        EditBooksInLibraryTable ebil = new EditBooksInLibraryTable();

        ArrayList<BookInLibrary> allBooksInLibraries = ebil.databaseToBooksInLibraries();
        JsonArray ja = new JsonArray();

        for (i = 0; i < allBooksInLibraries.size(); ++i) {
            ja.add(ebil.bookInLibraryToJSON(allBooksInLibraries.get(i)));
        }
        return Response.status(Response.Status.OK)
                .type("application/json")
                .entity(ja.toString())
                .build();

    }

    @GET
    @Path("/bookInLibraries/{isbn}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getBookInLibraries(@PathParam("isbn") String isbn) throws ClassNotFoundException, SQLException {
        int i;
        EditBooksInLibraryTable ebil = new EditBooksInLibraryTable();
        ArrayList<BookInLibrary> bookInAvailableLibraries = ebil.databaseToBooksInLibraries(isbn, "true");
        JsonArray ja = new JsonArray();

        if (bookInAvailableLibraries.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .type("application/json")
                    .entity("{\"error\":\"Book not available in any library\"}")
                    .build();
        } else {
            for (i = 0; i < bookInAvailableLibraries.size(); ++i) {
                ja.add(ebil.bookInLibraryToJSON(bookInAvailableLibraries.get(i)));
            }
            return Response.status(Response.Status.OK)
                    .type("application/json")
                    .entity(ja.toString())
                    .build();
        }

    }
}
