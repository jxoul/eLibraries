package rest;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import database.tables.EditBooksInLibraryTable;
import database.tables.EditBooksTable;
import database.tables.EditBorrowingTable;
import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import mainClasses.Book;
import mainClasses.BookInLibrary;
import mainClasses.Borrowing;
import mainClasses.Librarian;
import mainClasses.Student;

/**
 * REST Web Service
 *
 * @author Giannis
 */
@Path("borrowings")
public class BorrowingsAPI {

    public BorrowingsAPI() {
    }

    @POST
    @Path("/request")
    @Consumes({MediaType.APPLICATION_JSON})
    public Response requestBorrowing(String borrowingJSON) throws ClassNotFoundException, SQLException {

        EditBorrowingTable ebt = new EditBorrowingTable();
        Borrowing bor = ebt.jsonToBorrowing(borrowingJSON);

        ebt.addBorrowingFromJSON(borrowingJSON);
        return Response.status(Response.Status.OK)
                .build();

    }

    @PUT
    @Path("/availability/{id}")
    public Response updateBook(@PathParam("bookcopy_id") int bookcopy_id) throws SQLException, ClassNotFoundException {
        EditBooksInLibraryTable ebil = new EditBooksInLibraryTable();
        String isAvailable = ebil.databaseToBookInLibraryAvailability(bookcopy_id);
        if ("true".equals(isAvailable)) {
            ebil.updateBookInLibrary(bookcopy_id, "false");
        } else {
            ebil.updateBookInLibrary(bookcopy_id, "true");
        }
        return null;
    }

    @GET
    @Path("/library/{library_id}/{status}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRequestedBorrowings(@PathParam("library_id") int library_id, @PathParam("status") String status) throws SQLException, ClassNotFoundException {
        int i;

        EditBooksInLibraryTable ebil = new EditBooksInLibraryTable();
        EditBorrowingTable ebt = new EditBorrowingTable();
        EditStudentsTable est = new EditStudentsTable();
        EditBooksTable ebookt = new EditBooksTable();
        ArrayList<BookInLibrary> allBooksInLibrary = ebil.databaseToBooksInLibrary(library_id);
        JsonObject jo;
        JsonArray returnJson = new JsonArray();
        if (allBooksInLibrary.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .type("application/json")
                    .entity("{\"error\":\"No books in library\"}")
                    .build();
        }
        int j = 0;
        for (i = 0; i < allBooksInLibrary.size(); ++i) {
            int bookcopy_id = allBooksInLibrary.get(i).getBookcopy_id();
            Borrowing borrowing = ebt.getIfStatus(bookcopy_id, status);
            if (borrowing != null) {
                jo = new JsonObject();
                jo.addProperty("bookcopy_id", borrowing.getBookcopy_id());
                jo.addProperty("fromdate", borrowing.getFromDate());
                jo.addProperty("todate", borrowing.getToDate());
                jo.addProperty("borrowing_id", borrowing.getBorrowing_id());

                int user_id = borrowing.getUser_id();
                Student student = est.databaseToStudent(user_id);
                jo.addProperty("student_name", student.getFirstName() + " " + student.getLastName());
                jo.addProperty("student_email", student.getEmail());
                jo.addProperty("student_id", student.getStudentID());
                jo.addProperty("student_telephone", student.getTelephone());

                String isbn = allBooksInLibrary.get(i).getIsbn();
                Book book = ebookt.databaseToBook(isbn);
                jo.addProperty("book_isbn", book.getIsbn());
                jo.addProperty("book_title", book.getTitle());
                jo.addProperty("book_photo", book.getPhoto());

                j++;
                returnJson.add(jo.toString());
            }
        }

        if (j == 0) {
            if (status.equals("requested")) {
                return Response.status(Response.Status.NOT_ACCEPTABLE)
                        .type("application/json")
                        .entity("{\"error\":\"No borrowing requests\"}")
                        .build();
            } else if (status.equals("borrowed")) {
                return Response.status(Response.Status.NOT_ACCEPTABLE)
                        .type("application/json")
                        .entity("{\"error\":\"No active borrowings\"}")
                        .build();
            } else {
                return Response.status(Response.Status.NOT_ACCEPTABLE)
                        .type("application/json")
                        .entity("{\"error\":\"No complete borrowings requests\"}")
                        .build();
            }
        } else {
            return Response.status(Response.Status.OK)
                    .type("application/json")
                    .entity(returnJson.toString())
                    .build();
        }
    }

    @PUT
    @Path("/borrowStatus/{borrowing_id}/{status}")
    public Response updateStatus(@PathParam("borrowing_id") int borrowing_id, @PathParam("status") String status) throws SQLException, ClassNotFoundException {
        EditBorrowingTable ebt = new EditBorrowingTable();
        ebt.updateBorrowing(borrowing_id, status);
        return Response.status(Response.Status.OK)
                .build();
    }

    @GET
    @Path("/student/{user_id}/{status}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getUserActiveBorrowings(@PathParam("user_id") int user_id, @PathParam("status") String status) throws SQLException, ClassNotFoundException {

        EditBooksInLibraryTable ebil = new EditBooksInLibraryTable();
        EditBorrowingTable ebt = new EditBorrowingTable();
        EditBooksTable ebookt = new EditBooksTable();
        EditLibrarianTable elt = new EditLibrarianTable();
        ArrayList<Borrowing> userBorrowings = ebt.databaseToUserBorrowings(user_id, status);
        JsonObject jo;
        JsonArray returnJson = new JsonArray();
        if (userBorrowings.isEmpty()) {
            if (status.equals("borrowed")) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .type("application/json")
                        .entity("{\"error\":\"No active borrowings\"}")
                        .build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .type("application/json")
                        .entity("{\"error\":\"No completed borrowings\"}")
                        .build();
            }

        }
        for (int i = 0; i < userBorrowings.size(); ++i) {
            jo = new JsonObject();
            int bookcopy_id = userBorrowings.get(i).getBookcopy_id();
            String fromDate = userBorrowings.get(i).getFromDate();
            String toDate = userBorrowings.get(i).getToDate();
            BookInLibrary bookcopy = ebil.databaseToBookInLibrary(bookcopy_id);
            int library_id = bookcopy.getLibrary_id();
            String bookisbn = bookcopy.getIsbn();
            Librarian library = elt.databaseToLibrarian(library_id);
            String libname = library.getLibraryName();
            String libinfo = library.getLibraryInfo();
            String telephone = library.getTelephone();
            Book book = ebookt.databaseToBook(bookisbn);
            String booktitle = book.getTitle();
            String bookphoto = book.getPhoto();
            jo.addProperty("borrowing_id", userBorrowings.get(i).getBorrowing_id());
            jo.addProperty("fromdate", fromDate);
            jo.addProperty("todate", toDate);
            jo.addProperty("book_title", booktitle);
            jo.addProperty("book_photo", bookphoto);
            jo.addProperty("book_isbn", bookisbn);
            jo.addProperty("lib_name", libname);
            jo.addProperty("lib_info", libinfo);
            jo.addProperty("lib_telephone", telephone);
            returnJson.add(jo.toString());
        }

        return Response.status(Response.Status.OK)
                .type("application/json")
                .entity(returnJson.toString())
                .build();
    }

}
