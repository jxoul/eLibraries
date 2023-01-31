package rest;

import com.google.gson.JsonArray;
import database.tables.EditBooksInLibraryTable;
import database.tables.EditBorrowingTable;
import database.tables.EditLibrarianTable;
import database.tables.EditReviewsTable;
import database.tables.EditStudentsTable;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import mainClasses.BookInLibrary;
import mainClasses.Borrowing;
import mainClasses.Librarian;
import mainClasses.Review;
import mainClasses.Student;

/**
 * REST Web Service
 *
 * @author Giannis
 */
@Path("users")
public class UsersAPI {

    public UsersAPI() {
    }

    @GET
    @Path("/all")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getUsers() throws ClassNotFoundException, SQLException {
        int i;
        EditStudentsTable est = new EditStudentsTable();
        EditLibrarianTable elt = new EditLibrarianTable();
        ArrayList<Student> allStudents = est.databaseToStudents();
        ArrayList<Librarian> allLibrarians = elt.databaseToLibrarians();
        JsonArray ja1 = new JsonArray();
        JsonArray ja2 = new JsonArray();
        for (i = 0; i < allStudents.size(); ++i) {
            ja1.add(est.studentToJSON(allStudents.get(i)));
        }
        for (i = 0; i < allLibrarians.size(); ++i) {
            ja2.add(elt.librarianToJSON(allLibrarians.get(i)));
        }

            return Response.status(Response.Status.OK)
                    .type("application/json")
                    .entity("{\"students\":" + ja1.toString() + ",\"librarians\":" + ja2.toString() + "}")
                    .build();

    }

    @DELETE
    @Path("/user/{username}/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response deleteUser(@PathParam("username") String username, @PathParam("type") String type) throws ClassNotFoundException, SQLException {
        int i;
        EditStudentsTable est = new EditStudentsTable();
        EditLibrarianTable elt = new EditLibrarianTable();
        EditBorrowingTable ebt = new EditBorrowingTable();
        EditReviewsTable ert = new EditReviewsTable();
        EditBooksInLibraryTable ebookt = new EditBooksInLibraryTable();
        if ("student".equals(type)) {
            Student student = est.databaseToStudent("username", username);
            int user_id = student.getUserID();
            ArrayList<Review> reviews = ert.userReviews(user_id);
            if (reviews != null) {
                ert.deleteUserReviews(user_id);
            }
            ArrayList<Borrowing> borrowings = ebt.userBorrowings(user_id);
            if (borrowings != null) {
                ebt.deleteUserBorrowings(user_id);
            }

            est.deleteStudent(username);
        } else {
            Librarian librarian = elt.databaseToLibrarian("username", username);
            int lib_id = librarian.getLibraryID();
            ArrayList<BookInLibrary> booksInLibrary = ebookt.databaseToBooksInLibrary(lib_id);
            if (booksInLibrary.size() != 0) {
                for (i = 0; i < booksInLibrary.size(); i++) {
                    int bookcopy_id = booksInLibrary.get(i).getBookcopy_id();
                    ebt.deleteBookBorrowings(bookcopy_id);
                }
                ebookt.deleteBooksInLibrary(lib_id);
            }
            elt.deleteLibrarian(username);
        }

        return Response.status(Response.Status.OK)
                .type("application/json")
                .entity("{\"success\":\"" + username + " deleted\"}")
                .build();
    }

    @GET
    @Path("/librarians")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getLibrarians() throws ClassNotFoundException, SQLException {
        int i;
        EditLibrarianTable elt = new EditLibrarianTable();

        ArrayList<Librarian> allLibrarians = elt.databaseToLibrarians();
        JsonArray ja = new JsonArray();

        for (i = 0; i < allLibrarians.size(); ++i) {
            ja.add(elt.librarianToJSON(allLibrarians.get(i)));
        }
        return Response.status(Response.Status.OK)
                .type("application/json")
                .entity(ja.toString())
                .build();

    }

    @GET
    @Path("/students")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStudents() throws ClassNotFoundException, SQLException {
        int i;
        EditStudentsTable est = new EditStudentsTable();

        ArrayList<Student> allStudents = est.databaseToStudents();
        JsonArray ja = new JsonArray();

        for (i = 0; i < allStudents.size(); ++i) {
            ja.add(est.studentToJSON(allStudents.get(i)));
        }
        return Response.status(Response.Status.OK)
                .type("application/json")
                .entity(ja.toString())
                .build();
    }

    @POST
    @Path("/libraries")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getLibraries(String ids) throws ClassNotFoundException, SQLException {
        int[] libraries_id = stringToIntArray(ids);
        int i;
        JsonArray ja = new JsonArray();
        EditLibrarianTable elt = new EditLibrarianTable();
        ArrayList<Librarian> libraries;
        Librarian library;
        for (i = 0; i < libraries_id.length; ++i) {
            library = elt.databaseToLibrarian(libraries_id[i]);
            ja.add(elt.librarianToJSON(library));
        }
        return Response.status(Response.Status.OK)
                .type("application/json")
                .entity(ja.toString())
                .build();
    }

    int[] stringToIntArray(String s) {
        String[] stringArray = s.replace("[", "").replace("]", "").split(",");
        int[] intArray = new int[stringArray.length];
        for (int i = 0; i < stringArray.length; i++) {
            intArray[i] = Integer.parseInt(stringArray[i]);
        }
        return intArray;
    }

}
