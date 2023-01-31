package servlets;

import com.google.gson.Gson;
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
import mainClasses.JSON_Converter;

/**
 *
 * @author Giannis
 */
public class Update extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        JSON_Converter jc = new JSON_Converter();
        HttpSession session = request.getSession();

        String str = jc.getJSONFromAjax(request.getReader());
        String type = request.getParameter("type");
        String username = session.getAttribute("loggedIn").toString();

        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(str, JsonObject.class);
        JsonObject jo = new JsonObject();

        EditStudentsTable est = new EditStudentsTable();
        EditLibrarianTable elt = new EditLibrarianTable();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            if (type.equals("student")) {
                est.updateStudent(username, "password", jsonObject.get("password").getAsString());
                est.updateStudent(username, "firstname", jsonObject.get("firstname").getAsString());
                est.updateStudent(username, "lastname", jsonObject.get("lastname").getAsString());
                est.updateStudent(username, "birthdate", jsonObject.get("birthdate").getAsString());
                est.updateStudent(username, "gender", jsonObject.get("gender").getAsString());
                est.updateStudent(username, "personalpage", jsonObject.get("personalpage").getAsString());
                est.updateStudent(username, "telephone", jsonObject.get("telephone").getAsString());
                est.updateStudent(username, "country", jsonObject.get("country").getAsString());
                est.updateStudent(username, "city", jsonObject.get("city").getAsString());
                est.updateStudent(username, "address", jsonObject.get("address").getAsString());
                jo.addProperty("success", est.databaseStudentToJSON(username, jsonObject.get("password").getAsString()));
            } else {
                elt.updateLibrarian(username, "libraryname", jsonObject.get("libraryname").getAsString());
                elt.updateLibrarian(username, "libraryinfo", jsonObject.get("libraryinfo").getAsString());
                elt.updateLibrarian(username, "email", jsonObject.get("email").getAsString());
                elt.updateLibrarian(username, "password", jsonObject.get("password").getAsString());
                elt.updateLibrarian(username, "firstname", jsonObject.get("firstname").getAsString());
                elt.updateLibrarian(username, "lastname", jsonObject.get("lastname").getAsString());
                elt.updateLibrarian(username, "birthdate", jsonObject.get("birthdate").getAsString());
                elt.updateLibrarian(username, "gender", jsonObject.get("gender").getAsString());
                elt.updateLibrarian(username, "personalpage", jsonObject.get("personalpage").getAsString());
                elt.updateLibrarian(username, "telephone", jsonObject.get("telephone").getAsString());
                elt.updateLibrarian(username, "country", jsonObject.get("country").getAsString());
                elt.updateLibrarian(username, "city", jsonObject.get("city").getAsString());
                elt.updateLibrarian(username, "address", jsonObject.get("address").getAsString());
                jo.addProperty("success", elt.databaseLibrarianToJSON(username, jsonObject.get("password").getAsString()));
            }
            response.setStatus(200);

        } catch (SQLException ex) {
            Logger.getLogger(Update.class.getName()).log(Level.SEVERE, null, ex);
            response.setStatus(502);
            jo.addProperty("error", "SQLException");
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Update.class.getName()).log(Level.SEVERE, null, ex);
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
