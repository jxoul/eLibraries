package rest;

import java.util.Set;
import javax.ws.rs.core.Application;

/**
 *
 * @author stavros
 */
@javax.ws.rs.ApplicationPath("services")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(rest.BooksAPI.class);
        resources.add(rest.BorrowingsAPI.class);
        resources.add(rest.ReviewsAPI.class);
        resources.add(rest.UsersAPI.class);
    }
    
}
