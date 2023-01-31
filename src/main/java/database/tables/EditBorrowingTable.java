package database.tables;

import com.google.gson.Gson;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.Borrowing;

/**
 *
 * @author Giannis
 */
public class EditBorrowingTable {

    public void addBorrowingFromJSON(String json) throws ClassNotFoundException {
        Borrowing r = jsonToBorrowing(json);
        createNewBorrowing(r);
    }

    public Borrowing databaseToBorrowing(int id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM borrowing WHERE borrowing_id= '" + id + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            String updatedJSON = fixJson(json);
            Gson gson = new Gson();
            Borrowing bt = gson.fromJson(updatedJSON, Borrowing.class);
            return bt;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<Borrowing> userBorrowings(int user_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Borrowing> bors = new ArrayList<Borrowing>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM borrowing where user_id='" + user_id + "'");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Borrowing bor = gson.fromJson(json, Borrowing.class);
                bors.add(bor);
            }
            return bors;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<Borrowing> databaseToUserBorrowings(int user_id, String status) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Borrowing> borrowings = new ArrayList<Borrowing>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM borrowing WHERE user_id='" + user_id + "' AND  status= '" + status + "'");
            System.out.println("SELECT * FROM borrowing WHERE user_id='" + user_id + "' AND  status= '" + status + "'");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                String updatedJSON = fixJson(json);
                Gson gson = new Gson();

                Borrowing borrowing = gson.fromJson(updatedJSON, Borrowing.class);
                borrowings.add(borrowing);
            }
            return borrowings;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public Borrowing jsonToBorrowing(String json) {
        Gson gson = new Gson();
        Borrowing r = gson.fromJson(json, Borrowing.class);
        return r;
    }

    public String borrowingToJSON(Borrowing r) {
        Gson gson = new Gson();

        String json = gson.toJson(r, Borrowing.class);
        return json;
    }

    public void updateBorrowing(int borrowingID, int userID, String info, String status) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String updateQuery = "UPDATE borrowing SET status";//...

        stmt.executeUpdate(updateQuery);
        stmt.close();
        con.close();
    }

    public void deleteBorrowing(int randevouzID) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String deleteQuery = "DELETE FROM borrowing WHERE borrowing_id='" + randevouzID + "'";
        stmt.executeUpdate(deleteQuery);
        stmt.close();
        con.close();
    }

    public void deleteUserBorrowings(int user_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String deleteQuery = "DELETE FROM borrowing WHERE user_id='" + user_id + "'";
        stmt.executeUpdate(deleteQuery);
        stmt.close();
        con.close();
    }

    public void deleteBookBorrowings(int bookcopy_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String deleteQuery = "DELETE FROM borrowing WHERE bookcopy_id='" + bookcopy_id + "'";
        stmt.executeUpdate(deleteQuery);
        stmt.close();
        con.close();
    }

    public void createBorrowingTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String sql = "CREATE TABLE borrowing "
                + "(borrowing_id INTEGER not NULL AUTO_INCREMENT, "
                + " bookcopy_id INTEGER not NULL, "
                + " user_id INTEGER not NULL, "
                + " fromdate DATE not NULL, "
                + " todate DATE not NULL, "
                + " status VARCHAR(15) not NULL, "
                + "FOREIGN KEY (user_id) REFERENCES students(user_id), "
                + "FOREIGN KEY (bookcopy_id) REFERENCES booksinlibraries(bookcopy_id), "
                + " PRIMARY KEY (borrowing_id))";
        stmt.execute(sql);
        stmt.close();
        con.close();

    }

    public void createNewBorrowing(Borrowing bor) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " borrowing (bookcopy_id,user_id,fromDate,toDate,status)"
                    + " VALUES ("
                    + "'" + bor.getBookcopy_id() + "',"
                    + "'" + bor.getUser_id() + "',"
                    + "'" + bor.getFromDate() + "',"
                    + "'" + bor.getToDate() + "',"
                    + "'" + bor.getStatus() + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The borrowing was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditBorrowingTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public Borrowing getIfStatus(int bookcopy_id, String status) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM borrowing WHERE bookcopy_id= '" + bookcopy_id + "' AND status = '" + status + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            String updatedJSON = fixJson(json);

            Gson gson = new Gson();
            Borrowing bt = gson.fromJson(updatedJSON, Borrowing.class);
            return bt;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void updateBorrowing(int borrowingID, String status) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String updateQuery = "UPDATE borrowing SET status='" + status + "' WHERE borrowing_id='" + borrowingID + "'";

        stmt.executeUpdate(updateQuery);
        stmt.close();
        con.close();
    }

    public String fixJson(String json) {
        String oldFrom = "fromdate";
        String newFrom = "fromDate";
        String oldTo = "todate";
        String newTo = "toDate";
        String update1 = json.replace(oldFrom, newFrom);
        String update2 = update1.replace(oldTo, newTo);
        return update2;
    }
}
