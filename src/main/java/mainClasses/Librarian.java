package mainClasses;

/**
 *
 * @author Giannis
 */
public class Librarian extends User {
    int library_id;
    String libraryname;
    String libraryinfo;

    public int getLibraryID() {
        return library_id;
    }

    public void setLibraryID(int library_id) {
        this.library_id = library_id;
    }

    public String getLibraryName() {
        return libraryname;
    }

    public void setLibraryName(String libraryname) {
        this.libraryname = libraryname;
    }

    public String getLibraryInfo() {
        return libraryinfo;
    }

    public void setLibraryInfo(String libraryinfo) {
        this.libraryinfo = libraryinfo;
    }
}
