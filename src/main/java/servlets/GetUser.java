package servlets;

import com.google.gson.JsonObject;
import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Librarian;
import mainClasses.Student;
/**
 *
 * @author Giannis
 */
public class GetUser extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        EditStudentsTable eut = new EditStudentsTable();
        EditLibrarianTable elt = new EditLibrarianTable();
        JsonObject jo = new JsonObject();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String field = request.getParameter("field");
        String val = request.getParameter("val");
        PrintWriter resout = response.getWriter();

        if ("student_id".equals(field)) {
            try {
                Student su = eut.databaseToStudent(field, val);
                if (su == null) {
                    response.setStatus(200);
                    jo.addProperty("success", "Valid " + field);
                } else {
                    response.setStatus(409);
                    jo.addProperty("error", "User with " + field + ": [" + val + "] exists");
                }
            } catch (SQLException ex) {
                Logger.getLogger(GetUser.class.getName()).log(Level.SEVERE, null, ex);
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(GetUser.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else {

            try {
                Student su = eut.databaseToStudent(field, val);

                Librarian lb = elt.databaseToLibrarian(field, val);
                if (su == null && lb == null) {
                    response.setStatus(200);
                    jo.addProperty("success", "Valid " + field);
                } else {
                    response.setStatus(409);
                    jo.addProperty("error", "User with " + field + ": [" + val + "] exists");
                }
            } catch (SQLException ex) {
                Logger.getLogger(GetUser.class.getName()).log(Level.SEVERE, null, ex);
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(GetUser.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        resout.write(jo.toString());

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
