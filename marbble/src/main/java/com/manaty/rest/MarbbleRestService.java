package com.manaty.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

/**
 * Created by janmanaloto on 18/06/2018.
 */
@Path("/")
public class MarbbleRestService {
    @GET // This annotation indicates GET request
    @Path("/hello")
    public Response hello() {
        return Response.status(200).entity("hello").build();
    }
}
