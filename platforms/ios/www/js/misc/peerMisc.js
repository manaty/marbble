var language = ["en", "fr", "es", "tl"];
var targetLanguage = ["en", "fr", "es", "tl"];
var ws = null;

function wsConnect() {
  ws = new WebSocket("ws://localhost:8080/marbble-1.0-SNAPSHOT/signaling");
  ws.onopen = function()
  {
    ws.send("{username: jan; type: connect}");
    console.log("Web Socket is connected!!");
  };

  ws.onmessage = function (evt)
  {
   var msg = JSON.parse(evt.data);
   var type = msg.type;
   if(type == "fetchList") {
     receivedFetchList(msg);
   } if(type == "invite") {
     receivedInvite(msg);
   } if(type == "acceptInvite") {
     receivedAcceptInvite(msg);
   } if(type == "endTurn") {
     receivedEndTurn(msg);
   } if(type == "error") {
     receivedError(msg);
   }
  };

  ws.onclose = function()
  {
   console.log("Connection is closed...");
  };
}

var fetchList = function() {
  ws.send("{type: fetchList}");
}

var receivedFetchList = function(msg) {
  console.log("FETCH LIST");
  displayList(msg);
}

var onlineEndTurn = function(model) {
  var data = {};
  data.type = "endTurn";
  data.game = JSON.stringify(JSON.decycle(model));
  ws.send(data);
}

var receivedEndTurn = function(msg) {
    console.log("END OF TURN RECEIVED...");
  document.querySelector("#headbandNotificationUsername").innerHTML = msg.username;
  document.querySelector("#headbandNotification").style.display = "block";
  setTimeout(function(){
          document.querySelector("#headbandNotification").style.display = "none";
   }, 3000);

   var game = JSON.retrocycle(JSON.parse(msg.game));   
   rebuildBoard(game, true);
}

var sendResponse = function(data) {
    console.log(" SENDING " + data.type);
    ws.send(JSON.stringify(data));
};

var invite = function(username, lang, targetLang) {
  // var data = {};
  // data.id = Math.random().toString(36).substring(4);
  // data.type = "invite";
  // data.lang = lang;
  // data.targetLang = targetLang;
  // data.username = username;
  // ws.send(JSON.stringify(data));
  document.querySelector("#mainMenu").style.display = 'none';
  var localStorage = window.localStorage;
  localStorage.setItem("player1Name", username);
  localStorage.setItem("player1Language", lang);
  localStorage.setItem("player2Name", "searching...");
  localStorage.setItem("player2Language", targetLang);
  localStorage.setItem("soloPlay", false);
  mainInterface.loadDictionary(false, null);
  // SENDING OF INVITE IS TRANSFERRED TO gameControler.play() on first move
  initMarbble('marbblescreen', 'MarbbleClassic', 'en', null, true);
}

var receivedInvite = function(msg) {
  console.log("INVITE");
  if(findOne(msg.lang, language) && findOne(msg.targetLang, targetLanguage)) {
    console.log("INVITE MATCH");
    mainInterface.createChallengeNotificationScreen(msg.id, msg.username, "test", msg.lang, msg.targetLang, msg.game);
  }
}

var consoleInvite = function() {
  var data = {};
  data.id = Math.random().toString(36).substring(4);
  data.type = "invite";
  data.lang = "en";
  data.targetLang = "en";
  data.username = "test";
  ws.send(JSON.stringify(data));
}

var acceptInvite = function() {
  //data contains invite data + game data
  var id = document.querySelector("#challengeNotificationScreenId").value;
  var gameData = document.getElementById("challengeNotificationScreenData").value;
  var game = JSON.retrocycle(JSON.parse(gameData));
  console.log("ACCEPT INVITE", id);
  var data = {};
  data.id = game.gameId;
  data.username = "test";
  data.type = "acceptInvite";
  ws.send(JSON.stringify(data));
  mainInterface.hideChallengeNotificationScreen();
  window.localStorage.setItem("tempGame", gameData);
  mainInterface.showImportGameScreen(game);

  // initMarbble('marbblescreen', 'MarbbleClassic', 'en', null, function(game) {
  //   data.game = JSON.stringify(game);
  //   console.log(game);
  //   ws.send(JSON.stringify(data));
  // });
}

var receivedAcceptInvite = function(msg) {
  document.querySelector("#headbandNotificationUsername").innerHTML = msg.username;
  document.querySelector("#headbandNotification").style.display = "block";
  setTimeout(function(){
          document.querySelector("#headbandNotification").style.display = "none";
   }, 3000);
}

var receivedError = function(data) {
  alert("ERROR", data.errorMsg);
}

var displayList = function(data) {
  var peerListDiv = document.getElementById("playerList");
  var list = data.list;
  console.log(list);

  for(i = 0; i < list; i++) {
    console.log(list[i].username);
  }
  const markup = `
  <div id="playerList">
  ${list.map(user => `
    <!-- player item -->
    <div class="player-item">
      <div class="player-img">
        <img src="img/opponent_info/user_icon.png" alt="" style="width: 100%">
      </div>
      <div class="player-details">
        <div class="name">
          ${user.username}
        </div>
        <div class="playr-flags">
          <img src="img/flags/en.png" alt="">
          <img src="img/flags/fr.png" alt="">
          <img src="img/flags/es.png" alt="">
          <img src="img/flags/tl.png" alt="">
        </div>
      </div>
      <div class="player-time">
        <span class="time-icon"></span> 12 min
      </div>
    </div>
    `).join("")}
  </div>
<!-- TEMP PLAYER LIST -->
  `;

  document.getElementById('playerList').innerHTML = markup;
}

wsConnect();

/**
 * @description determine if an array contains one or more items from another array.
 * @param {array} haystack the array to search.
 * @param {array} arr the array providing items to check for in the haystack.
 * @return {boolean} true|false if haystack contains at least one item from arr.
 */
var findOne = function (haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};
