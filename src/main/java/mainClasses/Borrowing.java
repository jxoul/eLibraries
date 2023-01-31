package mainClasses;

/**
 *
 * @author Giannis
 */
public class Borrowing {
    int borrowing_id, bookcopy_id, user_id;
    String fromDate, toDate, status;

    public int getBorrowing_id() {
        return borrowing_id;
    }

    public void setBorrowing_id(int borrowing_id) {
        this.borrowing_id = borrowing_id;
    }

    public int getBookcopy_id() {
        return bookcopy_id;
    }

    public void setBookcopy_id(int bookcopy_id) {
        this.bookcopy_id = bookcopy_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getFromDate() {
        return fromDate;
    }

    public void setFromDate(String fromDate) {
        this.fromDate = fromDate;
    }

    public String getToDate() {
        return toDate;
    }

    public void setToDate(String toDate) {
        this.toDate = toDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
