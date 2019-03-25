package com.manaty.app;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.jboss.logging.Logger;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;

@ServerEndpoint("/signaling")
public class Signaling {
    Logger log = Logger.getLogger(this.getClass());
    private static Set<Session> clients =
            Collections.synchronizedSet(new HashSet<Session>());

//    private static JsonArray gameList = new JsonArray();

    private static List<Game> gameList = new ArrayList<Game>();
    private static JsonArray clientList = new JsonArray();
    private JsonObject jsonClient;
    private String message;
    private Session session;

    @OnMessage
    public void receiveMessage(String message, Session session) throws IOException {
            log.info("Received : "+ message + ", session:" + session.getId());
            this.message = message;
            this.session = session;
            JsonParser jsonParser = new JsonParser();
            jsonClient = jsonParser.parse(message).getAsJsonObject();
            jsonClient.addProperty("sessionId", session.getId());

            String type = jsonClient.get("type").toString();
            type = type.replaceAll("\"","");

            clientList.add(jsonClient);

            if(type.equalsIgnoreCase("fetchList")) {
                fetchList();
            } else if(type.equalsIgnoreCase("invite")) {
                invite();
            } else if(type.equalsIgnoreCase("acceptInvite")) {
                acceptInvite();
            } else if(type.equalsIgnoreCase("endTurn")) {
                endTurn();
            }

    }

    @OnOpen
    public void open(Session session) {
        log.info("Open session:" + session.getId());
        clients.add(session);
    }

    @OnClose
    public void close(Session session, CloseReason c) {
        log.info("Closing:" + session.getId());
        clients.remove(session);
    }

    private void broadcast(JsonObject response) throws IOException {
        synchronized(clients){
            // Iterate over the connected sessions
            // and broadcast the received message
            for(Session client : clients){
//                if (!client.equals(session)){
                client.getBasicRemote().sendText(response.toString());
//                }
            }
        }
    }

    private void broadcast(String response, Session session) throws IOException {
        synchronized(clients){
            // Iterate over the connected sessions
            // and broadcast the received message
            for(Session client : clients){
                if (!client.equals(session)){
                    client.getBasicRemote().sendText(response);
                }
            }
        }
    }

    public void fetchList() throws IOException {
        JsonObject response = new JsonObject();
        response.addProperty("type", "fetchList");
        response.add("list", clientList);
        broadcast(response);
    }

    public void invite() throws IOException {
        String id = jsonClient.get("id").getAsString();
        String data = jsonClient.get("game").getAsString();
        String sessionId = jsonClient.get("sessionId").getAsString();
        Player player = new Player("", jsonClient.get("username").getAsString());
        Game game = new Game(id, data, sessionId, player);
        gameList.add(game);
        broadcast(message, session);
    }

    public void acceptInvite() throws IOException {
        boolean isGameInvalid = true;
        JsonObject response = new JsonObject();

        //send notification back to challenger
        for(Game game: gameList) {
            String id = game.getId();
            if(id.equalsIgnoreCase(jsonClient.getAsJsonObject().get("id").getAsString())) {
                for(Session client : clients){
                    log.info("CLIENT ID:" + client.getId());
                    log.info("SESSION ID:" + game.getSessionId());
                    if(client.getId().equals(game.getSessionId())) {
                        log.info("SEND NOTIFICATION");
                        client.getBasicRemote().sendText(message);
                        break;
                    }
                    break;
                }
            }
        }

        //remove game from list
        for (Game game: gameList) {
            String id = game.getId();
            if(id.equalsIgnoreCase(jsonClient.getAsJsonObject().get("id").getAsString())) {
                gameList.remove(game);
                isGameInvalid = false;
                break;
            }
        }

        if(isGameInvalid) {
            response.addProperty("type","error");
            response.addProperty("errorMessage", "Game is not available");
            session.getBasicRemote().sendText(response.toString());
        } else {
            broadcast(message, session);
        }
    }

    public void endTurn() throws IOException {
        for(Session client : clients){
            if (!client.equals(session)) {
                client.getBasicRemote().sendText(message);
            }
        }
    }

}
