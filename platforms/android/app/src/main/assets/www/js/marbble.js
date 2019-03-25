"use strict";

var tileDragula;
var gameControler;
var sound;
var g_wstr = [];
var isEndGame = false;
var isGameSaved = false;

function initMarbble(screenDivId, gameMode, language, gameId, online, callback) {
    //we gives the responsibility of drag and drop rules to components themself
    tileDragula = dragula([], {
        moves: function moves(el, source, handle, sibling) {
            return el.draggable;
        },
        accepts: function accepts(el, target, source, sibling, mousePos) {
            var result = true;
            if (target.acceptsDropping) {
                result &= target.acceptsDropping(el, target, source, sibling, mousePos);
            }
            return result;
        }
    });

    var languageSet = window.applanguage[_languageSet];

    isEndGame = false;


    var activeGame = null;
    if(gameId) {
        try {
            var activeGame = getActiveGame(gameId);
        } catch(e) {
            console.error(e);
        }
    }

    isGameSaved = activeGame ? true : false;

    var player1 = getPlayer1Info(activeGame);
    var player1Name = languageSet.player1;
    var player1Language = "en";
    var player1isComputer = false;

    var player2 = getPlayer2Info(activeGame);
    var player2Name = languageSet.player1;
    var player2Language = "fr";
    var player2isComputer = false;

    if(player1) {
        player1Name = player1.name;
        player1Language = player1.language;
        player1isComputer = player1.isComputer;
    }



    if(player2) {
        player2Name = player2.name;
        player2Language = player2.language;
        player2isComputer = player2.isComputer;
        if(player2isComputer == "true") {
            player2Name = languageSet.computer;
        }
    }


    sound = new SoundControler();
    var isFirstTurn = true;

    var classicBag = null;
    var player1Bag = null;
    var player2Bag = null;



    //check for player rack from the saved game
    var player1Rack = activeGame ? activeGame.players[0].rack : null;
    var player2Rack = activeGame ? activeGame.players[1].rack : null;
    gameMode = activeGame ? activeGame.gameMode : gameMode;
    language = activeGame && activeGame.gameMode == "Classic" ? activeGame.players[0].lang : language;

    var isSameLanguage = player1Language == player2Language ? true : false;

    if(gameMode == "Classic") {
        var classicBagControler = new BagControler(language, gameMode, gameId);
        classicBagControler.initBag("");
        classicBag = classicBagControler.getBag();
        player1Bag = classicBag;
        player2Bag = classicBag;

        player1Language = language;
        player2Language = language;
    }
    else if(gameMode == "MarbbleClassic") {
        var player1BagControler =  new BagControler(player1Language, gameMode, gameId);
        player1BagControler.initBag(0);
        player1Bag = player1BagControler.getBag();
        var player2BagControler =  new BagControler(player2Language, gameMode, gameId);
        player2BagControler.initBag(1);
        player2Bag = player2BagControler.getBag();
    }
    else if(gameMode == "MarbbleOpen") {
        if(isSameLanguage == true) {
            var classicBagControler = new BagControler(player1Language, gameMode+"Classic", gameId);
            classicBagControler.initBag("");
            classicBag = classicBagControler.getBag();
            player1Bag = classicBag;
            player2Bag = classicBag;
        } else {
            var player1BagControler =  new BagControler(player1Language, gameMode, gameId);
            player1BagControler.initBag(0);
            player1Bag = player1BagControler.getBag();
            var player2BagControler =  new BagControler(player2Language, gameMode, gameId);
            player2BagControler.initBag(1);
            player2Bag = player2BagControler.getBag();
        }
    }

    tileDragula.on("drag", onNodeDrag);
    tileDragula.on("drop", onNodeDrop);
    tileDragula.on("cancel", onNodeCancel);
    tileDragula.on("over", onNodeOver);
    gameControler = new GameControler(screenDivId, gameMode, gameId);
    gameControler.model.online = online;
    gameControler.addPlayer(player1Name, player1Language, player1isComputer, player1Bag, player1Rack);
    gameControler.drawDivider();
    gameControler.addPlayer(player2Name, player2Language, player2isComputer, player2Bag, player2Rack);
    gameControler.draw(isFirstTurn);
    _windowOpened = 'gameScreenWindow';


    if(activeGame) {
        rebuildBoard(activeGame);
    }

    // callback(JSON.decycle(gameControler.model));


}

function rebuildBoard(game, online) {
    console.log("==== REBUILDING BOARD ====");

  try {

    var storage = window.localStorage;




    var state = game.board;
    gameControler.model.board = state;

    var playerToPlay = game.playerToPlay;
    if(game.online && online) {
        gameControler.model.playerToPlay = playerToPlay;
        if(playerToPlay == 0) {
            gameControler.model.players[1].bag = game.players[1].bag;
        }
        else {
            gameControler.model.players[0].bag = game.players[0].bag;
        }
    }


    var players = gameControler.model.players;
    // players[0] = game.players[0];
    // players[1] = game.players[1];

    players[0].score = game.players[0].score;
    players[1].score = game.players[1].score;
    gameControler.model.round = game.round;
    gameControler.model.gameMode = game.gameMode;

    var moves = game.movesHistory;

    for(var i = 0; i < moves.length; i++) {
      var move = moves[i];
      gameControler.component.saveAction(move.word, move.text, move.type, move.source, move.target, move.style, true);
    }


      for(var i = 0; i < state.length; i++) {
        if(state[i] != null && state[i] != undefined) {
          var tileDetails = state[i];
          gameControler.model.board[i].isPlayed = true;
          // console.log(tileDetails);
          var tile = tileDetails.component.model;
          var tileComponent = new TileComponent(tile, tileDetails.component.playerControler);
          gameControler.model.board[i].component = tileComponent;
          var boardY = 15 - tileDetails.boardY;
          var tilebg = document.getElementById("board_tileBg_"+boardY+"_"+tileDetails.boardX);
          // console.log(tileComponent.tileDiv);
          tileComponent.tileTextContainer.innerHTML = tileDetails.letter.toUpperCase();
          tileComponent.tileValueContainer.innerHTML = tileDetails.value;
          tileComponent.tileDiv.draggable = false;
          tileComponent.letter = tileDetails.letter;

          if(tile.isUnknownWord) {
              gameControler.setTileAsUnknownWord(tile);
          }

          tilebg.appendChild(tileComponent.tileDiv);
          tileDragula.containers.forEach(function(el, index) {
            if(el == tilebg) {
              tileDragula.containers.splice(index, 1);
            }
          });
      }
    }

    if(game.online) {
      if(online) {
          game.playerToPlay = 0 ? 1 : 0;
      }


      // gameControler.playerControlers[0].fillRack();
      // gameControler.playerControlers[1].fillRack();
      if(game.playerToPlay == 0) {
        document.querySelector("#playerRack_1").style.display = "block";
        document.querySelector("#playerRack_0").style.display = "none";
        // if(game.challenger) {
        //   gameControler.component.enableTurnButtons();
        // } else {
        //   gameControler.component.disableTurnButtons();
        // }
      } else {
        document.querySelector("#playerRack_1").style.display = "none";
        document.querySelector("#playerRack_0").style.display = "block";
        // if(!game.challenger) {
        //   gameControler.component.enableTurnButtons();
        // } else {
        //   gameControler.component.disableTurnButtons();
        // }
    }
    }
    document.querySelector("#playerRack_1").style.display = "block";
    document.querySelector("#playerRack_0").style.display = "block";
    gameControler.playerControlers[0].component.drawRack();
    gameControler.playerControlers[1].component.drawRack();
    gameControler.draw(false);
    gameControler.component.draw();
  } catch(e) {
    console.error(e);
  }

}

function onNodeOver(el, target, source) {

    if(el.component && el.component.onOver) {
        el.component.onOver(el, target, source);
    }

    if(target && target.onOver) {
        target.onOver(el, target, source);
    }

}

function onNodeDrag(el, source) {

    if (el.component && el.component.onDragged) {
        el.component.onDragged(el, source);
    }
    if (source.onDraggedFrom) {
        source.onDraggedFrom(el, source);
    }

    //play sound
    sound.plungerPopTileOff();
}

function onNodeDrop(el, target, source, sibling, mousePos) {

    if (el.component && el.component.onDropped) {
        el.component.onDropped(el, target, source, sibling, mousePos);
    }

    if (target.onDropped) {
        target.onDropped(el, target, source, sibling, mousePos);
    }

    //play sound
    sound.bubblePopTileOn();

}

function onNodeCancel(el, target, source) {
    if (el.component && el.component.onCanceled) {
        el.component.onCanceled(el, target, source);
    }
}

function getSupportedLocalStorage(){
    try
    {
        var localStorage = window.localStorage;
        var testKey = 'isLocalStorageSupported';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        return localStorage;
    }
    catch (error)
    {
        console.log(error);
        console.log("Local storage may not be supported");
        return null;
    }
}

function getPlayer1Info(activeGame) {

    var playerKey = 'player1Name';
    var playerLanguage = 'player1Language';
    var player1isComputerKey = 'player1isComputer';
    var localStorage = getSupportedLocalStorage();

    var languageSet = window.applanguage[_languageSet];

    if(localStorage) {
        var playerName = localStorage.getItem(playerKey) != null ? localStorage.getItem(playerKey) : languageSet.player1;
        var playerLanguage = localStorage.getItem(playerLanguage) != null ? localStorage.getItem(playerLanguage) : "en";
        var isComputer = localStorage.getItem(player1isComputerKey) != null ? localStorage.getItem(player1isComputerKey) : false;


        var data = {
            name : activeGame && activeGame.players ? activeGame.players[0].username : playerName,
            language: activeGame && activeGame.players ? activeGame.players[0].lang : playerLanguage,
            isComputer: activeGame && activeGame.players ? activeGame.players[0].isComputer :isComputer
        };


        return data;
    }
    return null;
}

function getPlayer2Info(activeGame) {
    var playerKey = 'player2Name';
    var playerLanguage = 'player2Language';
    var playAgainstComputerKey = 'playAgainstComputer';
    var player2isComputerKey = 'player2isComputer';
    var localStorage = getSupportedLocalStorage();
    var languageSet = window.applanguage[_languageSet];

    if(localStorage) {
        var playerName = localStorage.getItem(playerKey) != null ? localStorage.getItem(playerKey) : languageSet.player2;
        var playerLanguage = localStorage.getItem(playerLanguage) != null ? localStorage.getItem(playerLanguage) : "fr";
        var isComputer = localStorage.getItem(player2isComputerKey) != null ? localStorage.getItem(player2isComputerKey) : false;

        var data = {
            name : activeGame && activeGame.players ? activeGame.players[1].username : playerName,
            language: activeGame && activeGame.players ? activeGame.players[1].lang : playerLanguage,
            isComputer: activeGame && activeGame.players ? activeGame.players[1].isComputer : isComputer
        };

        return data;
    }
    return null;
}


function getGamesList() {
    var gamesList = null;
    try {
        gamesList = JSON.parse(window.localStorage.getItem("gameList"));
    } catch(e) {
        console.log(e);
    }

    return gamesList;
};


function getActiveGame(id) {
    var storage = window.localStorage;

    var activeGame = null;
    try {
        activeGame = JSON.retrocycle(JSON.parse(storage.getItem("game-" + id),true));
    } catch(e) {
        console.log(e);
    }
    return activeGame;
}

function getActiveGamesList() {
    var gamesList = getGamesList();
    var activeGames = [];
    if(gamesList && gamesList.length > 0) {
        for(var i=0;i<gamesList.length;i++) {
            activeGames.push(getActiveGame(gamesList[i]));
        }
    }

    return activeGames;

};

function getGame() {
    var storage = window.localStorage;

    var game = null;
    try {
        game = JSON.retrocycle(JSON.parse(storage.getItem("game"),true));
    } catch(e) {
        console.log(e);
    }
    return game;
};

function removeGame(id) {
    var storage = window.localStorage;

    try {
        storage.removeItem("game-" + id);
    } catch(e) {
        console.error(e);
    }

}

function saveGame(data) {
    var storage = window.localStorage;

    if(data) {
        try {
            storage.setItem("game-" + data.gameId, JSON.stringify(JSON.decycle(data)));
            isGameSaved = true;
        } catch(e) {
            console.error(e);
        }
    }
    else {
        console.error("saved game data " + data.gameId +  " not found...");;
    }
}

function saveGameList(gameList) {
    var storage = window.localStorage;


    try {
        storage.setItem("gameList", JSON.stringify(gameList));
    } catch(e) {
        console.error(e);
    }

}

function removeFromGamesList(id) {
    var gamesList = getGamesList();
    if(gamesList.length > 0) {

        var index = gamesList.indexOf(id);
        gamesList.splice(index, 1);
    }

    saveGameList(gamesList);
    removeGame(id);

}

function isSoloPlay() {
    var storage = window.localStorage;
    var isSoloPlay = false;
    try {
        isSoloPlay = storage.getItem("soloPlay").toLowerCase() == 'true' ? true : false;
    }catch(e) {
        console.error(e);
    }

    return isSoloPlay;
}

function checkLocalStorageSpace() {
    var storage = window.localStorage;
    /*var total = 0;
    for(var x in storage) {
      var amount = (storage[x].length * 2) / 1024 / 1024;
      total += amount;
      console.log( x + " = " + amount.toFixed(2) + " MB");
    }
    console.log( "Total: " + total.toFixed(2) + " MB");*/
    var allStrings = '';
    var total = 0;
    for(var key in storage){
        if(storage.hasOwnProperty(key)){
            var amount = (storage[key].length * 2) / 1024 / 1024;
            total += amount;
            console.log( key + " = " + amount.toFixed(2) + " MB");
            allStrings += storage[key];
        }
    }
    console.log( "Total: " + total.toFixed(2) + " MB");
    allStrings = allStrings ? 3 + ((allStrings.length*16)/(8*1024)) + ' KB' : 'Empty (0 KB)';
    console.log(allStrings);
    return allStrings;
};

function getDevicePlatform() {
    if(device) {
        return device.platform;
    }
};

function getDeviceVersion() {
    if(device) {
        return device.version;
    }
};

function savePlayerProfile(data) {
    var storage = window.localStorage;

    if(data) {
        try {
            storage.setItem(data.userId, JSON.stringify(JSON.decycle(data)));
        } catch(e) {
            console.error(e);
        }
    }
    else {
        console.error("Error saving player profile...");
    }
};

function getPlayerProfile(publicKeyId) {
    var storage = window.localStorage;

    var playerProfile = null;
    try {
        playerProfile = JSON.retrocycle(JSON.parse(storage.getItem(publicKeyId),true));
    } catch(e) {
        console.log(e);
    }
    return playerProfile;
};

function saveTempProfile(data) {
    var storage = window.localStorage;

    if(data) {
        try {
            storage.setItem("tempProfile", JSON.stringify(JSON.decycle(data)));
        } catch(e) {
            console.error(e);
        }
    }
    else {
        console.error("Error saving temp profile...");
    }
};

function getTempProfile() {
    var storage = window.localStorage;

    var temProfile = null;
    try {
        temProfile = JSON.retrocycle(JSON.parse(storage.getItem("tempProfile"),true));
    } catch(e) {
        console.error(e);
    }
    return temProfile;
};
