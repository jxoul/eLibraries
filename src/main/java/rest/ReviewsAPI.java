package rest;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import database.tables.EditReviewsTable;
import database.tables.EditStudentsTable;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import mainClasses.Review;
import mainClasses.Student;

/**
 * REST Web Service
 *
 * @author Giannis
 */
@Path("reviews")
public class ReviewsAPI {

    public ReviewsAPI() {
    }

    @GET
    @Path("/review/{user_id}/{isbn}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getReview(@PathParam("user_id") int user_id, @PathParam("isbn") String isbn) throws SQLException, ClassNotFoundException {
        EditReviewsTable ert = new EditReviewsTable();
        Review review = ert.databaseToReview(user_id, isbn);
        if (review == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .type("application/json")
                    .entity("{\"error\":\"No review\"}")
                    .build();
        } else {
            JsonObject jo = new JsonObject();
            jo.addProperty("review_id", review.getReview_id());
            jo.addProperty("reviewText", review.getReviewText());
            jo.addProperty("reviewScore", review.getReviewScore());

            return Response.status(Response.Status.OK)
                    .type("application/json")
                    .entity(jo.toString())
                    .build();
        }

    }

    @POST
    @Path("/newReview")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response postNewReview(String reviewJSON) throws SQLException, ClassNotFoundException {
        EditReviewsTable ert = new EditReviewsTable();
        ert.addReviewFromJSON(reviewJSON);
        return Response.status(Response.Status.OK)
                .type("application/json")
                .entity("{\"success\":\"Review Submited\"}")
                .build();
    }

    @PUT
    @Path("/reviewID/{review_id}")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response editReview(String reviewJSON, @PathParam("review_id") int review_id) throws SQLException, ClassNotFoundException {
        EditReviewsTable ert = new EditReviewsTable();
        Review review = ert.jsonToReview(reviewJSON);
        ert.updateReview(review_id, review.getReviewText(), review.getReviewScore());
        return Response.status(Response.Status.OK)
                .type("application/json")
                .entity("{\"success\":\"Review Edited\"}")
                .build();
    }

    @GET
    @Path("/usersReviews/{isbn}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getReviews(@PathParam("isbn") String isbn) throws SQLException, ClassNotFoundException {
        EditReviewsTable ert = new EditReviewsTable();
        EditStudentsTable est = new EditStudentsTable();
        ArrayList<Review> reviews = ert.databaseToReviews(isbn);
        if (reviews.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .type("application/json")
                    .entity("{\"error\":\"No reviews for this book\"}")
                    .build();
        }
        JsonObject jo;
        JsonArray returnJson = new JsonArray();
        for (int i = 0; i < reviews.size(); i++) {
            jo = new JsonObject();
            String reviewText = reviews.get(i).getReviewText();
            String reviewScore = reviews.get(i).getReviewScore();
            int user_id = reviews.get(i).getUser_id();
            Student student = est.databaseToStudent(user_id);
            String fname = student.getFirstName();
            String lname = student.getLastName();
            String name = fname + " " + lname;
            jo.addProperty("name", name);
            jo.addProperty("reviewText", reviewText);
            jo.addProperty("reviewScore", reviewScore);
            returnJson.add(jo.toString());
        }
        return Response.status(Response.Status.OK)
                .type("application/json")
                .entity(returnJson.toString())
                .build();
    }

    @DELETE
    @Path("/review/{review_id}")
    public Response deleteReview(@PathParam("review_id") int review_id) throws SQLException, ClassNotFoundException {
        EditReviewsTable ert = new EditReviewsTable();
        ert.deleteReview(review_id);
        return Response.status(Response.Status.OK)
                .build();
    }
}
