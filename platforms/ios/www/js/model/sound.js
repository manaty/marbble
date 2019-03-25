"use strict";

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Sound = (function() {
  function Sound() {
    _classCallCheck(this, Sound);

    this.plungerPopTileOff = new Audio("sounds/plunger_pop_tileOFF.wav");
    this.bubblePopTileOn = new Audio("sounds/bubble_pop_tileON.wav");
    this.tilesDistribution = new Audio("sounds/tiles_distribution.wav");
    this.bubblePopTilesRecall = new Audio("sounds/bubble_pop_tilesRECALL.wav");
    this.shuffleTiles = new Audio("sounds/shuffle_tiles.wav");
    this.playingWord = new Audio("sounds/playing_word.wav");
    this.openPopupInGame = new Audio("sounds/opening_popup_ingame.wav");
    this.gameLost = new Audio("sounds/game_lost.wav");
    this.gameWon = new Audio("sounds/game_won.wav");
    this.challengeNotification = new Audio("sounds/challenge_notification.wav");
    this.newMessageChatBox = new Audio("sounds/new_message_chatbox.wav");
    this.gameDraw = new Audio("sounds/tie_game.mp3");
  }

  _createClass(Sound, [
    {
      key: "plungerPopTileOffPlay",
      value: function plungerPopTileOffPlay() {
        this.plungerPopTileOff.play();
      }
    }
  ]);

  return Sound;
})();
