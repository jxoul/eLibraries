package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Giannis
 */
public class AdminLogin extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setStatus(200);
        response.setContentType("text/html;charset=UTF-8");
        try ( PrintWriter out = response.getWriter()) {

            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Administrator Login</title>");
            out.println("<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js\"></script>");
            out.println("<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />");
            out.println("<script src='https://www.gstatic.com/charts/loader.js'></script>");
            out.println("<script src='js/charts.js' defer></script>");
            // out.println("<script src='js/utilities.js' defer></script>");
            out.println("<script src='js/form.js' defer></script>");
            out.println("<script src='js/ajax.js' defer></script>");
            out.println("<script src='js/administrator.js' defer></script>");
            out.println(" <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi' crossorigin='anonymous'/>");
            out.println("");
            out.println("");
            out.println("");
            out.println("<link rel='stylesheet' type='text/css' href='css/styles.css' />");
            out.println("<link rel='stylesheet' type='text/css' href='css/administrator-stats.css' />");
            out.println("</head>");
            out.println("<body>");
            out.println("<div id='content'>");
            out.println("<h1>Administrator Login</h1>");
            out.println("<form id=\"admin-form\" name=\"admin-form\" onsubmit=\"adminSubmitForm();return false;\">");
            out.println("<div>\n"
                    + "    <label for=\"admin-username\">Username</label>\n"
                    + "      <input\n"
                    + "        type=\"text\"\n"
                    + "        id=\"admin-username\"\n"
                    + "        required/>\n"
                    + "  </div>");
            out.println("<div>\n"
                    + "    <label for=\"admin-password\">Password</label>\n"
                    + "      <input\n"
                    + "        type=\"password\"\n"
                    + "        id=\"admin-password\"\n"
                    + "        required/>\n"
                    + "  </div>");
            out.println("<button id=\"admin-login-btn\" type=\"submit\">Login</button>\n"
                    + "  <div id=\"admin-login-msg\"></div>\n"
                    + "</form>");
            out.println("<script>function adminSubmitForm() {\n"
                    + "var xhr = new XMLHttpRequest();\n"
                    + "var username = $(\"#admin-username\").val();\n"
                    + "var password= $(\"#admin-password\").val();\n"
                    + "xhr.open(\"POST\", \"admin-login?username=\" + username + \"&password=\" + password);"
                    + "xhr.setRequestHeader(\"Content-type\", \"application/x-www-form-urlencoded\");\n"
                    + "xhr.send();\n"
                    + " xhr.onload = function () {"
                    + "if (xhr.readyState === 4 && xhr.status === 200) {"
                    + "loadAdminHomePage();"
                    + "}else{"
                    + "$(\"#admin-login-msg\").text(xhr.responseText);"
                    + "}}"
                    + "}</script>");
            out.println("</div>");
            out.println("</body>");
            out.println("</html>");
            out.println("  ");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        response.setContentType("plain/text");
        response.setCharacterEncoding("UTF-8");
        if ("admin".equals(username) && "admin12*".equals(password)) {
            response.setStatus(200);
            response.getWriter().write("Correct Credentials");
        } else {
            response.setStatus(401);
            response.getWriter().write("Wrong Credentials");
        }

    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }
}
