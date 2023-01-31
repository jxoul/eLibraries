package servlets;

import com.itextpdf.text.Chapter;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import database.tables.EditBooksInLibraryTable;
import database.tables.EditBooksTable;
import database.tables.EditBorrowingTable;
import database.tables.EditStudentsTable;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Book;
import mainClasses.BookInLibrary;
import mainClasses.Borrowing;
import mainClasses.Student;

/**
 *
 * @author Giannis
 */
public class PdfCreator extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String str = request.getParameter("borrowing_id");
        int borrowing_id = Integer.parseInt(str);

        EditBorrowingTable ebt = new EditBorrowingTable();
        EditStudentsTable est = new EditStudentsTable();
        EditBooksTable ebookt = new EditBooksTable();
        EditBooksInLibraryTable ebilt = new EditBooksInLibraryTable();

        Document document = new Document();
        String pdfFileName = "borrowing" + str + "_info";

        try {
            PdfWriter.getInstance(document, new FileOutputStream(pdfFileName));
            Borrowing borrowing = ebt.databaseToBorrowing(borrowing_id);
            document.open();

            Font font = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Borrowing Information", font);
            Chapter chapter = new Chapter(title, 1);
            chapter.setNumberDepth(0);

            chapter.add(new Paragraph("Borrowing ID: " + str));
            chapter.add(new Paragraph("From Date: " + borrowing.getFromDate()));
            chapter.add(new Paragraph("To Date: " + borrowing.getToDate()));
            document.add(chapter);

            int bookcopy_id = borrowing.getBookcopy_id();
            BookInLibrary bookinlib = ebilt.databaseToBookInLibrary(bookcopy_id);
            String isbn = bookinlib.getIsbn();
            Book book = ebookt.databaseToBook(isbn);
            title = new Paragraph("Book Information", font);
            chapter = new Chapter(title, 2);
            chapter.setNumberDepth(0);
            chapter.add(new Paragraph("Book Copy ID: " + bookcopy_id));
            chapter.add(new Paragraph("ISBN: " + isbn));
            chapter.add(new Paragraph("Title: " + book.getTitle()));
            chapter.add(new Paragraph("Authors: " + book.getAuthors()));
            chapter.add(new Paragraph("Genre: " + book.getGenre()));
            chapter.add(new Paragraph("Publication Year: " + book.getPublicationyear()));
            chapter.add(new Paragraph("URL: " + book.getUrl()));
            URL url = new URL(book.getPhoto());
            Image img = Image.getInstance(url);
            chapter.add(img);
            document.add(chapter);

            int user_id = borrowing.getUser_id();
            Student student = est.databaseToStudent(user_id);
            title = new Paragraph("Student Information", font);
            chapter = new Chapter(title, 3);
            chapter.setNumberDepth(0);
            chapter.add(new Paragraph("Full Name: " + student.getFirstName() + " " + student.getLastName()));
            chapter.add(new Paragraph("Email: " + student.getEmail()));
            chapter.add(new Paragraph("Address: " + student.getAddress() + " " + student.getCity() + ", " + student.getCountry()));
            chapter.add(new Paragraph("Telephone: " + student.getTelephone()));
            chapter.add(new Paragraph("Personal Page: " + student.getPersonalPage()));
            chapter.add(new Paragraph("Student Type: " + student.getStudentType()));
            chapter.add(new Paragraph("Student ID: " + student.getStudentID()));
            chapter.add(new Paragraph("University: " + student.getUniversity()));
            chapter.add(new Paragraph("Department: " + student.getDepartment()));
            document.add(chapter);

            document.close();
        } catch (SQLException ex) {
            Logger.getLogger(PdfCreator.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(PdfCreator.class.getName()).log(Level.SEVERE, null, ex);
        } catch (DocumentException ex) {
            Logger.getLogger(PdfCreator.class.getName()).log(Level.SEVERE, null, ex);
        }

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=" + pdfFileName);
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        OutputStream os = response.getOutputStream();
        FileInputStream fis = new FileInputStream(pdfFileName);
        byte[] buffer = new byte[1024];
        int len;
        while ((len = fis.read(buffer)) > 0) {
            os.write(buffer, 0, len);
        }
        os.flush();
        os.close();
        fis.close();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

}
