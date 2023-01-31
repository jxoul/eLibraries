package servlets;

import com.google.gson.JsonObject;
import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import java.io.IOException;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.Librarian;
import mainClasses.Student;

/**
 *
 * @author Giannis
 */
public class Login extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();
        JsonObject jo = new JsonObject();

        EditStudentsTable est = new EditStudentsTable();
        EditLibrarianTable elt = new EditLibrarianTable();

        String jsonString;
        String type;

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (session.getAttribute("loggedIn") != null) {

            try {
                Student st = est.databaseToStudent("username", session.getAttribute("loggedIn").toString());
                if (st == null) {
                    Librarian lb = elt.databaseToLibrarian("username", session.getAttribute("loggedIn").toString());
                    type = "librarian";
                    jsonString = elt.librarianToJSON(lb);
                } else {
                    type = "student";
                    jsonString = est.studentToJSON(st);
                }
                response.setStatus(200);
                jo.addProperty("success", jsonString);
                jo.addProperty("type", type);
            } catch (SQLException ex) {
                Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
                response.setStatus(502);
                jo.addProperty("error", "SQLException");
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
                response.setStatus(502);
                jo.addProperty("error", "ClassNotFoundException");
            }

        } else {
            response.setStatus(403);
            jo.addProperty("error", "Not Logged In");
        }
        response.getWriter().write(jo.toString());
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        JsonObject jo = new JsonObject();
        String jsonString;
        HttpSession session = request.getSession();

        String username = request.getParameter("login-username");
        String password = request.getParameter("login-password");
        String type;

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        EditStudentsTable est = new EditStudentsTable();
        EditLibrarianTable elt = new EditLibrarianTable();

        try {
            jsonString = est.databaseStudentToJSON(username, password);
            if (jsonString == null) {
                jsonString = elt.databaseLibrarianToJSON(username, password);
                type = "librarian";
            } else {
                type = "student";
            }
            if (jsonString != null) {
                session.setAttribute("loggedIn", username);
                response.setStatus(200);
                jo.addProperty("success", jsonString);
                jo.addProperty("type", type);
            } else {
                response.setStatus(401);
                jo.addProperty("error", "Wrong Credentials");
            }

        } catch (SQLException ex) {
            Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
            response.setStatus(502);
            jo.addProperty("error", "SQLException");
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
            response.setStatus(502);
            jo.addProperty("error", "ClassNotFoundException");
        }
        response.getWriter().write(jo.toString());
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
