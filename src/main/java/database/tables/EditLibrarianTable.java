package database.tables;

import mainClasses.Librarian;
import com.google.gson.Gson;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Mike
 */
public class EditLibrarianTable {

    public void addLibrarianFromJSON(String json) throws ClassNotFoundException {
        Librarian lib = jsonToLibrarian(json);
        addNewLibrarian(lib);
    }

    public Librarian jsonToLibrarian(String json) {
        Gson gson = new Gson();

        Librarian lib = gson.fromJson(json, Librarian.class);
        return lib;
    }

    public String librarianToJSON(Librarian lib) {
        Gson gson = new Gson();

        String json = gson.toJson(lib, Librarian.class);
        return json;
    }

    public void updateLibrarian(String username, String field, String val) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update = "UPDATE librarians SET " + field + "='" + val + "' WHERE username = '" + username + "'";
        System.out.println("UPDATE librarians SET " + field + "='" + val + "' WHERE username = '" + username + "'");
        stmt.executeUpdate(update);
    }

    public void printLibrarianDetails(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM librarians WHERE username = '" + username + "' AND password='" + password + "'");
            while (rs.next()) {
                System.out.println("===Result===");
                DB_Connection.printResults(rs);
            }

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
    }

    public Librarian databaseToLibrarian(String field, String val) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM librarians WHERE  " + field + " = '" + val + "'");
            System.out.println("SELECT * FROM librarians WHERE  " + field + " = '" + val + "'");

            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Librarian lib = gson.fromJson(json, Librarian.class);
            return lib;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<Librarian> databaseToLibrarians() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Librarian> librarians = new ArrayList<Librarian>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM librarians");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Librarian lib = gson.fromJson(json, Librarian.class);
                librarians.add(lib);
            }
            return librarians;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void createLibrariansTable() throws SQLException, ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE librarians"
                + "(library_id INTEGER not NULL AUTO_INCREMENT, "
                + "    username VARCHAR(30) not null unique,"
                + "    email VARCHAR(200) not null unique,	"
                + "    password VARCHAR(32) not null,"
                + "    firstname VARCHAR(30) not null,"
                + "    lastname VARCHAR(30) not null,"
                + "    birthdate DATE not null,"
                + "    gender  VARCHAR (7) not null,"
                + "    country VARCHAR(30) not null,"
                + "    city VARCHAR(50) not null,"
                + "    address VARCHAR(50) not null,"
                + "    libraryname VARCHAR(100) not null,"
                + "    libraryinfo VARCHAR(1000) not null,"
                + "    lat DOUBLE,"
                + "    lon DOUBLE,"
                + "    telephone VARCHAR(14),"
                + "    personalpage VARCHAR(200),"
                + " PRIMARY KEY (library_id))";
        stmt.execute(query);
        stmt.close();
    }

    public void addNewLibrarian(Librarian lib) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " librarians (username,email,password,firstname,lastname,birthdate,gender,country,city,address,"
                    + "libraryname,libraryinfo,lat,lon,telephone,personalpage)"
                    + " VALUES ("
                    + "'" + lib.getUsername() + "',"
                    + "'" + lib.getEmail() + "',"
                    + "'" + lib.getPassword() + "',"
                    + "'" + lib.getFirstName() + "',"
                    + "'" + lib.getLastName() + "',"
                    + "'" + lib.getBirthdate() + "',"
                    + "'" + lib.getGender() + "',"
                    + "'" + lib.getCountry() + "',"
                    + "'" + lib.getCity() + "',"
                    + "'" + lib.getAddress() + "',"
                    + "'" + lib.getLibraryName() + "',"
                    + "'" + lib.getLibraryInfo() + "',"
                    + "'" + lib.getLat() + "',"
                    + "'" + lib.getLon() + "',"
                    + "'" + lib.getTelephone() + "',"
                    + "'" + lib.getPersonalPage() + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The libarian was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditLibrarianTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public String databaseLibrarianToJSON(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM librarians WHERE username = '" + username + "' AND password='" + password + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            return json;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void deleteLibrarian(String username) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String deleteQuery = "DELETE FROM librarians WHERE username='" + username + "'";
        stmt.executeUpdate(deleteQuery);
        stmt.close();
        con.close();
    }

    public Librarian databaseToLibrarian(int id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM librarians WHERE  library_id = '" + id + "'");
            System.out.println("SELECT * FROM librarians WHERE  library_id = '" + id + "'");

            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Librarian lib = gson.fromJson(json, Librarian.class);
            return lib;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

}
