"use strict";

var _createClass = function() {
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
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var PlayerComponent = function() {
    function PlayerComponent(playerControler) {
        _classCallCheck(this, PlayerComponent);

        this.controler = playerControler;
        this.model = playerControler.model;

        //FIXME introduce RackComponent
        this.rackBgDivs = [];


        var i = this.controler.playerIndex;
        this.playerDiv = document.createElement('div');
        this.playerDiv.id = "mbb_player_" + i;
        this.playerDiv.className = "player";
        this.playerDiv.classList.add("player" + (i + 1));

        var alignment = i == 0 ? "alignLeft" : "alignRight";
        this.userPhotoContainer = document.createElement('div');
        this.userPhotoContainer.className = "user" + (i + 1) + "PhotoContainer";

        this.userPhotoContainer.classList.add(alignment);
        this.playerDiv.appendChild(this.userPhotoContainer);

        this.userPhoto = document.createElement('img');
        var playerIcon = (this.model.isComputer == "true" || this.model.isComputer == true) ? "./img/opponent_info/computer_icon.png" : "./img/opponent_info/user_icon.png";
        this.userPhoto.className = "userPhoto" + (i + 1);
        this.userPhoto.src = playerIcon;
        this.userPhoto.style.display = "block";
        this.userPhoto.style.borderRadius = "50%";

        if(i==0) {
            if(mainInterface.isLoggedIn()) {
                var loggedPlayerProfile = (mainInterface && mainInterface.loggedPlayerProfile) ? mainInterface.loggedPlayerProfile : null;
                if(loggedPlayerProfile) {
                    this.userPhoto.src = loggedPlayerProfile.photo ? loggedPlayerProfile.photo : playerIcon;
                }
            }
            else {
                var tempProfile = (mainInterface && mainInterface.tempProfile) ? mainInterface.tempProfile : null;
                if(tempProfile) {
                    this.userPhoto.src = tempProfile.photo ? tempProfile.photo : playerIcon;
                }
            }

        }

        this.userPhotoContainer.appendChild(this.userPhoto);

        this.userDetailContainer = document.createElement('div');
        this.userDetailContainer.className = "userDetailContainer";
        this.userDetailContainer.classList.add(alignment);
        this.playerDiv.appendChild(this.userDetailContainer);

        this.userProfile = document.createElement('div');
        this.userProfile.className = "userProfile";
        this.userProfile.classList.add(alignment);
        this.userDetailContainer.appendChild(this.userProfile);

        this.playerNameDiv = document.createElement('div');
        this.playerNameDiv.className = "playerName";
        this.playerNameDiv.classList.add(alignment);
        this.userProfile.appendChild(this.playerNameDiv);


        this.userFlag = document.createElement('div');
        this.userFlag.className = "user" + (i + 1) + "Flag";
        this.userFlag.classList.add(this.model.lang + "UserLanguage");
        this.userProfile.appendChild(this.userFlag);

        this.playerScoreDiv = document.createElement('div');
        this.playerScoreDiv.id = "playerScore_" + i;
        this.playerScoreDiv.className = "playerScore";
        this.playerScoreDiv.classList.add(alignment);
        this.userDetailContainer.appendChild(this.playerScoreDiv);

        this.playerRackDiv = document.createElement('div');
        this.playerRackDiv.id = "playerRack_" + i;
        //this.playerRackDiv.className = "playerRack";

        this.hideDiv = document.createElement('div');
        this.hideDiv.className = "hideDiv";
        this.hideDiv.id = "hideDiv_" + i;
        this.playerRackDiv.appendChild(this.hideDiv);

        var j = 0;
        for (j = 0; j < 7; j++) {
            var tileBgDiv = this.buildTileBg(0, 0, j, "player_tileBg_" + i + "_" + j);
            this.playerRackDiv.appendChild(tileBgDiv);
            this.rackBgDivs.push(tileBgDiv);
            //tileBgDiv.style.border = "0px";
            //tileBgDiv.style.borderRadius = "0px";
            tileBgDiv.playerIdx = i;
            tileBgDiv.rackIdx = j;
        }
        //this.playerDiv.appendChild(this.playerRackDiv);
    }

    _createClass(PlayerComponent, [{
            key: "draw",
            value: function draw(playerWidthInPx, playerHeightInPx) {
                if (!playerWidthInPx) {
                    playerWidthInPx = this.playerWidthInPx;
                    playerHeightInPx = this.playerHeightInPx;
                } else {
                    this.playerWidthInPx = playerWidthInPx;
                    this.playerHeightInPx = playerHeightInPx;
                }
                var playerIdx = this.model.idx;
                // this.playerDiv.style.width = playerWidthInPx + "px";
                // this.playerDiv.style.height = playerHeightInPx / 2 + "px";
                // this.playerDiv.style.left = playerWidthInPx * playerIdx + "px";
                // this.playerDiv.style.bottom = "0px";
                if (playerIdx == this.controler.gameControler.model.playerToPlay) {
                    this.playerDiv.classList.add("selected");
                } else {
                    this.playerDiv.classList.remove("selected");
                }
                // this.playerScoreDiv.style.fontSize = playerHeightInPx / 2 - 2 + "px";
                // this.playerScoreDiv.style.height = playerHeightInPx / 2 + "px";
                this.playerScoreDiv.innerHTML = this.model.score;
                //
                // this.playerNameDiv.style.fontSize = playerHeightInPx / 2 - 2 + "px";
                // this.playerNameDiv.style.height = playerHeightInPx / 2 + "px";
                this.playerNameDiv.innerHTML = this.model.username;
            }
        }, {
            key: "drawRack",
            value: function drawRack(rackWidthInPx, rackHeightInPx) {
                if (!rackWidthInPx) {
                    rackWidthInPx = this.rackWidthInPx;
                    rackHeightInPx = this.rackHeightInPx;
                } else {
                    this.rackWidthInPx = rackWidthInPx;
                    this.rackHeightInPx = rackHeightInPx;
                }
                var offset = 2;

                var hideDiv = document.getElementById('hideDiv_' + this.controler.gameControler.model.playerToPlay);
                hideDiv.style.height = this.rackHeightInPx + "px";

                if (this.model.idx != this.controler.gameControler.model.playerToPlay) {
                    this.playerRackDiv.style.display = "none";
                } else {
                    this.playerRackDiv.style.display = "block";

                    var tileCount = 7;

                    var tileSizeInPx = (rackWidthInPx / tileCount) - 1;

                    tileSizeInPx -= offset;
                    for (var _j = 0; _j < 7; _j++) {
                        this.drawTile(tileSizeInPx, _j);
                    }
                }
            }
        }, {
            key: "buildTileBg",
            value: function buildTileBg(tileBg, i, j, id) {
                var tileBgDiv = document.createElement('div');
                tileBgDiv.className = "playerTileBg";
                tileBgDiv.id = id;
                tileBgDiv.classList.add("tileBg" + tileBg);
                tileBgDiv.x = j;
                tileBgDiv.y = 15 - i;
                tileBgDiv.acceptsDropping = function(el, tileBgDiv, originTileBg, sibling) {
                    if (tileBgDiv.rackIdx != undefined && tileBgDiv.tileId != null && originTileBg.rackIdx == undefined) {
                        return false;
                    }
                    if (originTileBg.rackIdx != undefined && tileBgDiv.tileId != null) {
                        if (originTileBg.rackIdx == tileBgDiv.rackIdx) {
                            return false;
                        }
                    }
                    return true;
                };
                tileBgDiv.onDropped = function(tileDiv, tileBgDiv, originTileBg, sibling, mousePos) {
                    var tileComponent = tileDiv.component;
                    var tile = tileComponent.model;
                    var player = tileComponent.playerControler.model;

                    //console.log("tileBgDiv.rackIdx=" + tileBgDiv.rackIdx + " originTileBg.rackIdx=" + originTileBg.rackIdx + " tile.swapRackIdx=" + tile.swapRackIdx);
                    if (tileComponent.isToSwap == true) {
                        tileComponent.toggleSwap();
                    }

                    if (originTileBg.rackIdx != undefined && tileBgDiv.tileId != undefined) {
                        var tileToSwitchId = player.rack[tileBgDiv.rackIdx].id;
                        var tileToSwitch = document.getElementById(tileToSwitchId);

                        if (tileToSwitch) {
                            //console.log(' === ORIGIN RACK [' + originTileBg.rackIdx + '] BEFORE SWITCH === Letter: ' + player.rack[originTileBg.rackIdx].letter.toUpperCase() + ' tileId: ' + originTileBg.tileId);
                            player.rack[originTileBg.rackIdx] = tileToSwitch.component.model;
                            tileToSwitch.component.model.setRackIdx(originTileBg.rackIdx);
                            originTileBg.tileId = tileToSwitch.id;
                            //console.log(' === ORIGIN RACK [' + originTileBg.rackIdx + '] AFTER SWITCH === Letter: ' + player.rack[originTileBg.rackIdx].letter.toUpperCase() + ' tileId: ' + originTileBg.tileId);
                        }
                    } else if (tile.swapRackIdx != null) {
                        //when tile came from swap rack
                        //console.log("=== SETTING ORIGIN tileId " + originTileBg.tileId  + " to null. (Tile came from EXCHANGE RACK) ===");
                        player.swapRack[tile.swapRackIdx] = null;
                        tile.swapRackIdx = null;
                        originTileBg.tileId = null;
                    } else {
                        //console.log("=== SETTING ORIGIN tileId " + originTileBg.tileId  + " to null. (Tile came from BOARD OR PLACED ON EMPTY TILE RACK) ===");
                        originTileBg.tileId = null;
                    }
                    var temp = player.rack[tileBgDiv.rackIdx];
                    player.rack[tileBgDiv.rackIdx] = tileDiv.component.model;
                    var destinationLetter = player.rack[tile.rackIdx] ? player.rack[tile.rackIdx].letter.toUpperCase() : " NULL "
                    if (tile.rackIdx != null && !tileBgDiv.tileId) {
                        //console.log(' == 1 - EMPTY RACK [' + tile.rackIdx + '] Letter: ' + destinationLetter + ' tile.rackIdx: ' + tile.rackIdx + ' tileBgDiv.tileId: ' + tileBgDiv.tileId);
                        player.rack[tile.rackIdx] = null;
                    } else if (tile.rackIdx != null) {
                        //console.log(' == 2 RACK NOT EMPTY - SETTING RACK [' + tile.rackIdx + '] to Letter: ' + destinationLetter);
                        player.rack[tile.rackIdx] = temp;
                    }
                    tile.setRackIdx(tileBgDiv.rackIdx);

                    //console.log(' === DESTINATION RACK [' + tileBgDiv.rackIdx + '] BEFORE SWITCH === ' + ' Letter: ' + destinationLetter + ' tileId: ' + tileBgDiv.tileId);

                    tileBgDiv.tileId = tile.id;

                    destinationLetter = player.rack[tileBgDiv.rackIdx] ? player.rack[tileBgDiv.rackIdx].letter.toUpperCase() : ' NULL';

                    //console.log(' === DESTINATION RACK [' + tileBgDiv.rackIdx + '] AFTER SWITCH === ' + ' Letter: ' + destinationLetter + ' tileId: ' + tileBgDiv.tileId);
                    tileComponent.playerControler.hideScoreBubble();
                    gameControler.hideTempScore();
                    gameControler.showLastScore();
                    gameControler.updateMenuButtons();

                    //play sound
                    sound.bubblePopTileOn();

                    if(gameControler.model.online == true) {                        
                        tileComponent.playerControler.component.updateOnlineRack();
                    }
                    else {
                        tileComponent.playerControler.draw();
                    }



                };
                tileBgDiv.onOver = function(tileDiv, tileBgDiv, originTileBg) {
                    //console.log(' === ON OVER ===');
                    var tileComponent = tileDiv.component;
                    var tile = tileComponent.model;
                    //uncomment to debug
                    /*console.log("Letter: " + tile.letter.toUpperCase() + " originTileBg.rackIdx= " + originTileBg.rackIdx + " tile.rackIdx: " + tile.rackIdx + " originTileBg.tileId= " + originTileBg.tileId);
                    console.log("Letter: " + tile.letter.toUpperCase() + " tileBgDiv.rackIdx= " + tileBgDiv.rackIdx + " tile.rackIdx: " + tile.rackIdx + " tileBgDiv.tileId= " + tileBgDiv.tileId);*/



                    tileDiv.component.draw(tileBgDiv.clientWidth, tileDiv);
                };
                tileDragula.containers.push(tileBgDiv);
                return tileBgDiv;
            }
        }, {
            key: "drawTile",
            value: function drawTile(tileSizeInPx, j) {
                var tileBgDiv = this.rackBgDivs[j];
                tileBgDiv.style.width = tileSizeInPx + "px";
                tileBgDiv.style.height = tileSizeInPx + "px";
                tileBgDiv.style.left = j * tileSizeInPx + "px";
                //tileBgDiv.style.top = 0 + "px";
                tileBgDiv.tileSizeInPx = tileSizeInPx;
                if (this.model.rack[j]) {
                    while (tileBgDiv.hasChildNodes()) {
                        tileBgDiv.removeChild(tileBgDiv.lastChild);
                    }
                    var tileDiv = this.model.rack[j].component.draw(tileSizeInPx);
                    tileBgDiv.appendChild(tileDiv);
                }
            }
        }, {
            key: "drawScore",
            value: function drawScore() {
                this.playerScoreDiv.innerHTML = this.model.score;
            }
        },
        {
            key: "drawDivider",
            value: function drawDivider() {
                var divider = document.createElement('div');
                this.playerDiv.appendChild(divider);
            }
        }, {
            key: "updateOnlineRack",
            value: function updateOnlineRack(rackWidthInPx, rackHeightInPx) {
                if (!rackWidthInPx) {
                    rackWidthInPx = this.rackWidthInPx;
                    rackHeightInPx = this.rackHeightInPx;
                } else {
                    this.rackWidthInPx = rackWidthInPx;
                    this.rackHeightInPx = rackHeightInPx;
                }
                var offset = 2;

                var tileCount = 7;

                var tileSizeInPx = (rackWidthInPx / tileCount) - 1;

                tileSizeInPx -= offset;
                for (var _j = 0; _j < 7; _j++) {
                    this.drawTile(tileSizeInPx, _j);
                }
            }
        }
    ]);

    return PlayerComponent;
}();
