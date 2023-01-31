package database.tables;

import com.google.gson.Gson;
import database.tables.EditBooksTable;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.BookInLibrary;
/**
 *
 * @author Giannis
 */
public class EditBooksInLibraryTable {
    public void addBookInLibraryFromJSON(String json) throws ClassNotFoundException {
        BookInLibrary msg = jsonTobookInLibrary(json);
        createNewBookInLibrary(msg);
    }

    public String bookInLibraryToJSON(BookInLibrary tr) {
        Gson gson = new Gson();

        String json = gson.toJson(tr, BookInLibrary.class);
        return json;
    }

    public BookInLibrary jsonTobookInLibrary(String json) {
        Gson gson = new Gson();
        BookInLibrary tr = gson.fromJson(json, BookInLibrary.class);
        return tr;
    }

    public BookInLibrary databaseToBookInLibrary(int bookcopy_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM booksinlibraries WHERE bookcopy_id= '" + bookcopy_id + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            BookInLibrary tr = gson.fromJson(json, BookInLibrary.class);
            return tr;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public BookInLibrary databaseToBookInLibrary(int id, String isbn) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM booksinlibraries WHERE library_id= '" + id + "' AND isbn= '" + isbn + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            BookInLibrary tr = gson.fromJson(json, BookInLibrary.class);
            return tr;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public String databaseToBookInLibraryAvailability(int id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT available FROM booksinlibraries WHERE bookcopy_id= '" + id + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            BookInLibrary tr = gson.fromJson(json, BookInLibrary.class);
            return tr.getAvailable();
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void createBooksInLibrary() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String sql = "CREATE TABLE booksinlibraries "
                + "(bookcopy_id INTEGER not NULL AUTO_INCREMENT, "
                + "isbn  VARCHAR(13) not null,"
                + "library_id INTEGER not null,"
                + "available VARCHAR(5) not null,"
                + "FOREIGN KEY (isbn) REFERENCES books(isbn), "
                + "FOREIGN KEY (library_id) REFERENCES librarians(library_id), "
                + "PRIMARY KEY ( bookcopy_id ))";
        stmt.execute(sql);
        stmt.close();
        con.close();

    }

    public void updateBookInLibrary(int bookcopy_id, String available) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String update = "UPDATE booksinlibraries SET available='" + available + "'" + " WHERE bookcopy_id = '" + bookcopy_id + "'";
        System.out.println(update);
        stmt.executeUpdate(update);
    }

    public void createNewBookInLibrary(BookInLibrary bi) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " booksinlibraries (isbn,library_id,available) "
                    + " VALUES ("
                    + "'" + bi.getIsbn() + "',"
                    + "'" + bi.getLibrary_id() + "',"
                    + "'" + bi.getAvailable() + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The entry was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();
            con.close();
        } catch (SQLException ex) {
            Logger.getLogger(EditBooksTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public ArrayList<BookInLibrary> databaseToBooksInLibraries() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<BookInLibrary> booksInLibraries = new ArrayList<BookInLibrary>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM booksinlibraries");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                BookInLibrary bil = gson.fromJson(json, BookInLibrary.class);
                booksInLibraries.add(bil);
            }
            return booksInLibraries;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<BookInLibrary> databaseToBooksInLibraries(String isbn, String available) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<BookInLibrary> booksInLibraries = new ArrayList<BookInLibrary>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM booksinlibraries WHERE isbn='" + isbn + "'AND available= '" + available + "'");
            System.out.println("SELECT * FROM booksinlibraries WHERE isbn='" + isbn + "' AND available= '" + available + "'");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                BookInLibrary bil = gson.fromJson(json, BookInLibrary.class);
                booksInLibraries.add(bil);
            }
            return booksInLibraries;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<BookInLibrary> databaseToBooksInLibrary(int library_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<BookInLibrary> booksInLibrary = new ArrayList<BookInLibrary>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM booksinlibraries WHERE library_id= '" + library_id + "'");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                BookInLibrary bil = gson.fromJson(json, BookInLibrary.class);
                booksInLibrary.add(bil);
            }
            return booksInLibrary;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void deleteBooksInLibrary(int library_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String deleteQuery = "DELETE FROM booksinlibraries WHERE library_id='" + library_id + "'";
        stmt.executeUpdate(deleteQuery);
        stmt.close();
        con.close();
    }
}
