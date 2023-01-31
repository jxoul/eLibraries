/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import com.google.gson.JsonObject;
import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.JSON_Converter;

/**
 *
 * @author Giannis
 */
public class Register extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String isStudent = request.getParameter("student");
        JSON_Converter jc = new JSON_Converter();
        JsonObject jo = new JsonObject();
        String str = jc.getJSONFromAjax(request.getReader());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {

            if ("true".equals(isStudent)) {
                EditStudentsTable est = new EditStudentsTable();
                est.addStudentFromJSON(str);
            } else {
                EditLibrarianTable elt = new EditLibrarianTable();
                elt.addLibrarianFromJSON(str);
            }
            response.setStatus(200);
            jo.addProperty("success", "Registration complete. Please Log in");
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
            response.setStatus(500);
            jo.addProperty("error", "Registration failed. Please try again");

        }
        response.getWriter().write(jo.toString());
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
