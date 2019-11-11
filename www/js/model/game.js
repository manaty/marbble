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

var TYPE_CLASSIC = 0;
var TYPE_MARBBLE = 1;

var STATUS_NEW = 0;
var STATUS_ONGOING = 1;
var STATUS_ENDED = 2;

var LANG = {
    "en": "English",
    "fr": "French",
    "es": "Spanish",
    "tl": "Filipino"
}

function allowDrop(ev) {
    ev.preventDefault();
}

var gCloneFunc = typeof(Object.create) == "function" ? Object.create :
    function(obj) {
        var cl = {};
        for (var i in obj) cl[i] = obj[i];
        return cl;
    };
var g_letscore = {};

var Game = function() {
    function Game(gameId) {
        _classCallCheck(this, Game);

        if(typeof gameId == 'undefined') {
            gameId = null;
        }

        var activeGame = null;

        if(gameId) {
            activeGame = getActiveGame(gameId);
        }

        this.gameId = activeGame && activeGame.gameId ? activeGame.gameId : dateUtils.generateUUID();
        this.type = TYPE_CLASSIC;
        this.gameMode = "MarbbleClassic";
        this.online = false;
        this.challenger = false;
        this.status = STATUS_NEW;
        this.players = [];
        this.movesHistory = [];
        this.wordsPlayed = [];
        this.playerToPlay = activeGame ? activeGame.playerToPlay : 0;
        this.lastMove = null;
        this.board = new Array(225);
        this.round = 1;
        this.invalidWordPlayed = "";
        this.isGameBoardEmpty = true; //game board empty
        this.playLevel = activeGame ? activeGame.playLevel : localStorage.getItem("aiDifficulty"); //ai play level
        this.g_board = []; //for ai based on jscrab
        this.g_matches_cache = {};
        this.ai_pass = 0;
        this.noPoint = 0;

        this.g_boardpoints = []; // points on board
        this.g_boardmults; // board bonus multipliers (DL, TL, DW, TW)
        this.g_letpool = []; // letter pool
        this.g_letscore = {}; // score for each letter
        this.g_racksize = 7; // max number of letters on racks
        this.g_pscore = 0; // player score
        this.g_oscore = 0; // opponent (computer) score
        this.g_board_empty = true; // first move flag
        this.g_passes = 0; // number of consecutive passes
        this.g_maxpasses = 2; // maximum number of consecutive passes
        this.g_lmults = [1, 2, 3, 1, 1]; // letter multipliers by index
        this.g_wmults = [1, 1, 1, 2, 3]; // word multipliers by index

        this.g_allLettersBonus = 50;
        this.g_playlevel = activeGame ? activeGame.g_playlevel : localStorage.getItem("aiDifficulty"); // computer play level
        this.g_maxwpoints = [5, 10, 20, 25, 80]; // maximum word score for each level

        this.timeElapsed = dateUtils.getCurrentDateUTC();
        this.isSoloPlay = activeGame ? activeGame.isSoloPlay : isSoloPlay();
        this.createdDate = dateUtils.getCurrentDateUTC();

        //TODO from jscrab to get the board info
        // var g_board;                // letters on board
        // var g_boardmults;           // board bonus multipliers (DL, TL, DW, TW)
        // var g_boardpoints;          // points on board
    }

    _createClass(Game, [{
        key: "getPlayer",
        value: function getPlayer() {
            return this.players[this.playerToPlay];
        }
    }, {
        key: "setType",
        value: function setType(type) {
            if (type != TYPE_CLASSIC && type != TYPE_MARBBLE) {
                throw new Exception("invalid game type");
            }
            this.type = type;
        }
    }, {
        key: "addPlayer",
        value: function addPlayer(player) {
            this.players.push(player);
        }
    }, {
        key: "computeWordScore",
        value: function computeWordScore(xmin, ymin, xmax, ymax) {
            // console.log(xmin, ymin, xmax, ymax);
            var forGood = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

            var score = 0;
            var tilesInWord = [];
            if (xmin == xmax && ymin == ymax) {
                return -1;
            }
            var word = "";
            var wordMultiplicator = 1;

            if (ymin == ymax) {
                for (var i = xmin; i <= xmax; i++) {

                    var letterMultiplier = this.board[(15 - ymin) * 15 + i].isPlayed == false ? boardBgLetterValue[boardBg[(15 - ymin) * 15 + i]] : 1;

                    score += this.board[(15 - ymin) * 15 + i].value * letterMultiplier;

                    var localWordMultiplicator = boardBgWordValue[boardBg[(15 - ymin) * 15 + i]];

                    if (localWordMultiplicator > wordMultiplicator && this.board[(15 - ymin) * 15 + i].isPlayed == false) {
                        wordMultiplicator = localWordMultiplicator;
                    }

                    //if tile is joker use changed component letter
                    if (this.board[(15 - ymin) * 15 + i].isJoker) {
                        word += this.board[(15 - ymin) * 15 + i].component.letter;
                    } else {
                        word += this.board[(15 - ymin) * 15 + i].letter;
                    }

                    tilesInWord.push(this.board[(15 - ymin) * 15 + i]);
                }
            } else {
                for (var j = ymin; j <= ymax; j++) {
                    var letterMultiplier = this.board[(15 - j) * 15 + xmin].isPlayed == false ? boardBgLetterValue[boardBg[(15 - j) * 15 + xmin]] : 1;
                    score += this.board[(15 - j) * 15 + xmin].value * letterMultiplier;
                    var _localWordMultiplicator = boardBgWordValue[boardBg[(15 - j) * 15 + xmin]];

                    if (_localWordMultiplicator > wordMultiplicator && this.board[(15 - j) * 15 + xmin].isPlayed == false) {
                        wordMultiplicator = _localWordMultiplicator;
                    }

                    //if tile is joker use changed component letter
                    if (this.board[(15 - j) * 15 + xmin].isJoker) {
                        word = this.board[(15 - j) * 15 + xmin].component.letter + word;
                    } else {
                        word = this.board[(15 - j) * 15 + xmin].letter + word;
                    }
                    tilesInWord.push(this.board[(15 - j) * 15 + xmin]);
                }
            }

            score *= wordMultiplicator;

            this.wordsPlayed.push(word);
            if (forGood && window.marbbleWordmap[this.getPlayer().lang][word] == undefined) {
                //throw "word " + word + " doesnt exist";

                if(gameControler.gameMode == "MarbbleOpen" && (gameControler.allowInvalidWord == true || gameControler.getDoNotAskValue() == true)) {
                    for(var _i =0; _i < tilesInWord.length; _i++) {
                        if(!tilesInWord[_i].isPlayed) {
                            gameControler.setTileAsUnknownWord(tilesInWord[_i]);
                        }
                    }
                }
                else {
                    throw {
                        name: "invalidWord",
                        invalidWord: word,
                        message: "Word " + word + " does not exist"
                    };
                }

            }
            gameControler.debug("Game", "word " + word + " as score " + score + " (multi=" + wordMultiplicator + ")");

            for (var _tile_i = 0; _tile_i < tilesInWord.length; _tile_i++) {
                var tileScoreDiv = tilesInWord[_tile_i].component.tileScoreDiv;
                if (ymin == ymax) {
                    //word is horizontal
                    if (_tile_i == tilesInWord.length - 1) {
                        //hide previous score bubble before replacing
                        if (gameControler.getHorizontalTilePlayed()) {
                            gameControler.hideTempScore();
                        }

                        gameControler.setHorizontalTilePlayed(tilesInWord[_tile_i]);
                        gameControler.setHorizontalTilesArray(tilesInWord);
                    }
                } else {
                    //word is vertical
                    if (_tile_i == 0) {
                        //hide previous score bubble before replacing
                        if (gameControler.getVerticalTilePlayed()) {
                            gameControler.hideTempScore();
                        }
                        gameControler.setVerticalTilePlayed(tilesInWord[_tile_i]);
                        gameControler.setVerticalTilesArray(tilesInWord);
                    }
                }
            }


            if (forGood) {
                for (var _i = 0; _i < tilesInWord.length; _i++) {
                    if (ymin == ymax) {
                        tilesInWord[_i].horizontalWord = word;
                        tilesInWord[_i].horizontalLang = this.getPlayer().lang;
                    } else {
                        tilesInWord[_i].verticalWord = word;
                        tilesInWord[_i].verticalLang = this.getPlayer().lang;
                    }
                }

                //the board is not empty
                this.isGameBoardEmpty = false;

                this.getPlayer().setLastWord(word);

            }

            return score;
        }
    }, {
        key: "computeScore",
        value: function computeScore(xmin, ymin, xmax, ymax) {
            // console.log(computeScore.caller);
            var forGood = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

            var score = this.computeWordScore(xmin, ymin, xmax, ymax, forGood);
            if (score >= 0) {
                if (ymin == ymax) {
                    gameControler.setDirectionHorizontal(true);
                    for (var i = xmin; i <= xmax; i++) {
                        if (!this.board[(15 - ymin) * 15 + i].isPlayed) {
                            var wordYmin = ymin;
                            var wordYmax = ymax;
                            while (wordYmin > 0 && this.board[(15 - wordYmin + 1) * 15 + i] != null) {
                                wordYmin--;
                            }
                            while (wordYmax < 15 && this.board[(15 - wordYmax - 1) * 15 + i] != null) {
                                wordYmax++;
                            }
                            if (wordYmax > wordYmin) {
                                var wordScore = this.computeWordScore(i, wordYmin, i, wordYmax, forGood);
                                if (wordScore > 0) {
                                    score += wordScore;
                                } else {
                                    return wordScore;
                                }
                            }
                        }
                    }
                } else {
                    gameControler.setDirectionHorizontal(false);
                    for (var j = ymin; j <= ymax; j++) {
                        if (!this.board[(15 - j) * 15 + xmin].isPlayed) {
                            var wordXmin = xmin;
                            var wordXmax = xmax;
                            while (wordXmin > 0 && this.board[(15 - j) * 15 + wordXmin - 1] != null) {
                                wordXmin--;
                            }
                            while (wordXmax < 14 && this.board[(15 - j) * 15 + wordXmax + 1] != null) {
                                wordXmax++;
                            }
                            if (wordXmax > wordXmin) {
                                var _wordScore = this.computeWordScore(wordXmin, j, wordXmax, j, forGood);
                                if (_wordScore > 0) {
                                    score += _wordScore;
                                } else {
                                    return _wordScore;
                                }
                            }
                        }
                    }
                }
            }
            return score;
        }
    }, {
        key: "play",
        value: function play(forGood, isFirstRound) {
            var lettersPlayed = [];
            if(gameControler.gameMode == "MarbbleOpen") {                
                gameControler.unknownWordsPlayed = this.wordsPlayed;
            }
            this.wordsPlayed = [];
            this.setInvalidWordPlayed("");
            for (var i = 0; i < 7; i++) {
                if (this.getPlayer().previousRack[i]) {
                    lettersPlayed.push(this.getPlayer().previousRack[i]);
                }
            }
            if (lettersPlayed.length == 0 && gameControler.isMenuButtonDisabled == false) {
                //nothing has been played
                return "NOTHING_PLAYED";
            }
            var xmin = 15,
                ymin = 15,
                xmax = 0,
                ymax = 0;


            for (var _i2 = 0; _i2 < lettersPlayed.length; _i2++) {
                var tile = lettersPlayed[_i2];
                if (tile.boardX > xmax) {
                    xmax = tile.boardX;
                }
                if (tile.boardX < xmin) {
                    xmin = tile.boardX;
                }
                if (tile.boardY > ymax) {
                    ymax = tile.boardY;
                }
                if (tile.boardY < ymin) {
                    ymin = tile.boardY;
                }
            }
            if (ymax > ymin && xmax > xmin) {
                //letters not aligned
                return "LETTERS_NOT_ALIGNED";
                this.currentAction = null;
                return;
            }
            if (isFirstRound && (7 < xmin || 7 > xmax || 8 < ymin || 8 > ymax)) {
                return "STAR_NOT_COVERED";
            }
            if (ymin == ymax) {
                for (var j = xmin; j <= xmax; j++) {
                    if (this.board[(15 - ymin) * 15 + j] == null) {
                        return "HOLES_EXIST";
                    }
                }
                //complete xmin and xmax of the full word
                while (xmin > 0 && this.board[(15 - ymin) * 15 + xmin - 1] != null) {
                    xmin--;
                }
                while (xmax < 14 && this.board[(15 - ymin) * 15 + xmax + 1] != null) {
                    xmax++;
                }
            }
            if (ymin < ymax || xmin == xmax) {
                for (var _j = ymin; _j <= ymax; _j++) {
                    if (this.board[(15 - _j) * 15 + xmin] == null) {
                        return "HOLES_EXIST";
                    }
                }
                //complete ymin and ymax of the full word
                while (ymin > 0 && this.board[(15 - ymin + 1) * 15 + xmin] != null) {
                    ymin--;
                }
                while (ymax < 15 && this.board[(15 - ymax - 1) * 15 + xmin] != null) {
                    ymax++;
                }
            }
            if (this.round > 1) {
                var reuseLetters = false;
                for (var _i3 = xmin; !reuseLetters && _i3 <= xmax; _i3++) {
                    for (var _j2 = ymin; !reuseLetters && _j2 <= ymax; _j2++) {
                        reuseLetters = reuseLetters || (_i3 > 0 ? this.board[(15 - _j2) * 15 + _i3 - 1] != null && this.board[(15 - _j2) * 15 + _i3 - 1].isPlayed : reuseLetters);
                        reuseLetters = reuseLetters || (_i3 < 15 ? this.board[(15 - _j2) * 15 + _i3 + 1] != null && this.board[(15 - _j2) * 15 + _i3 + 1].isPlayed : reuseLetters);
                        reuseLetters = reuseLetters || (_j2 > 0 ? this.board[(15 - _j2 + 1) * 15 + _i3] != null && this.board[(15 - _j2 + 1) * 15 + _i3].isPlayed : reuseLetters);
                        reuseLetters = reuseLetters || (_j2 < 15 ? this.board[(15 - _j2 - 1) * 15 + _i3] != null && this.board[(15 - _j2 - 1) * 15 + _i3].isPlayed : reuseLetters);
                        reuseLetters = reuseLetters || this.board[(15 - _j2) * 15 + _i3].isPlayed;
                    }
                }
                if (!reuseLetters) {
                    return "MUST_REUSE_LETTER";
                }
            }
            //compute points
            var wordScore = -1;
            try {
                wordScore = this.computeScore(xmin, ymin, xmax, ymax, forGood);
            } catch (e) {
                if (e && e.invalidWord) {
                    this.setInvalidWordPlayed(e.invalidWord);
                    if(gameControler.gameMode == "MarbbleOpen") {
                        return "OPEN_MODE";
                    }
                    else {
                        return "INVALID_WORD";
                    }
                }

            }
            if (wordScore < 0) {
                return "NO_POINT";
            }
            if (lettersPlayed.length == 7) {
                wordScore += 50;
            }

            if (forGood) {
                this.getPlayer().score += wordScore;
            }
            return wordScore;
        }
    }, {
        key: "getTranslatedWord",
        value: function getTranslatedWord(originLang, word) {
            return window.marbbleDic[originLang][this.getPlayer().lang][word];
        }
    }, {
        key: "nextTurn",
        value: function nextTurn() {
            this.playerToPlay++;
            this.playerToPlay %= this.players.length;

            if (this.playerToPlay == 1 && isSoloPlay()) {
                document.getElementById("playerRack_0").style.display = "block";
                document.getElementById("playerRack_1").style.display = "none";
            }

            // var endGame = true;
            // for (var player in this.players) {
            //     endGame = endGame && this.players[player].passed;
            // }
            //

            if (this.noPoint > 5) {
                return "END_GAME";
            }


            //TODO if the player is ai, execute on computer move
            if (this.getPlayer().isComputer == "true") {
                this.onComputerMove();
            }
            return "OK";
        }
    }, {
        key: "getNextPlayer",
        value: function getNextPlayer() {
            var playerToPlay = this.playerToPlay;
            playerToPlay++;
            playerToPlay %= this.players.length;
            return this.players[playerToPlay];
        }
    }, {
        key: "endGame",
        value: function endGame() {
            //TODO add end game logic here

            return "END_GAME";
        }
    }, {
        key: "getInvalidWordPlayed",
        value: function getInvalidWordPlayed() {
            return this.invalidWordPlayed;
        }
    }, {
        key: "setInvalidWordPlayed",
        value: function setInvalidWordPlayed(word) {
            this.invalidWordPlayed = word;
        }
    }, {
        key: "onComputerMove",
        value: function onComputerMove() {



            var computerRack = this.getPlayer().rack;

            var playlevel = this.getPlayLevel();

            var playWord = null;

            if (this.isGameBoardEmpty == true) {
                var start = this.getStartXY();
                playWord = this.findFirstMove(computerRack, start.x, start.y);
            } else {
                playWord = this.findBestMove(computerRack);
            }

            if (playWord != null) {
                //TODO Implement placing of tiles on the board
                this.placeOnBoard(playWord, this.animCallback);
            } else {
                //TODO Implement logic if computer cannot find word

            }

        }
    }, {
        key: "getStartXY",
        value: function getStartXY() {
            var xmin = 15;
            var ymin = 15;
            var xmax = 0;
            var ymax = 0;

            var fx = Math.round(xmin / 2) - 1;
            var fy = Math.round(ymin / 2);

            return {
                x: fx,
                y: fy
            };
        }
    }, {
        key: "levelUp",
        value: function levelUp() {
            if (this.playLevel < 5) {
                this.playLevel++;
            }
        }
    }, {
        key: "levelDown",
        value: function levelDown() {
            if (this.playLevel > 1) {
                this.playLevel--;
            }
        }
    }, {
        key: "getPlayLevel",
        value: function getPlayLevel() {
            return this.playLevel;
        }
    }, {
        key: "findBestWord",
        value: function findBestWord(rack, letters, ax, ay) {
            //TODO Implement findBestWord from findBestWord in jscrab

            var bestscore = -1;
            var bestword = {
                score: -1
            };


            return bestword;

        }
    }, {
        key: "findFirstMove",
        value: function findFirstMove(rack, fx, fy) {
            //TODO Implement findFirstMove from find_first_move function in jscrab
            var selword = {
                score: -1
            };

            return selword;
        }
    }, {
        key: "findBestMove",
        value: function findBestMove(rack) {
            //TODO implement findBestMove from find_best_move function in jscrab

            var boardBestScore = -1;
            var boardBestWord = null;


            return boardBestWord;

        }
    }, {
        key: "animCallback",
        value: function animCallback() {
            //TODO Implement animation to put tiles on board from jscrab function
        }
    }, {
        key: "placeOnBoard",
        value: function placeOnBoard(playWord, animCallback) {
            //TODO Implement placeOnBoard function from jscrab
        }
    }, {
        key: "getWordScore",
        value: function getWordScore(wordinfo) {
            console.log("getWordScore");
            var mainIndex = 0;
            for (var iGWSx = 0; iGWSx < 16; iGWSx++) {
                this.g_boardpoints[iGWSx] = [];
            }
            for (var iGWSy = 0; iGWSy < 15; iGWSy++) {
                for (var iGWSx = 0; iGWSx < 15; iGWSx++) {
                    // this.g_boardpoints[iGWSx] = [];
                    if (this.board[mainIndex] === undefined || this.board[mainIndex] === null) {
                        this.g_boardpoints[iGWSx][iGWSy] = 0;
                    } else {
                        this.g_boardpoints[iGWSx][iGWSy] = this.board[mainIndex].value;
                    }
                    mainIndex++;
                }
            }
            var xdir = (wordinfo.xy == "x");
            var ax = wordinfo.ax;
            var ay = wordinfo.ay;
            var ap = xdir ? ax : ay;
            var max = xdir ? this.g_board.length : this.g_board[ax].length;

            var dx = xdir ? 1 : 0;
            var dy = 1 - dx;
            var ps = wordinfo.ps;
            var seq = wordinfo.seq;
            var seqc = 0;
            var x;
            var y;

            //logit( "Checking orthogonals for:"+wordinfo.word+" dir:"+wordinfo.xy );
            //logit( wordinfo );

            if (xdir) {
                x = ps;
                y = ay;
            } else {
                x = ax;
                y = ps;
            }

            var owords = []; // list of valid orthogonal words created with this move
            var wscore = 0; // word score
            var oscore = 0; // orthogonal created words score

            var lscores = wordinfo.lscrs;
            var locs = "x" + x + "y" + y + "d" + wordinfo.xy;

            var wordmult = 1;

            while (ps < max) {
                if (this.g_board[x][y] === "") {
                    var lscr = lscores[seqc]; // score of letter in sequence
                    var lseq = seq.charAt(seqc++); // the letter itself.

                    // Add score of newly placed tile
                    // var bonus = this.g_boardmults[x][y];
                    var bonus = 1;

                    // calculate the ortagonal word score
                    var ows = this.getOrthWordScore(lseq, lscr, x, y, dx, dy);

                    if (ows.score == -1)
                        // an invalid orthogonal word was created.
                        return -1;

                    if (ows.score > 0)
                        owords.push(ows.word);

                    // wordmult *= g_wmults[bonus];
                    // lscr     *= g_lmults[bonus];
                    wordmult *= 1;
                    lscr *= 1;
                    wscore += lscr;

                    oscore += ows.score;
                    x += dx;
                    y += dy;
                    ps++;
                    if (seqc == seq.length)
                        // all letters and possibly created words
                        // have been checked
                        break;
                } else
                    // Add score of existing tile on board
                    wscore += this.g_boardpoints[x][y];

                while (ps < max && this.g_board[x][y] !== "") {
                    x += dx;
                    y += dy;
                    ps++;
                }
            }

            //logit( "word:" + wordinfo.word + ", mult:" + wordmult );
            wscore *= wordmult;

            if (seq.length == this.g_racksize)
                wscore += this.g_allLettersBonus;

            wordinfo.owords = owords;
            return wscore + oscore;
        }
    }, {
        key: "getOrthWordScore",
        value: function getOrthWordScore(lseq, lscr, x, y, dx, dy) {
            var wordmult = 1;

            var score = 0;
            var wx = x;
            var wy = y;

            var xmax = this.g_board.length;
            var ymax = this.g_board[x].length;

            // If not already there, pretend weve placed the orhagonal anchor on
            // the board so we can include it when scanning the ortagonal word
            var lsave = this.g_board[wx][wy];
            var ssave = 0;
            try {
                if (typeof this.g_boardpoints[wx] == "undefined") {
                    ssave = 0;
                } else {
                    ssave = this.g_boardpoints[wx][wy];
                }

            } catch (e) {
                //TODO REMOVE THIS
            }

            // var bonus = this.g_boardmults[wx][wy];
            var bonus = 1;
            // wordmult *= this.g_wmults[bonus];
            // lscr *= this.g_lmults[bonus];
            wordmult *= 1;
            lscr *= 1;

            this.g_board[wx][wy] = lseq;
            try {
                this.g_boardpoints[wx][wy] = lscr;
            } catch (e) {
                return {
                    score: -1,
                    word: orthword
                };
            }


            //logit("checking orth:"+[lseq,x,y]);
            while (x >= 0 && y >= 0 && this.g_board[x][y] !== "") {
                x -= dy;
                y -= dx;
            }
            if (x < 0 || y < 0 || this.g_board[x][y] === "") {
                x += dy;
                y += dx;
            }
            var orthword = "";
            while (x < xmax && y < ymax && this.g_board[x][y] !== "") {
                var letter = this.g_board[x][y];
                score += this.g_boardpoints[x][y];
                orthword += letter;
                x += dy;
                y += dx;
            }

            // Orthogonal word built - we can now go back to the previous
            // value on the board in the position of the orthogonal anchor
            this.g_board[wx][wy] = lsave;
            this.g_boardpoints[wx][wy] = ssave;

            if (orthword.length == 1)
                // the letter does not form an orthogonal word.
                return {
                    score: 0,
                    word: orthword
                };

            if (!(orthword.toLowerCase() in window.marbbleWordmap[this.players[this.playerToPlay].lang])) {
                // console.log(orthword);
                return {
                    score: -1,
                    word: orthword
                };
            }

            // score *= this.wordmult;

            //logit( "orth word:"+ orthword + " score:" + score );
            // console.log({ score:score, word:orthword });
            return {
                score: score,
                word: orthword
            };
        }
    }, {
        key: "getRegEx",
        value: function getRegex(dir, ax, ay, rack) {
            // console.log(dir+" "+ax+" "+ay+" "+rack);
            var bestscore = 0;
            // deX........  => /de[a-z]{1,7}/g
            // ..eX.m.....  => /e[a-z]{2}m[a-z]{0,3}/g
            // ...X.m..p..  => /e[a-z]m[a-z]{2}p[a-z]{0,2}/g

            // r = new RegExp("de[a-z]{1,7}", "g")
            // word.match(r); // returns null if nothing found
            var letrange = "[" + rack + "]";
            // if (g_opponent_has_joker)
            //     letrange = g_letrange;

            var numlets = rack.length;

            if (this.g_board[ax][ay] !== "")
                // There already a letter on the board here
                return null;

            var xdir = (dir == "x"); 

            var ap = xdir ? ax : ay;
            var max = xdir ? this.g_board.length : this.g_board[ax].length;

            var dx = xdir ? 1 : 0;
            var dy = 1 - dx;

            //--------------------------------------------------------------------
            // check that there is some letter on the board
            // that we can connect to
            var ok = false;

            var l_x = ax - dx; // board position to left of x
            var a_y = ay - dy; // board position above y

            if (ap > 0 && this.g_board[l_x][a_y] !== "")
                // Either placement to left of x or
                // above y has a letter on board
                ok = true;

            // Start scanning for letters on board from parallel lines
            // staring at position ax+1,ay or ax,ay+1
            var sc = ap; // sc: short for scan
            var scx = ax + dx;
            var scy = ay + dy;

            // by default, set the minimum location of the first
            // letter found in the parallel line search to be
            // higher than any possible minimum found when building
            // the regex, so that if no minimum is found in the
            // parallel scan, the minimum from the regex creation
            // will be used.
            var sminpos = max;
            var empty;

            if (!ok)
                empty = 0;
            // No board letters to the left or above anchor, check
            // if lines parallel to direction have letters in them.
            while (sc < max - 1) {
                if (this.g_board[scx][scy] !== "") {
                    ok = true;
                    break;
                } else
                    empty++;

                if (empty > numlets)
                    // we can't get further than this point
                    // with the number of letters we have
                    break;
                a_y = scy - dx; // x line above y
                var b_y = scy + dx; // x line below y
                l_x = scx - dy; // y line left of x
                var r_x = scx + dy; // y line right of x
                if (l_x >= 0 && a_y >= 0 && this.g_board[l_x][a_y] !== "" ||
                    r_x < max && b_y < max && this.g_board[r_x][b_y] !== "") {
                    // found a board letter to the left or
                    // above the scanned line.
                    sminpos = sc + 1;
                    ok = true;
                    break;
                }

                scx += dx;
                scy += dy;
                sc++;
            }

            if (!ok)
                // No letters that we can connect to from ax,ay
                return null;

            //----------------------------------------------------------------------
            // Find any letters immediately preceeding the first placement location

            var ps = ap - 1;
            var xs = ax - dx;
            var ys = ay - dy;
            while (ps >= 0 && this.g_board[xs][ys] !== "") {
                xs -= dx;
                ys -= dy;
                ps--;
            }

            if (ps < 0) {
                ps = 0;
                if (xs < 0)
                    xs = 0;
                else
                if (ys < 0)
                    ys = 0;
            }

            var prev = "";
            for (var i = ps; i < ap; i++) {
                prev += this.g_board[xs][ys];
                xs += dx;
                ys += dy;
            }
            // prev now contains the sequence of letters that immediatly preceede
            // the anchor position (either above it or to it's left, depending on
            // the direction context).

            //--------------------------------------------------------------------
            // Generate the regular expression for the possible words
            // starting at ax,ay using direction dir. Also calculate minimum
            // word size, maximum word size and word starting position.

            var x = ax; // x anchor coordinate
            var y = ay; // y anchor coordinate
            var p = ap; // either ax or ay, depending on the context

            var mws = "_"; // "^"; // marker for word start
            var mwe = "_"; // "$"; // marker for word end
            var regex = mws + prev; // regexp match
            var regex2 = ""; // another possible match
            var letters = 0;
            var blanks = 0;

            var minl = 0; // minimum word length that can be created
            var minplay = 1; // no letters were played yet

            var countpost; // flag to include letters in line for minl count

            var prevlen = prev.length;

            var flpos = ap;
            var l;
            // iterate over word letters
            while (p < max) {
                // l is the letter at position x,y on the board
                l = this.g_board[x][y];
                if (l === "") {
                    // There is no letter at board position x,y
                    if (p == ap && prevlen > 0) {
                        minl = prevlen + 1;
                        // start adding additional board
                        // letters to minimum word length
                        countpost = true;
                    } else
                        // stop adding additional board
                        // letters to minimum word length
                        countpost = false;

                    blanks++;
                    if (letters == numlets)
                        break;
                    letters++;
                } else {
                    var hadletters = true;
                    if (blanks > 0) {
                        regex += "(" + letrange;
                        if (blanks > 1) {
                            // If there are letters before the anchor position
                            // and two or more free spaces, we can add another
                            // match for a shorter word without the connecting
                            // to additional letters in same line on board.
                            // For example, the following:
                            // ..ad..sing (two blanks after d)
                            // Should make it possible to find ..adD.sing
                            // and also ..adVIsing, so the search should match
                            // _ad([a-z]{1})_  or _ad([a-z]{2})sing_
                            if (prev !== "") {
                                regex2 = "|" + regex;
                                if (blanks > 2)
                                    regex2 += "{1," + (blanks - 1) + "}";
                                regex2 += ")" + mwe;
                            }
                            regex += "{" + blanks + "}";
                        }
                        regex += ")"; // close group capture
                        if (minl === 0) {
                            minl = prevlen + blanks;
                            // start adding additional board
                            // letters to minimum word length
                            countpost = true;
                        }
                        if (countpost && flpos == ap)
                            // save 1st letter position
                            flpos = p;
                        blanks = 0;
                    }
                    regex += l;
                    if (countpost)
                        minl++;
                    minplay = 0; // letters were played
                }
                x += dx;
                y += dy;
                p++;
            }

            if (blanks > 0) {
                // Last place was a blank
                regex += "(" + letrange;
                if (p == max)
                    // and it was the end of the board
                    regex += "{" + minplay + "," + blanks + "}";
                else {
                    // used all the letters before
                    // reaching the end of the board
                    // check the next board space
                    if (this.g_board[x][y] === "")
                        regex += "{" + minplay + "," + blanks + "}";
                    else {
                        regex += "{" + blanks + "}";
                        for (i = p + 1; i < max; i++) {
                            l = this.g_board[x][y];
                            if (l === "") break;
                            regex += l;
                            x += dx;
                            y += dy;
                        }
                    }
                }
                regex += ")"; // close group capture
            }

            // flpos - position of first letter that was found
            //         when generating the regex
            // sminpos - first letter found in parallel line scan
            //logit( "flpos="+flpos+", sminpos="+sminpos );
            if (flpos == ap)
                // no first letter was found in the regex scan.

                // Are there any letters before the anchor ?
                if (prev !== "")
                    //  yes - then the minimum is one more
                    minl = prevlen + 1;
                else
                    // No, then set the minimum word length to
                    // be the distance to the first letter found
                    // in the parallel line scan.
                    minl = sminpos - ap + 1;
            else {
                var mindiff = flpos - sminpos;
                if (mindiff > 1)
                    // If the regex scan first letter position is at a
                    // distance of two or more further from the parallel
                    // scan first letter position, then the minimum word
                    // length is the distance from the anchor to the first
                    // letter found in the parallel scan.
                    minl -= mindiff;
            }

            var s = ap - prev.length;
            var maxl = p - s;

            // if there was another possible match then add it
            regex += mwe + regex2;

            // eg: {rgx: "^am[a-z]{2}t$", xs: 0, min: 3, max: 5, prf: "am"}
            // will be returned for |am*.t|
            // TODO: optimize by eliminating length 4 in this case
            var res = {
                rgx: regex,
                ps: s,
                min: minl,
                max: maxl
            };
            res.prec = prev;
            res.xy = dir;
            // console.log(res);
            return res;
        }
    }, {
        key: "getBestScore",
        value: function getBestScore(regex, letters, ax, ay) {
            // console.log("get best score: " + ax +"," + ay);
            var rletmap = {};
            var numjokers = 0;
            for (var i = 0; i < letters.length; i++) {
                var ltr = letters[i];
                if (ltr == "*") // joker
                    numjokers++;
                else
                if (!(ltr in rletmap))
                    rletmap[ltr] = 1;
                else
                    rletmap[ltr]++;
            }

            var bestscore = -1;
            var bestword = {
                score: -1
            };
            var difficultyScore = [{
                "freq": 0,
                "wordinfo": {}
            }, {
                "freq": 0,
                "wordinfo": {}
            }, {
                "freq": 0,
                "wordinfo": {}
            }, {
                "freq": 0,
                "wordinfo": {}
            }, {
                "freq": 0,
                "wordinfo": {}
            }];

            // if (regex.max - 1 >= g_wstr[this.players[this.playerToPlay].lang].length)
            //     return bestword;

            var regexp = new RegExp(regex.rgx, "g");
            var match, matches;
            var req_seq, word;

            for (var wlc = regex.min - 2; wlc < regex.max - 1; wlc++) {
                var id = regex.rgx + wlc;
                if (id in this.g_matches_cache)
                    matches = this.g_matches_cache[id];
                else {
                    matches = [];
                    while ((match = regexp.exec(g_wstr[this.players[this.playerToPlay].lang][wlc])) !== null) {
                        // go over all matching regex groups for this word
                        // (g_wstr[wlc]), and save the required letters
                        req_seq = "";
                        //g_timers.begin( "req_seq using loop" );
                        for (i = 1; i < match.length; i++) {
                            if (match[i]) // ignore the groups with 'undefined'
                                req_seq += match[i];
                        }
                        //g_timers.pause( "req_seq using loop" );
                        // save the word and the missing letters
                        var mseq = match[0];
                        // remove the marker symbols for the regex match
                        word = mseq.substr(1, mseq.length - 2);
                        matches.push({
                            word: word,
                            reqs: req_seq
                        });
                    }

                    // cache the regexp word match and required letters
                    this.g_matches_cache[id] = matches;
                }

                for (var j = 0; j < matches.length; j++) {

                    // we have a word that matches the required regular expression
                    // check if we have matching letters for the sequence of missing
                    // letters found in the regular expression for this word

                    // create a count of the letters available to play

                    var seq_lscrs = [];

                    req_seq = matches[j].reqs;
                    word = matches[j].word;

                    //g_timers.begin( "letmap init" );
                    var letmap = gCloneFunc(rletmap);
                    //g_timers.pause( "letmap init" );

                    // Check if the letters we have can create the word
                    var ok = true;
                    var jokers = numjokers;

                    for (i = 0; i < req_seq.length; i++) {
                        var rlet = req_seq.charAt(i);
                        //if (rlet in letmap && letmap[rlet]>0 ) {
                        // the above is not necessary due to regex optmizations
                        if (letmap[rlet] > 0) {
                            letmap[rlet]--;
                            // seq_lscrs.push(g_letscore[rlet]);
                            var playerLang = this.players[this.playerToPlay].lang;
                            seq_lscrs.push(window.letterValues[playerLang][this.gameMode][rlet]["v"]);
                        } else {
                            // we don't have a letter required for this word
                            // or we don't have enough of this type of letter
                            if (jokers === 0) {
                                // and no jokers either - can't create
                                // this word.
                                ok = false;
                                break;
                            }
                            // a joker is required
                            jokers--;
                            seq_lscrs.push(0); // no points for joker
                        }
                    }

                    if (!ok)
                        // Can't create this word, continue to the next one
                        continue;


                    // We have all the letters required to create this word
                    var wordinfo = {
                        word: word,
                        ax: ax,
                        ay: ay
                    };
                    wordinfo.seq = req_seq; // sequence to put on board
                    wordinfo.lscrs = seq_lscrs; // sequence letter scores
                    wordinfo.ps = regex.ps; // index of word start
                    wordinfo.xy = regex.xy; // direction of scan
                    wordinfo.prec = regex.prec; // letters before anchor

                    //  ----------- JSCRAB BEST WORD LOGIC ----------------------
                    // g_timers.begin( "getWordScore" );
                    // getWordScore will return the total score of all the orthogonal
                    // created words from placing this word. It will also populate
                    // wordinfo with a new field words, which will contain the array
                    // of the valid created orthogonal words (if score>0)
                    // var Regscore = this.getWordScore( wordinfo );
                    var score = this.getWordScore(wordinfo);
                    // var score = window.marbbleWordmap[this.players[this.playerToPlay].lang][word]; //get frequency of word
                    //g_timers.pause( "getWordScore" );
                    // if(score >= 17000 && score > difficultyScore[0]["freq"]) {
                    //   difficultyScore[0] = {"freq": score, wordinfo: wordinfo}
                    // } if(17000 > score && score > difficultyScore[1]["freq"]) {
                    //   difficultyScore[1] = {"freq": score, wordinfo: wordinfo}
                    // } else if(10000 > score && score > difficultyScore[2]["freq"]) {
                    //   difficultyScore[2] = {"freq": score, wordinfo: wordinfo}
                    // } else if(7000 > score && score > difficultyScore[3]["freq"]) {
                    //   difficultyScore[3] = {"freq": score, wordinfo: wordinfo}
                    // } else if(score <= 5000 && score > difficultyScore[0]["freq"]){
                    //   difficultyScore[4] = {"freq": score, wordinfo: wordinfo}
                    // }
                    //
                    //     var playLevelToUse = this.playLevel;
                    // for(var levelToUse = playLevelToUse; levelToUse < 5; levelToUse++) {
                    //   if(difficultyScore[playLevelToUse]["freq"] > 0) {
                    //     playLevelToUse = levelToUse;
                    //     break
                    //   }
                    // }

                    var more = Math.ceil(Math.random() * 1);
                    var maxwpoints = this.g_maxwpoints[this.g_playlevel] + more;
                    var trans = "";
                    try {
                        trans = window.marbbleDic[this.getPlayer().lang][this.getNextPlayer().lang][wordinfo.word];
                    } catch (e) {
                        //do something
                        trans = "";
                    }

                    if (score < maxwpoints && bestscore < score) {
                        if (trans != wordinfo.word && trans != "undefined" && trans != "") {
                            bestscore = score;
                            bestword = wordinfo;
                            bestword.score = score;
                        }
                    }
                    // try {
                    //   if(typeof difficultyScore[playLevelToUse]["wordinfo"] != 'undefined' &&
                    //     this.getWordScore(difficultyScore[playLevelToUse]["wordinfo"]) > -1) {
                    //     bestscore = difficultyScore[playLevelToUse]["freq"];
                    //     bestword = difficultyScore[playLevelToUse]["wordinfo"];
                    //     bestword.score = difficultyScore[playLevelToUse]["freq"];
                    //   }
                    // } catch(e) {
                    //
                    // }


                    //put highest frequency in its group
                    //(if higher than previous frequency of same group)
                    //  ----------- END JSCRAB BEST WORD LOGIC ----------------------
                }
            }
            return bestword;
        }
    }, {
        key: "getGameMode",
        value: function getGameMode() {
            return this.gameMode;
        }
    }, {
        key: "setGameMode",
        value: function setGameMode(gameMode) {
            this.gameMode = gameMode;
        }
    }]);

    return Game;
}();
