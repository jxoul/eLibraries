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
import mainClasses.Review;

/**
 *
 * @author Giannis
 */
public class EditReviewsTable {
    public void addReviewFromJSON(String json) throws ClassNotFoundException {
        Review msg = jsonToReview(json);
        createNewReview(msg);
    }

    public Review jsonToReview(String json) {
        Gson gson = new Gson();
        Review msg = gson.fromJson(json, Review.class);
        return msg;
    }

    public String reviewToJSON(Review msg) {
        Gson gson = new Gson();

        String json = gson.toJson(msg, Review.class);
        return json;
    }

    public Review databaseToReview(int id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM reviews WHERE review_id= '" + id + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Review bt = gson.fromJson(json, Review.class);
            return bt;
        } catch (Exception e) {
            System.err.println("Got an exception! ");

        }
        return null;
    }

    public Review databaseToReview(int user_id, String isbn) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM reviews WHERE user_id= '" + user_id + "' AND isbn='" + isbn + "'");
            System.out.println("SELECT * FROM reviews WHERE user_id= '" + user_id + "' AND isbn='" + isbn + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Review bt = gson.fromJson(json, Review.class);
            return bt;
        } catch (Exception e) {
            System.err.println("Got an exception! ");

        }
        return null;
    }

    public ArrayList<Review> databaseToReviews(String isbn) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Review> revs = new ArrayList<Review>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM reviews where isbn='" + isbn + "'");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Review rev = gson.fromJson(json, Review.class);
                revs.add(rev);
            }
            return revs;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<Review> userReviews(int user_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Review> revs = new ArrayList<Review>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM reviews where user_id='" + user_id + "'");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Review rev = gson.fromJson(json, Review.class);
                revs.add(rev);
            }
            return revs;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void createReviewTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String sql = "CREATE TABLE reviews "
                + "(review_id INTEGER not NULL AUTO_INCREMENT, "
                + "user_id INTEGER not null,"
                + "isbn VARCHAR(13) not NULL, "
                + "reviewText VARCHAR(2000) not null,"
                + "reviewScore INTEGER not null,"
                + "FOREIGN KEY (user_id) REFERENCES students(user_id), "
                + "FOREIGN KEY (isbn) REFERENCES books(isbn), "
                + "PRIMARY KEY ( review_id ))";
        stmt.execute(sql);
        stmt.close();
        con.close();

    }

    public void createNewReview(Review rev) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " reviews (user_id,isbn,reviewText,reviewScore) "
                    + " VALUES ("
                    + "'" + rev.getUser_id() + "',"
                    + "'" + rev.getIsbn() + "',"
                    + "'" + rev.getReviewText() + "',"
                    + "'" + rev.getReviewScore() + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The review was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditBooksTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void updateReview(int review_id, String reviewText, String reviewScore) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String update = "UPDATE reviews SET reviewText='" + reviewText + "' WHERE review_id = '" + review_id + "'";
        stmt.executeUpdate(update);
        System.out.println(update);
        String update2 = "UPDATE reviews SET reviewScore='" + reviewScore + "' WHERE review_id = '" + review_id + "'";
        stmt.executeUpdate(update2);
        System.out.println(update2);
    }

    public void deleteUserReviews(int user_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String deleteQuery = "DELETE FROM reviews WHERE user_id='" + user_id + "'";
        stmt.executeUpdate(deleteQuery);
        stmt.close();
        con.close();
    }

    public void deleteReview(int review_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String deleteQuery = "DELETE FROM reviews WHERE review_id='" + review_id + "'";
        stmt.executeUpdate(deleteQuery);
        stmt.close();
        con.close();
    }
}
