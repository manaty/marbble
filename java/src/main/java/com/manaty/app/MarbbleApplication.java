package com.manaty.app;

/**
 * Created by janmanaloto on 18/06/2018.
 */
import com.manaty.rest.MarbbleRestService;

import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;
public class MarbbleApplication extends Application {
    private Set<Object> singletons = new HashSet<Object>();
    public MarbbleApplication() {
        // Register our hello service
        singletons.add(new MarbbleRestService());
    }
    @Override
    public Set<Object> getSingletons() {
        return singletons;
    }
}