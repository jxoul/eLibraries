/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package database.tables;

import mainClasses.Student;
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
public class EditStudentsTable {

 
    public void addStudentFromJSON(String json) throws ClassNotFoundException{
         Student user=jsonToStudent(json);
         addNewStudent(user);
    }
    
    public Student jsonToStudent(String json) {
         Gson gson = new Gson();
         Student user = gson.fromJson(json, Student.class);
        return user;
    }
    
    public String studentToJSON(Student user){
         Gson gson = new Gson();

        String json = gson.toJson(user, Student.class);
        return json;
    }

    public void updateStudent(String username, String field, String val) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update = "UPDATE students SET " + field + "='" + val + "' WHERE username = '" + username + "'";
        System.out.println("UPDATE students SET " + field + "='" + val + "' WHERE username = '" + username + "'");
        stmt.executeUpdate(update);
    }
    
    public void printStudentDetails(String username, String password) throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM students WHERE username = '" + username + "' AND password='"+password+"'");
            while (rs.next()) {
                System.out.println("===Result===");
                DB_Connection.printResults(rs);
            }

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
    }
    
    public Student databaseToStudent(String field, String val) throws SQLException, ClassNotFoundException {
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM students WHERE " + field + " = '" + val + "'");
            System.out.println("SELECT * FROM students WHERE " + field + " = '" + val + "'");
            rs.next();
            String json=DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Student user = gson.fromJson(json, Student.class);
            return user;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public Student databaseToStudent(int user_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM students WHERE user_id = '" + user_id + "'");
            System.out.println("SELECT * FROM students WHERE user_id = '" + user_id + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Student user = gson.fromJson(json, Student.class);
            return user;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public String databaseStudentToJSON(String username, String password) throws SQLException, ClassNotFoundException{
         Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM students WHERE username = '" + username + "' AND password='"+password+"'");
            rs.next();
            String json=DB_Connection.getResultsToJSON(rs);
            return json;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void createStudentsTable() throws SQLException, ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE students "
                + "(user_id INTEGER not NULL AUTO_INCREMENT, "
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
                + "    student_type VARCHAR(50) not null,"
                + "    student_id VARCHAR(14) not null unique,"
                + "    student_id_from_date DATE not null,"
                + "    student_id_to_date DATE not null,"
                + "   university VARCHAR(50) not null,"
                + "   department VARCHAR(50) not null,"
                + "    lat DOUBLE,"
                + "    lon DOUBLE,"
                + "    telephone VARCHAR(14),"
                + "   personalpage VARCHAR(200),"
                + " PRIMARY KEY ( user_id))";
        stmt.execute(query);
        stmt.close();
    }
    
    public void addNewStudent(Student user) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " students (username,email,password,firstname,lastname,birthdate,gender,country,city,address,student_type,"
                    + "student_id,student_id_from_date,student_id_to_date,university,department,lat,lon,telephone,personalpage)"
                    + " VALUES ("
                    + "'" + user.getUsername() + "',"
                    + "'" + user.getEmail() + "',"
                    + "'" + user.getPassword() + "',"
                    + "'" + user.getFirstName() + "',"
                    + "'" + user.getLastName() + "',"
                    + "'" + user.getBirthdate() + "',"
                    + "'" + user.getGender() + "',"
                    + "'" + user.getCountry() + "',"
                    + "'" + user.getCity() + "',"
                    + "'" + user.getAddress() + "',"
                    + "'" + user.getStudentType() + "',"
                    + "'" + user.getStudentID() + "',"
                    + "'" + user.getStudentID_FromDate() + "',"
                    + "'" + user.getStudentID_ToDate() + "',"
                    + "'" + user.getUniversity() + "',"
                    + "'" + user.getDepartment() + "',"
                    + "'" + user.getLat() + "',"
                    + "'" + user.getLon() + "',"
                    + "'" + user.getTelephone() + "',"
                    + "'" + user.getPersonalPage() + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The user was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditStudentsTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public ArrayList<Student> databaseToStudents() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Student> students = new ArrayList<Student>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM students");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Student student = gson.fromJson(json, Student.class);
                students.add(student);
            }
            return students;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<Student> databaseToStudents(String field, String val) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Student> students = new ArrayList<Student>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM students WHERE " + field + " = '" + val + "'");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Student student = gson.fromJson(json, Student.class);
                students.add(student);
            }
            return students;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void deleteStudent(String username) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String deleteQuery = "DELETE FROM students WHERE username='" + username + "'";
        stmt.executeUpdate(deleteQuery);
        stmt.close();
        con.close();
    }
}
