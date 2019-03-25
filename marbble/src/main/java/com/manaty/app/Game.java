package com.manaty.app;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by janmanaloto on 20/07/2018.
 */
public class Game {
    private String id;
    private String data;
    private String sessionId;
    private List<Player> playerList = new ArrayList<Player>();

    public Game(String id, String data, List<Player> playerList) {
        this.id = id;
        this.data = data;
        this.playerList = playerList;
    }

    public Game(String id, String data, Player player) {
        this.id = id;
        this.data = data;
        playerList.add(player);
    }

    public Game(String id, String data, String sessionId, List<Player> playerList) {
        this.id = id;
        this.data = data;
        this.sessionId = sessionId;
        this.playerList = playerList;
    }

    public Game(String id, String data, String sessionId, Player player) {
        this.id = id;
        this.data = data;
        this.sessionId = sessionId;
        this.playerList.add(player);
    }

    public String getId() {

        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public List<Player> getPlayerList() {
        return playerList;
    }

    public void setPlayerList(List<Player> playerList) {
        this.playerList = playerList;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
