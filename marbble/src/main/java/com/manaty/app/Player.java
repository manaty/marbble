package com.manaty.app;

/**
 * Created by janmanaloto on 20/07/2018.
 */
public class Player {
    private String id;
    private String username;

    public Player(String id, String username) {
        this.id = id;
        this.username = username;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
