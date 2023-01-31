package mainClasses;

/**
 *
 * @author Giannis
 */
public class Student extends User {

    int user_id;
    String student_id;
    String university;
    String department;
    String student_type;
    String student_id_from_date;
    String student_id_to_date;

    public int getUserID() {
        return user_id;
    }

    public void setUserID(int user_id) {
        this.user_id = user_id;
    }

    public String getStudentID() {
        return student_id;
    }

    public void setStudentID(String student_id) {
        this.student_id = student_id;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getStudentType() {
        return student_type;
    }

    public void setStudentType(String student_type) {
        this.student_type = student_type;
    }

    public String getStudentID_FromDate() {
        return student_id_from_date;
    }

    public void setStudentID_FromDate(String student_id_from_date) {
        this.student_id_from_date = student_id_from_date;
    }

    public String getStudentID_ToDate() {
        return student_id_to_date;
    }

    public void setStudentID_ToDate(String student_id_to_date) {
        this.student_id_to_date = student_id_to_date;
    }
}
