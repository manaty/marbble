package com.manaty.app;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.jboss.logging.Logger;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@ServerEndpoint("/example")
public class Signaling {
    Logger log = Logger.getLogger(this.getClass());
    private static Set<Session> clients =
            Collections.synchronizedSet(new HashSet<Session>());

    private static JsonArray clientList = new JsonArray();

    @OnMessage
    public void receiveMessage(String message, Session session) throws IOException {
        log.info("Received : "+ message + ", session:" + session.getId());
        JsonParser jsonParser = new JsonParser();
        JsonObject jsonClient = jsonParser.parse(message).getAsJsonObject();
        jsonClient.addProperty("sessionId", session.getId());
        String username = jsonClient.get("username").toString();
        clientList.add(jsonClient);
        JsonObject response = new JsonObject();
        response.addProperty("type", "fetchList");
        response.add("list", clientList);

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

}
