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

var GameComponent = function() {
    function GameComponent(screenDivId, controler) {
        _classCallCheck(this, GameComponent);
        var component = this;
        this.controler = controler;
        this.screenDiv = document.getElementById(screenDivId);
        if (!this.screenDiv) {
            throw "Missing board div " + screenDivId;
        }

        this.gameScreenDiv = document.createElement('div');
        this.gameScreenDiv.id = "gameScreen";
        this.gameScreenDiv.className = "marbblescreen"

        this.screenDiv.appendChild(this.gameScreenDiv);

        //
        this.playersDiv = document.createElement('div');
        this.playersDiv.id = "mbb_players";
        this.playersDiv.className = "players";

        //left button
        this.prevButton = document.createElement('div');
        this.prevButton.id = "prevButton";
        this.prevButton.className = "prevButton";
        this.prevButton.classList.add('cursorClickable');
        this.prevButton.addEventListener("click", this.controler.backToMain.bind(this.controler), true);
        this.playersDiv.appendChild(this.prevButton);

        //right button
        this.chatButton = document.createElement('div');
        this.chatButton.id = "chatButton";
        this.chatButton.className = "chatButton";
        this.chatButton.classList.add('cursorClickable');
        var notYetAvailableText = this.controler.appLanguage.notyetavailable;
        var helpImplementText = this.controler.appLanguage.helpusimplement;
        this.chatButton.addEventListener("click", this.showMessage.bind(this, notYetAvailableText + ", <a id='tipeeeLink' href='https://www.tipeee.com/manatygames' target='blank'>" + helpImplementText +"</a>"));
        // this.playersDiv.appendChild(this.chatButton);


        //middle
        this.opponentInfoMidDiv = document.createElement('div');
        this.opponentInfoMidDiv.className = "opponentInfoMid";
        this.playersDiv.appendChild(this.opponentInfoMidDiv);

        //playerContainerLeft
        this.playerContainerLeft = document.createElement('div');
        this.playerContainerLeft.id = "playerContainerLeft";
        this.playerContainerLeft.className = "playerContainerLeft";
        this.opponentInfoMidDiv.appendChild(this.playerContainerLeft);

        //playerContainerRight
        this.playerContainerRight = document.createElement('div');
        this.playerContainerRight.id = "playerContainerRight";
        this.playerContainerRight.className = "playerContainerRight";
        this.opponentInfoMidDiv.appendChild(this.playerContainerRight);

        //playerContainerMid
        this.playerContainerMid = document.createElement('div');
        this.playerContainerMid.id = "playerContainerMid";
        this.playerContainerMid.className = "playerContainerMid";
        this.opponentInfoMidDiv.appendChild(this.playerContainerMid);

        this.gameScreenDiv.appendChild(this.playersDiv);
        this.playerComponents = [];

        //last action strip
        this.lastActionContainerDiv = document.createElement('div');
        this.lastActionContainerDiv.id = 'lastActionStrip';
        this.lastActionContainerDiv.className = 'lastActionStrip';
        this.lastActionContainerDiv.classList.add('inner-border');
        this.gameScreenDiv.appendChild(this.lastActionContainerDiv);
        //last action left image
        this.lastActionLeftDiv = document.createElement('div');
        this.lastActionLeftDiv.id = 'lastActionLeft';
        this.lastActionLeftDiv.classList.add('lastActionLeft');
        //this.lastActionContainerDiv.appendChild(this.lastActionLeftDiv);
        //last action right image
        this.lastActionRightDiv = document.createElement('div');
        this.lastActionRightDiv.id = 'lastActionRight';
        this.lastActionRightDiv.classList.add('lastActionRight');
        //this.lastActionContainerDiv.appendChild(this.lastActionRightDiv);
        //last action middle
        this.lastActionMidDiv = document.createElement('div');
        this.lastActionMidDiv.id = 'lastActionMid';
        this.lastActionMidDiv.classList.add('lastActionMid');
        //this.lastActionContainerDiv.appendChild(this.lastActionMidDiv);
        //last action text div
        this.lastActionTextDiv = document.createElement('div');
        this.lastActionTextDiv.id = 'lastActionText';
        this.lastActionTextDiv.className = 'lastActionText';
        this.lastActionTextDiv.innerHTML = "";
        //this.lastActionMidDiv.appendChild(this.lastActionTextDiv);
        this.lastActionContainerDiv.appendChild(this.lastActionTextDiv);

        this.boardDivContainer = document.createElement('div');
        this.boardDivContainer.id = "boardContainer";
        this.boardDivContainer.className = "boardContainer";
        this.boardDivContainer.classList.add('overflow');
        this.zoomActive = false;
        this.lastX = 0;
        this.lastY = 0;
        this.zoomXCenter = 0;
        this.zoomYCenter = 0;
        this.isMenuEnabled = true;
        this.moveX = 0;
        this.moveY = 0;

        this.gameScreenDiv.appendChild(this.boardDivContainer);

        this.boardDiv = document.createElement('div');
        this.boardDiv.id = "mbb_board";
        this.boardDiv.className = "board";

        //this displays the tile rows
        var i = void 0,
            j = void 0;
        for (i = 0; i < 15; i++) {
            var tileRowDiv = document.createElement('div');
            tileRowDiv.id = "row" + (i + 1);
            tileRowDiv.className = "tileRow";
            this.boardDiv.appendChild(tileRowDiv);
            for (j = 0; j < 15; j++) {
                var tileBgDiv = this.buildTileBg(boardBg[i * 15 + j], i, j, "board_tileBg_" + i + "_" + j);
                tileRowDiv.appendChild(tileBgDiv);
            }
        }

        //comment this line to hide the gameboard
        this.boardDivContainer.appendChild(this.boardDiv);
        this.playerRacksDiv = document.createElement('div');
        this.playerRacksDiv.id = "playerRack";
        this.playerRacksDiv.className = "playerRack";
        this.gameScreenDiv.appendChild(this.playerRacksDiv);


        this.translationDiv = document.createElement('div');
        this.translationDiv.className = "translation";
        this.gameScreenDiv.appendChild(this.translationDiv);

        //main modal message container
        this.showModalDiv = document.createElement('div');
        this.showModalDiv.className = "showModalDialog";
        this.showModalDiv.id = "showModalDialog";

        //modal content div
        this.showModalContentDiv = document.createElement('div');
        this.showModalContentDiv.className = "showModalContent";
        this.showModalContentDiv.id = "showModalContent";
        //span element
        this.showModalSpan = document.createElement('span');
        this.showModalSpan.className = "close";
        this.showModalSpan.id = "close";
        this.showModalSpan.innerHTML = "x";
        this.showModalContentDiv.appendChild(this.showModalSpan);
        this.showModalSpan.addEventListener('click', this.controler.closeInvalidWordDialog.bind(this.controler), true);

        //paragraph element
        this.showModalParagraph = document.createElement('P');
        this.showModalParagraph.id = "showModalParagraph";
        this.showModalParagraph.className = "showModalParagraph";
        this.showModalContentDiv.appendChild(this.showModalParagraph);

        //button container
        this.buttonContainerDiv = document.createElement('div');
        this.buttonContainerDiv.id = 'buttonContainer';
        this.buttonContainerDiv.className = 'buttonContainer';

        //pass container div
        this.passModalDivContainer = document.createElement('div');
        this.passModalDivContainer.id = 'passModalDivContainer';
        this.passModalDivContainer.className = 'passModalDivContainer';

        //cancel button
        this.modalCancelButton = document.createElement('button');
        this.modalCancelButton.innerHTML = this.controler.appLanguage.cancel;
        this.modalCancelButton.id = 'cancelButton';
        this.modalCancelButton.className = 'cancelButton';
        this.modalCancelButton.classList.add('floatLeft');
        this.modalCancelButton.addEventListener('click', this.hideDialog.bind(this));

        //append the cancel button to the passModalDivContainer
        this.passModalDivContainer.appendChild(this.modalCancelButton);

        //pass ok button
        this.passOkButton = document.createElement('button');
        this.passOkButton.innerHTML = this.controler.appLanguage.ok;
        this.passOkButton.id = 'passOkButton';
        this.passOkButton.className = 'okButton';
        this.passOkButton.classList.add('floatRight');
        this.passOkButton.addEventListener('click', this.controler.confirmPass.bind(this.controler), true);
        //append the pass ok button to the passModalDivContainer
        this.passModalDivContainer.appendChild(this.passOkButton);

        //append the passModalDivContainer to the buttonContainerDiv
        this.buttonContainerDiv.appendChild(this.passModalDivContainer);

        //back to main modal div
        this.backToMainDivContainer = document.createElement('div');
        this.backToMainDivContainer.id = 'backToMainDivContainer';
        this.backToMainDivContainer.className = 'backToMainDivContainer';

        this.backToMainCancelButton = this.modalCancelButton.cloneNode(true);
        this.backToMainCancelButton.addEventListener('click', this.hideDialog.bind(this));

        //append the cancel button to the div
        this.backToMainDivContainer.appendChild(this.backToMainCancelButton);

        //back ok button
        this.backToMainOkButton = document.createElement('button');
        this.backToMainOkButton.innerHTML = this.controler.appLanguage.ok;
        this.backToMainOkButton.id = 'backToMainOKButton';
        this.backToMainOkButton.className = 'okButton';
        this.backToMainOkButton.classList.add('floatRight');
        this.backToMainOkButton.addEventListener('click', this.controler.confirmBackToMain.bind(this.controler), true);

        //append the backToMainOkButton ok button to the leaveModalDivContainer
        this.backToMainDivContainer.appendChild(this.backToMainOkButton);

        //append the backToMainDivContainer to the buttonContainerDiv
        this.buttonContainerDiv.appendChild(this.backToMainDivContainer);

        //leave modal div
        this.leaveModalDivContainer = document.createElement('div');
        this.leaveModalDivContainer.id = 'leaveModalDivContainer';
        this.leaveModalDivContainer.className = 'leaveModalDivContainer';

        this.leaveCancelButton = this.modalCancelButton.cloneNode(true);
        this.leaveCancelButton.addEventListener('click', this.hideDialog.bind(this));

        //append the cancel button to the div
        this.leaveModalDivContainer.appendChild(this.leaveCancelButton);

        //leave ok button
        this.leaveOkButton = document.createElement('button');
        this.leaveOkButton.innerHTML = this.controler.appLanguage.ok;
        this.leaveOkButton.id = 'leaveOkButton';
        this.leaveOkButton.className = 'okButton';
        this.leaveOkButton.classList.add('floatRight');
        this.leaveOkButton.addEventListener('click', this.controler.confirmLeave.bind(this.controler), true);

        //append the leave ok button to the leaveModalDivContainer
        this.leaveModalDivContainer.appendChild(this.leaveOkButton);
        //append the leave modal div container to the button container
        this.buttonContainerDiv.appendChild(this.leaveModalDivContainer);

        //success modal div
        this.successModalDivContainer = document.createElement('div');
        this.successModalDivContainer.id = 'successModalDivContainer';
        this.successModalDivContainer.className = 'successModalDivContainer';

        //success ok button
        this.successOkButton = document.createElement('button');
        this.successOkButton.innerHTML = this.controler.appLanguage.ok;
        this.successOkButton.id = 'successOKButton';
        this.successOkButton.className = 'okButton';
        this.successOkButton.addEventListener('click', this.controler.confirmEndGame.bind(this.controler), true);

        //append the leave ok button to the leaveModalDivContainer
        this.successModalDivContainer.appendChild(this.successOkButton);
        //append the leave modal div container to the button container
        this.buttonContainerDiv.appendChild(this.successModalDivContainer);

        //append the buttonContainerDiv to the showModalContentDiv
        this.showModalContentDiv.appendChild(this.buttonContainerDiv);

        //main message
        this.showModalParagraphText = document.createElement('div');
        this.showModalParagraphText.id = 'messageText';

        this.showModalParagraph.appendChild(this.showModalParagraphText);

        this.showModalDiv.appendChild(this.showModalContentDiv);

        this.gameScreenDiv.appendChild(this.showModalDiv);
        //end showModalDiv

        //words modal
        this.wordModal = document.createElement('div');
        this.wordModal.id = "wordModal";
        this.wordModal.className = "wordModal";
        // this.wordModal.style.display = "none";

        this.wordModalContainer = document.createElement('div');
        this.wordModalContainer.id = "wordModalContainer";

        this.wordModalTabs = document.createElement('wordModalTabs');
        this.wordModalTabs.id = 'wordModalTabs';

        this.playedButtonContainer = document.createElement('div');
        this.playedButtonContainer.className = 'buttonContainer';
        this.playedButton = document.createElement('button');
        this.playedButton.id = 'playedButton';
        this.playedButton.className = 'menuButton';
        this.playedButton.innerHTML = this.controler.appLanguage.playedWords;
        this.playedButton.classList.add('active');
        this.playedButtonContainer.appendChild(this.playedButton);
        this.wordModalTabs.appendChild(this.playedButtonContainer);

        this.definitionButtonContainer = document.createElement('div');
        this.definitionButtonContainer.className = 'buttonContainer';
        this.definitionButton = document.createElement('button');
        this.definitionButton.id = 'definitionButton';
        this.definitionButton.className = 'menuButton';
        this.definitionButton.innerHTML = this.controler.appLanguage.definitions;
        this.definitionButtonContainer.appendChild(this.definitionButton);
        this.wordModalTabs.appendChild(this.definitionButtonContainer);

        this.searchButtonContainer = document.createElement('div');
        /** FIX **/
        this.searchForm = document.createElement('form');
        this.searchForm.action = "";
        this.searchForm.className = "search";
        this.searchButton = document.createElement('input');
        this.searchButton.id = "submit";
        this.searchButton.type = "submit";
        this.searchButton.value = "";
        this.searchForm.appendChild(this.searchButton);
        this.searchButtonIcon = document.createElement('a');
        this.searchButtonIcon.href = "javascript:%20void(0)";
        this.searchButtonIcon.className = "icon";
        this.searchForm.appendChild(this.searchButtonIcon);
        this.searchInput = document.createElement('input');
        this.searchInput.type = 'search';
        this.searchInput.name = 'Search';
        this.searchInput.id = 'search';
        this.searchInput.placeholder = 'Search';
        this.searchForm.appendChild(this.searchInput);
        this.searchButtonContainer.appendChild(this.searchForm);
        this.searchButtonContainer.className="buttonContainer";
        // this.searchButton = document.createElement('div');
        // this.searchButton.className = 'menuButton';
        // this.searchButton.id = 'wordModalSearchContainer';
        // this.searchButtonContainer.appendChild(this.searchButton);
        // this.searchButtonIcon = document.createElement('div');
        // this.searchButtonIcon.innerHTML = "&#9906;";
        // this.searchButtonIcon.className = "wordModalSearch";
        // this.searchButton.appendChild(this.searchButtonIcon);
        // this.searchInput = document.createElement('input');
        // this.searchInput.placeholder = 'Search';
        // this.searchButton.appendChild(this.searchInput);
        // this.wordModalTabs.appendChild(this.searchButtonContainer);
        //
        this.searchButtonIcon.addEventListener('click', function(e) {
          //console.log(("click");
          //console.log((component.controler);
          var playerToPlay = component.controler.model.playerToPlay
          var nextPlayer = playerToPlay == 0 ? 1 : 0;
          //console.log(("current player " + playerToPlay);
          //console.log(("next player " + nextPlayer);
          var srcLang = component.controler.model.players[playerToPlay].lang;
          var targetLang = component.controler.model.players[nextPlayer].lang;
          //console.log(("player to play lang " + srcLang);
          //console.log(("next player to play lang " + targetLang);
          component.getDefinition(component.searchInput.value, "search", srcLang, targetLang);
        });

        this.wordModalTabContentContainer = document.createElement('div');
        this.wordModalTabContentContainer.id = 'wordModalTabContentContainer';
        this.wordsPlayedTab = document.createElement('div');
        this.wordsPlayedTab.id = 'wordsPlayedTab';
        this.wordsPlayedTab.className = 'wordModalTabContent';
        this.wordModalTabContentContainer.appendChild(this.wordsPlayedTab);

          // word definition tab
          this.wordsDefinitionTab = document.createElement('div');
          this.wordsDefinitionTab.id = "wordsDefinition";
          this.wordsDefinitionTab.className = "wordModalTabContent";

          this.wordsDefinitionTable = document.createElement('table');
          this.wordsDefinitionTab.appendChild(this.wordsDefinitionTable);
          this.translationRow = document.createElement('tr');
          this.translationRow.className = "translation";
          this.wordsDefinitionTable.appendChild(this.translationRow);
          this.translationOriginTd = document.createElement('td');
          this.translationRow.appendChild(this.translationOriginTd);
          this.translationSpacerTd = document.createElement('td');
          this.translationRow.appendChild(this.translationSpacerTd);
          this.translationTargetTd = document.createElement('td');
          this.translationRow.appendChild(this.translationTargetTd);

            // word definition tab header
            this.wordDefinitionTabHeader = document.createElement('h3');
            this.wordDefinitionSource = document.createElement('span');
            this.wordDefinitionSource.className = 'definition-origin';
            this.translationOriginTd.appendChild(this.wordDefinitionSource);
            this.wordDefinitionSpacer = document.createElement('span');
            this.wordDefinitionSpacer.innerHTML = " = ";
            this.translationSpacerTd.appendChild(this.wordDefinitionSpacer);
            this.wordDefinitionTarget = document.createElement('span');
            this.translationTargetTd.appendChild(this.wordDefinitionTarget);
            this.wordDefinitionTarget.className = 'definition-target';

            this.definitionsSection = document.createElement('div');
            this.definitionsSection.className = "definitions";
            this.definitionsSection.id = "definitionsSection";

            this.noInternetSection = document.createElement('div');
            this.noInternetSection.className = "no-internet";
            this.noInternetSection.id = "noInternetSection";

            //no internet connection
            var noInternetText = document.createElement('div');
            noInternetText.className = "no-internet-text";
            noInternetText.innerHTML = this.controler.appLanguage.noInternet;
            this.noInternetSection.appendChild(noInternetText);

            //word definition flags
            this.wordDefinitionFlags = document.createElement("tr");
            this.wordDefinitionFlags.className = 'wordsDefinitionFlags';
            this.wordsDefinitionTable.appendChild(this.wordDefinitionFlags);

            //not in dictionary section
            this.notInDictionarySection = document.createElement('div');
            this.notInDictionarySection.className = "not-in-dictionary";
            this.notInDictionarySection.id = "notInDictionary";

            //word not in dictionary text
            this.notInDictionaryTextContainer = document.createElement('div');
            this.notInDictionaryTextContainer.className = "not-in-dictionary-text-container";
            this.notInDictionaryTextContainer.id = "notInDictionaryTextContainer";
            this.notInDictionarySection.appendChild(this.notInDictionaryTextContainer);

            this.notInDictionaryText = document.createTextNode('Word');
            this.notInDictionaryText.id = "notInDictionaryText";
            this.notInDictionaryTextContainer.appendChild(this.notInDictionaryText);

            //word not in dictionary and wiktionary text
            this.notInWikiText = document.createElement('div');
            this.notInWikiText.className = "not-in-wiki-text";
            this.notInWikiText.id = "notInWikiText";
            //this.notInWikiText.innerHTML = this.controler.appLanguage.wordWasNotFoundInDicAndWik;
            this.notInDictionarySection.appendChild(this.notInWikiText);

            //main definition portion
            this.wordDefinitionMain = document.createElement("div");

          this.wordsDefinitionTab.appendChild(this.wordDefinitionTabHeader);
          // this.wordsDefinitionTab.appendChild(this.wordDefinitionFlags);
          this.wordsDefinitionTab.appendChild(this.noInternetSection);
          this.wordsDefinitionTab.appendChild(this.notInDictionarySection);
          this.wordsDefinitionTab.appendChild(this.definitionsSection);
          this.wordModalTabContentContainer.appendChild(this.wordsDefinitionTab);
          // end word definition tab

        this.wordModalContainer.appendChild(this.wordModalTabs)
        this.wordModal.appendChild(this.wordModalContainer);
        this.wordModalContainer.appendChild(this.wordModalTabContentContainer);
        this.gameScreenDiv.insertBefore(this.wordModal, this.gameScreenDiv.firstChild);

        document.getElementById("playedButton")
                .addEventListener("click",  function() {
                                      document.getElementById("playedButton").classList.add("active");
                                      document.getElementById("definitionButton").classList.remove("active");
                                      document.getElementById("wordsDefinition").classList.remove("active");
                                      document.getElementById("wordsPlayedTab").classList.add("active");
                                    });
        document.getElementById("definitionButton")
              .addEventListener("click", function() {
                document.getElementById("playedButton").classList.remove("active");
                document.getElementById("definitionButton").classList.add("active");
                document.getElementById("wordsDefinition").classList.add("active");
                document.getElementById("wordsPlayedTab").classList.remove("active");
                var movesHistory = component.controler.model.movesHistory;
                if(movesHistory && movesHistory.length > 0) {
                    var lastWord = movesHistory[movesHistory.length - 1];
                    if(lastWord && lastWord.style) {
                        component.getDefinition(lastWord.word, "test", lastWord.source, lastWord.target, true, lastWord.style);
                    }
                }
              });
        //end words modal

        //game over content div
        this.gameOverModalContainerDiv = document.createElement('div');
        this.gameOverModalContainerDiv.className = "gameOverModalContainer";
        this.gameOverModalContainerDiv.id = "gameOverModalContainer";
        this.showModalDiv.appendChild(this.gameOverModalContainerDiv);

        //game over status div
        this.gameOverStatusDiv = document.createElement('div');
        this.gameOverStatusDiv.id = 'gameOverStatus';
        this.gameOverStatusDiv.className = 'gameOverStatus';
        this.gameOverModalContainerDiv.appendChild(this.gameOverStatusDiv);

        //game over status text
        this.gameOverStatusText = document.createTextNode('GAME OVER!');
        this.gameOverStatusText.id = 'gameOverStatusText';
        this.gameOverStatusDiv.appendChild(this.gameOverStatusText);

        //gameOverDiv
        this.gameOverDiv = document.createElement('div');
        this.gameOverDiv.id = 'gameOver';
        this.gameOverDiv.className = 'gameOverContent';
        this.gameOverModalContainerDiv.appendChild(this.gameOverDiv);

        var trophyContainerDiv = document.createElement('div');
        trophyContainerDiv.className = 'mainTrophyContainer';
        this.gameOverDiv.appendChild(trophyContainerDiv);

        //trophyDiv
        var endGameStatusDiv = document.createElement('div');
        endGameStatusDiv.className = 'endGameStatusContainer';
        trophyContainerDiv.appendChild(endGameStatusDiv);

        //player1TrophyDiv
        this.player1Trophy = document.createElement('div');
        this.player1Trophy.id = 'player1Trophy';
        this.player1Trophy.className = 'playerTrophy';
        endGameStatusDiv.appendChild(this.player1Trophy);

        //drawTrophyDiv
        this.drawTrophy = document.createElement('div');
        this.drawTrophy.id = 'drawTrophy';
        this.drawTrophy.className = 'drawTrophy';
        endGameStatusDiv.appendChild(this.drawTrophy);

        //player2TrophyDiv
        this.player2Trophy = document.createElement('div');
        this.player2Trophy.id = 'player2Trophy';
        this.player2Trophy.className = 'playerTrophy';
        endGameStatusDiv.appendChild(this.player2Trophy);

        var clearTrophyDiv = document.createElement('div');
        clearTrophyDiv.className = 'clearFloat';
        endGameStatusDiv.appendChild(clearTrophyDiv);



        //gameOverPlayer2Div
        var clearDiv = document.createElement('div');
        clearDiv.className = 'clearFloat';
        this.gameOverDiv.appendChild(clearDiv);

        //gameOverPlayer1Div
        this.gameOverPlayer1Div = document.createElement('div');
        this.gameOverPlayer1Div.className = 'gameOverPlayerContainer';
        this.gameOverDiv.appendChild(this.gameOverPlayer1Div);

        //player1Container
        var player1GameOver = document.createElement('div');
        player1GameOver.className = 'player1GameOver';
        this.gameOverPlayer1Div.appendChild(player1GameOver);

        //player1Name
        this.player1Name = document.createElement('div');
        this.player1Name.id = "player1Name";
        this.player1Name.className = 'gameOverName';
        this.player1Name.innerHTML = "Jack";
        player1GameOver.appendChild(this.player1Name);

        this.player1Score = document.createElement('div');
        this.player1Score.id = "player1Score";
        this.player1Score.className = 'playerFinalScore';
        this.player1Score.innerHTML = "145";
        player1GameOver.appendChild(this.player1Score);

        //gameOverPlayer2Div
        this.gameOverPlayer2Div = document.createElement('div');
        this.gameOverPlayer2Div.className = 'gameOverPlayerContainer';
        this.gameOverDiv.appendChild(this.gameOverPlayer2Div);

        //player2Container
        var player2GameOver = document.createElement('div');
        player2GameOver.className = 'player2GameOver';
        this.gameOverPlayer2Div.appendChild(player2GameOver);

        //player1Name
        this.player2Name = document.createElement('div');
        this.player2Name.id = "player2Name";
        this.player2Name.className = 'gameOverName';
        this.player2Name.innerHTML = "Computer";
        player2GameOver.appendChild(this.player2Name);

        this.player2Score = document.createElement('div');
        this.player2Score.id = "player2Score";
        this.player2Score.className = 'playerFinalScore';
        this.player2Score.innerHTML = "145";
        player2GameOver.appendChild(this.player2Score);

        //gameOverPlayer2Div
        clearDiv = document.createElement('div');
        clearDiv.className = 'clearFloat';
        this.gameOverDiv.appendChild(clearDiv);

        //rematch message div
        this.rematchMessageDiv = document.createElement('div');
        this.rematchMessageDiv.id = 'rematchMessage';
        this.rematchMessageDiv.className = 'rematchMessage';
        this.gameOverModalContainerDiv.appendChild(this.rematchMessageDiv);

        //game over status text
        this.rematchMessageText = document.createTextNode(this.controler.appLanguage.doYouWantToPlayAgain);
        this.rematchMessageText.id = 'rematchMessageText';
        this.rematchMessageDiv.appendChild(this.rematchMessageText);

        //rematch message div
        var gameOverButtonContainerDiv = document.createElement('div');
        gameOverButtonContainerDiv.className = 'gameOverButtonContainer';
        this.gameOverModalContainerDiv.appendChild(gameOverButtonContainerDiv);

        //play again
        this.playAgainDiv = document.createElement('div');
        this.playAgainDiv.id = 'playAgainButton';
        this.playAgainDiv.className = 'playAgainButton';
        this.playAgainDiv.addEventListener('click', this.controler.confirmEndGame.bind(this.controler), true);
        gameOverButtonContainerDiv.appendChild(this.playAgainDiv);


        //leave game
        this.leaveGameDiv = document.createElement('div');
        this.leaveGameDiv.id = 'leaveGameButton';
        this.leaveGameDiv.className = 'leaveGameButton';
        this.leaveGameDiv.addEventListener('click', this.controler.confirmBackToMain.bind(this.controler), true);
        gameOverButtonContainerDiv.appendChild(this.leaveGameDiv);


        ////end of turn modal///

        //main modal message container
        this.nextTurnDiv = document.createElement('div');
        this.nextTurnDiv.className = "showModalDialog";
        this.nextTurnDiv.id = "nextTurnDialog";
        this.gameScreenDiv.appendChild(this.nextTurnDiv);

        //next turn content div
        this.nextTurnContentDiv = document.createElement('div');
        this.nextTurnContentDiv.className = "showModalContentPass";
        this.nextTurnContentDiv.id = "nextTurnContent";
        this.nextTurnDiv.appendChild(this.nextTurnContentDiv);

        //pop-up header
        var popupHeaderDiv = document.createElement('div');
        popupHeaderDiv.className = "popup-header";
        this.nextTurnContentDiv.appendChild(popupHeaderDiv);

        //pop-up header title
        var popupHeaderTitleDiv = document.createElement('div');
        popupHeaderTitleDiv.className = "popup-header-title";
        popupHeaderTitleDiv.innerHTML = this.controler.appLanguage.nextTurn;
        popupHeaderDiv.appendChild(popupHeaderTitleDiv);

        //next turn close div
        this.nextTurnShowModalDiv = document.createElement('div');
        this.nextTurnShowModalDiv.className = "close";
        this.nextTurnShowModalDiv.id = "close";
        this.nextTurnShowModalDiv.innerHTML = "x";
        popupHeaderDiv.appendChild(this.nextTurnShowModalDiv);
        this.nextTurnShowModalDiv.addEventListener('click', this.controler.hideNextTurnDialog.bind(this.controler), true);

        //nextTurnClearDiv
        var nextTurnClearDiv = document.createElement('div');
        clearDiv.className = 'clearFloat';
        popupHeaderDiv.appendChild(nextTurnClearDiv);

        //message text pass
        this.messageTurnPass = document.createElement('div');
        this.messageTurnPass.id = 'messageTextPass';
        this.messageTurnPass.innerHTML = "Pass your device to";
        popupHeaderDiv.appendChild(this.messageTurnPass);

        //play next turn
        this.playNextTurnDiv = document.createElement('div');
        this.playNextTurnDiv.id = 'playNextTurnButton';
        this.playNextTurnDiv.className = 'playNextTurnButton';
        this.playNextTurnDiv.innerHTML = this.controler.appLanguage.play;
        this.playNextTurnDiv.addEventListener('click', this.controler.hideNextTurnDialog.bind(this.controler), true);
        popupHeaderDiv.appendChild(this.playNextTurnDiv);

        this.createUnknownWordDialog();

        //main modal message container
        this.showExchangeDiv = document.createElement('div');
        this.showExchangeDiv.className = "showModalDialog";
        this.showExchangeDiv.id = "showModalDialog";
        this.gameScreenDiv.appendChild(this.showExchangeDiv);

        //bottom modal
        this.bottomExchangeDiv = document.createElement('div');
        this.bottomExchangeDiv.className = "showModalDialogBottom";
        this.bottomExchangeDiv.id = "showModalDialogBottom";
        this.gameScreenDiv.appendChild(this.bottomExchangeDiv);

        //modal content div
        this.exchangeModalContainerDiv = document.createElement('div');
        this.exchangeModalContainerDiv.className = "exchangeModalContainer";
        this.exchangeModalContainerDiv.id = "exchangeModalContainer";
        this.showExchangeDiv.appendChild(this.exchangeModalContainerDiv);

        //exchange title div
        this.exchangeTileTitleContainer = document.createElement('div');
        this.exchangeTileTitleContainer.className = "exchangeTileTitleContainer";
        this.exchangeTileTitleContainer.id = "exchangeTileTitleContainer";
        this.exchangeModalContainerDiv.appendChild(this.exchangeTileTitleContainer);

        this.exchangeTileTitleDiv = document.createElement('div');
        this.exchangeTileTitleDiv.className = "exchangeTileTitle";
        this.exchangeTileTitleDiv.id = "exchangeTileTitle";
        this.exchangeTileTitleDiv.innerHTML = this.controler.appLanguage.exchangeTiles;
        this.exchangeTileTitleContainer.appendChild(this.exchangeTileTitleDiv);

        //exchange close element
        this.closeExchangeButton = document.createElement('span');
        this.closeExchangeButton.className = "exchangeClose";
        this.closeExchangeButton.id = "exchangeClose";
        this.closeExchangeButton.innerHTML = "x";
        this.exchangeTileTitleContainer.appendChild(this.closeExchangeButton);
        this.closeExchangeButton.addEventListener('click', this.controler.hideSwap.bind(this.controler));

        this.exchangeTileCountContainer = document.createElement('div');
        this.exchangeTileCountContainer.className = "exchangeTileCountContainer";
        this.exchangeTileCountContainer.id = "exchangeTileCountContainer";
        this.exchangeModalContainerDiv.appendChild(this.exchangeTileCountContainer);

        this.tileLanguageContainer = document.createElement('div');
        this.tileLanguageContainer.className = "tileLanguageContainer";
        this.tileLanguageContainer.id = "tileLanguageContainer";
        this.exchangeTileCountContainer.appendChild(this.tileLanguageContainer);

        this.flagDiv = document.createElement('div');
        this.flagDiv.className = "playerFlag";
        this.flagDiv.id = "playerFlag";
        this.tileLanguageContainer.appendChild(this.flagDiv);

        this.tileHelpContainer = document.createElement('div');
        this.tileHelpContainer.className = "tileHelpContainer";
        this.tileHelpContainer.id = "tileHelpContainer";
        //this.exchangeTileCountContainer.appendChild(this.tileHelpContainer);

        this.tileHelp = document.createElement('div');
        this.tileHelp.className = "tileHelp";
        this.tileHelp.id = "tileHelp";
        this.tileHelpContainer.appendChild(this.tileHelp);

        this.tilesCount = document.createElement('div');
        this.tilesCount.className = "tilesCount";
        this.tilesCount.id = "tilesCount";
        this.tilesCount.innerHTML = this.controler.appLanguage.tilesLeft;
        this.exchangeTileCountContainer.appendChild(this.tilesCount);

        this.availableTilesContainer = document.createElement('div');
        this.availableTilesContainer.className = "availableTilesContainer";
        this.availableTilesContainer.id = "availableTilesContainer";
        this.exchangeModalContainerDiv.appendChild(this.availableTilesContainer);

        this.letterRackContainer = document.createElement('div');
        this.letterRackContainer.className = "letterRackContainer";
        this.letterRackContainer.id = "letterRackContainer";
        this.exchangeModalContainerDiv.appendChild(this.letterRackContainer);

        this.letterRackHolder = document.createElement('div');
        this.letterRackHolder.className = "letterRackHolder";
        this.letterRackHolder.id = "letterRackHolder";

        var swapCounter = 0;;
        for (swapCounter = 0; swapCounter < 7; swapCounter++) {
            var tileBgDiv = this.buildSwapTileRack('swap_rack_tileBg_' + swapCounter);
            tileBgDiv.swapRackIdx = swapCounter;
            this.letterRackHolder.appendChild(tileBgDiv);
        }


        this.letterRackContainer.appendChild(this.letterRackHolder);

        this.exchangeButtonMainContainer = document.createElement('div');
        this.exchangeButtonMainContainer.className = "exchangeButtonMainContainer";
        this.exchangeButtonMainContainer.id = "exchangeButtonMainContainer";
        this.exchangeModalContainerDiv.appendChild(this.exchangeButtonMainContainer);

        this.exchangeButtonHolder = document.createElement('div');
        this.exchangeButtonHolder.className = "exchangeButtonHolder";
        this.exchangeButtonHolder.id = "exchangeButtonHolder";
        this.exchangeButtonMainContainer.appendChild(this.exchangeButtonHolder);

        this.cancelSwapButton = document.createElement('button');
        this.cancelSwapButton.innerHTML = this.controler.appLanguage.cancel;
        this.cancelSwapButton.id = 'cancelSwapButton';
        this.cancelSwapButton.className = 'cancelButton';
        this.cancelSwapButton.classList.add('floatLeft');
        this.cancelSwapButton.addEventListener('click', this.controler.hideSwap.bind(this.controler), true);
        this.exchangeButtonHolder.appendChild(this.cancelSwapButton);

        this.tileSwapButton = document.createElement('button');
        this.tileSwapButton.innerHTML = this.controler.appLanguage.swap;
        this.tileSwapButton.id = 'okButton';
        this.tileSwapButton.className = 'okButton';
        this.tileSwapButton.classList.add('floatRight');
        this.tileSwapButton.addEventListener('click', this.controler.swapTiles.bind(this.controler), true);
        this.exchangeButtonHolder.appendChild(this.tileSwapButton);

        // //display the available tile row
        // var letters = letterValues["eng"][this.controler.model.gameMode];
        //
        // var currentDataPos = 0;
        // var dataSource = Object.keys(letters).map(function(key) {
        //     var data = {
        //         "letter": String(key),
        //         "n": letters[key].n
        //     };
        //     return data;
        // });
        //
        // while (currentDataPos < dataSource.length) {
        //     var tileRowDiv = document.createElement('div');
        //     tileRowDiv.id = "availableTileRow_" + i;
        //     tileRowDiv.className = "tileExchangeRow";
        //     this.availableTilesContainer.appendChild(tileRowDiv);
        //
        //     for (var i = 0; i < 5; i++) {
        //         var currentData = dataSource[currentDataPos++];
        //         if (currentData) {
        //             var letterContainerDiv = this.buildAvailableTiles(currentData.letter, currentData.n);
        //             tileRowDiv.appendChild(letterContainerDiv);
        //         } else {
        //             break;
        //         }
        //     }
        // }

        //loader div
        //main modal message container
        this.loaderContainerDiv = document.createElement('div');
        this.loaderContainerDiv.className = "showModalDialog";
        this.loaderContainerDiv.id = "loaderContainerDiv";
        this.gameScreenDiv.appendChild(this.loaderContainerDiv);

        //modal content div
        this.loaderContentDiv = document.createElement('div');
        this.loaderContentDiv.className = "showLoaderContent";
        this.loaderContentDiv.id = "showLoaderContent";
        this.loaderContainerDiv.appendChild(this.loaderContentDiv);

        //paragraph element
        this.loaderParagraph = document.createElement('P');
        this.loaderParagraph.id = "loaderParagraph";
        this.loaderParagraph.className = "loaderText";
        this.loaderContentDiv.appendChild(this.loaderParagraph);

        //loader div
        this.loaderDiv = document.createElement('div');
        this.loaderDiv.className = "loader";
        this.loaderDiv.id = "loader";
        this.loaderContentDiv.appendChild(this.loaderDiv);

        this.menuDiv = document.createElement('div');
        this.menuDiv.id = "mbb_menu";
        this.menuDiv.className = "menu";
        this.gameScreenDiv.appendChild(this.menuDiv);

        this.tempScoreDiv = document.createElement('div');
        this.tempScoreDiv.className = "tempScore";
        this.boardDiv.appendChild(this.tempScoreDiv);

        this.wordsDiv = document.createElement('div');
        this.wordsDiv.id = "wordButton";
        this.wordsDiv.className = "menuButton";
        this.wordsDiv.classList.add("wordButton");
        this.wordsDiv.addEventListener("click", function(e) {
          if(this.wordsDiv.classList.contains("active")) {
            this.wordsDiv.classList.remove("active");
            this.openWordsModal(false);
          } else {
            this.wordsDiv.classList.add("active");
            this.openWordsModal(true);
          }}.bind(this)
        );

        this.menuDiv.appendChild(this.wordsDiv);

        this.leaveDiv = document.createElement('div');
        this.leaveDiv.id = "leaveButton";
        this.leaveDiv.className = "menuButton";
        this.leaveDiv.classList.add("leaveButton");
        this.leaveDiv.addEventListener("click", this.controler.leave.bind(this.controler), true);
        this.menuDiv.appendChild(this.leaveDiv);

        this.swapTilesDiv = document.createElement('div');
        this.swapTilesDiv.id = "swapButton";
        this.swapTilesDiv.className = "menuButton";
        this.swapTilesDiv.classList.add("swapButton");
        //this.swapTilesDiv.addEventListener("click", this.controler.swapTiles.bind(this.controler), true);
        this.swapTilesDiv.addEventListener("click", this.controler.showSwapTile.bind(this.controler), true);
        this.menuDiv.appendChild(this.swapTilesDiv);

        //tileBagCount
        this.tileBagCountDiv = document.createElement('div');
        this.tileBagCountDiv.id = "tileBagCount";
        this.tileBagCountDiv.className = "tileBagCount";
        this.swapTilesDiv.appendChild(this.tileBagCountDiv);

        this.shuffleDiv = document.createElement('div');
        this.shuffleDiv.id = "shuffleButton";
        this.shuffleDiv.className = "menuButton";
        this.shuffleDiv.classList.add("shuffleButton");
        this.shuffleDiv.style.display = "inline-block";
        this.shuffleDiv.addEventListener("click", this.controler.shuffleRack.bind(this.controler), true);
        this.menuDiv.appendChild(this.shuffleDiv);

        this.gatherTilesDiv = document.createElement('div');
        this.gatherTilesDiv.id = "gatherButton";
        this.gatherTilesDiv.className = "menuButton";
        this.gatherTilesDiv.classList.add("gatherButton");
        this.gatherTilesDiv.style.display = "none";
        this.gatherTilesDiv.addEventListener("click", this.controler.gatherTiles.bind(this.controler), true);
        this.menuDiv.appendChild(this.gatherTilesDiv);

        this.passDiv = document.createElement('div');
        this.passDiv.id = "passButton";
        this.passDiv.className = "menuButton";
        this.passDiv.classList.add("passButton");
        this.passDiv.style.display = "inline-block";
        this.passDiv.addEventListener("click", this.controler.pass.bind(this.controler), true);
        this.menuDiv.appendChild(this.passDiv);

        this.playDiv = document.createElement('div');
        this.playDiv.id = "playButton";
        this.playDiv.className = "menuButton";
        this.playDiv.classList.add("playButton");
        this.playDiv.style.display = "none";
        this.playDiv.addEventListener("click", this.controler.playForGood.bind(this.controler), true);
        this.menuDiv.appendChild(this.playDiv);

        this.enableGestures(this.boardDiv);
        this.enableGestures(this.screenDiv);
    }

    _createClass(GameComponent, [{
            key: "draw",
            value: function draw(isFirstTurn) {

                if(typeof isFirstTurn == 'undefined') {
                    isFirstTurn = false;
                }

                var docH = document.documentElement.clientHeight;
                var docW = document.documentElement.clientWidth;

                var isMobile = true;

                //if using on browser, set a fixed width and height
                if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && docW > 1024) {
                    docW = 360;
                    docH = 640;
                    isMobile = false;
                }


                //TODO refactor this part and put the dimensions in model
                this.screenDiv.style.width = docW + "px";
                this.screenDiv.style.height = docH + "px";

                this.nextTurnDiv.style.width = docW + "px";
                this.nextTurnDiv.style.height = docH + "px";

                this.showModalDiv.style.width = docW + "px";
                this.showModalDiv.style.height = docH + "px";

                this.unknownWordDiv.style.width = docW + "px";
                this.unknownWordDiv.style.height = docH + "px";


                if (this.controler.model.getPlayer() && this.controler.model.getPlayer().lang == "en") {
                    this.flagDiv.classList.remove('ukFlag', 'frFlag');
                    this.flagDiv.classList.add('ukFlag');
                } else if (this.controler.model.getPlayer() && this.controler.model.getPlayer().lang == "fr") {
                    this.flagDiv.classList.remove('ukFlag', 'frFlag');
                    this.flagDiv.classList.add('frFlag');
                }

                //default value based on 360 x 640
                var playerHeightDiv = 65;
                var topMargin = 3;
                var lastActionStripHeightDiv = 40;
                var playerRackHeightDiv = 55;
                var bottomMargin = 5;
                var menuHeightDiv = 65;
                var exchangeModalPadding = 10;
                var padding = 20;
                var rackPadding = 10;
                var flagIconMargin = 5;
                var helpIconMargin = 2;
                var bottomModalMargin = 0;
                var bottomModalPadding = 0;

                if (docW == 320) {
                    //iPhone
                    playerHeightDiv = 60;
                    playerRackHeightDiv = 45;
                    bottomMargin = 0;
                    menuHeightDiv = 60;
                    rackPadding = 20;
                } else if (docW == 360) {
                    //Galaxy Note
                    playerHeightDiv = 65;
                    menuHeightDiv = 65;
                    rackPadding = 20;
                } else if (docW == 375) {
                    //iPhone 6
                    playerHeightDiv = 70;
                    menuHeightDiv = 70;
                    rackPadding = 20;
                } else if (docW == 384) {
                    //LG Nexus 4
                    playerHeightDiv = 70;
                    menuHeightDiv = 70;
                } else if (docW == 414) {
                    //414 x 736 iPhone 6+, iPhone 7+, iPhone 8+
                    playerHeightDiv = 80;
                    menuHeightDiv = 80;
                    lastActionStripHeightDiv = 45;
                    exchangeModalPadding = 15;
                    rackPadding = 20;
                } else if(docW == 480 && docH == 800) {
                    //Kindle Fire HD 7
                    playerHeightDiv = 80;
                    lastActionStripHeightDiv = 50;
                    playerRackHeightDiv = 68;
                    menuHeightDiv = 80;
                    topMargin = 8;
                    bottomMargin = 8;
                    bottomModalMargin = 15;
                    exchangeModalPadding = 0;
                    bottomModalPadding = 15;
                    rackPadding = 20;
                } else if(docW == 600 && docH == 960) {
                    //Nexus 7
                    playerHeightDiv = 97;
                    lastActionStripHeightDiv = 60;
                    playerRackHeightDiv = 82;
                    menuHeightDiv = 97;
                    // topMargin = 8;
                    // bottomMargin = 8;
                    bottomModalMargin = 15;
                    exchangeModalPadding = -11;
                    bottomModalPadding = 15;
                    rackPadding = 40;
                    padding = 52;
                }
                else if(docW == 768) {
                    // iPad, iPad 2
                    playerHeightDiv = 90;
                    lastActionStripHeightDiv = 55;
                    playerRackHeightDiv = 113;
                    exchangeModalPadding = -24;
                    rackPadding = 68;
                    bottomMargin = 0;
                    padding = 71;
                    menuHeightDiv = 130;
                 }
                 else if(docW == 800 && docH == 1280) {
                     playerHeightDiv = 130;
                     lastActionStripHeightDiv = 80;
                     playerRackHeightDiv = 109;
                     rackPadding = 55;
                     menuHeightDiv = 130;
                 }
                 else if (docW > 800) {
                    rackPadding = 10;
                }

                this.flagDiv.style.marginTop = flagIconMargin + "px";
                this.flagDiv.style.marginLeft = "5px";
                this.tileHelp.style.marginTop = helpIconMargin + "px";
                this.tileHelp.style.marginLeft = "5px";



                var sideMargin = 10;

                var gameBoardContainerHeightDiv = docH - playerHeightDiv - topMargin - lastActionStripHeightDiv - playerRackHeightDiv - bottomMargin - menuHeightDiv;
                var boardSizeInPx = gameBoardContainerHeightDiv;
                var exchangeDivHeight = docH - playerHeightDiv - menuHeightDiv;

                this.showExchangeDiv.style.width = docW + "px";
                this.showExchangeDiv.style.height = (exchangeDivHeight + exchangeModalPadding) + "px";

                this.bottomExchangeDiv.style.width = docW + "px";
                this.bottomExchangeDiv.style.height = (menuHeightDiv + bottomModalPadding) + "px";
                this.bottomExchangeDiv.style.marginTop = (docH - menuHeightDiv - bottomModalMargin) + "px";


                this.exchangeModalContainerDiv.style.width = docW + "px";
                this.exchangeModalContainerDiv.style.height = (gameBoardContainerHeightDiv + menuHeightDiv) - padding + "px";

                this.letterRackHolder.style.width = docW - rackPadding + "px";

                var playerHeightInPx = playerHeightDiv;
                var playerRackHeightInPx = playerRackHeightDiv;
                var menuHeightInPx = menuHeightDiv;

                var menuWidthInPx = playerHeightInPx;
                var nbPlayers = this.controler.playerControlers.length;

                var boardContainerHeightInPx = gameBoardContainerHeightDiv;
                var boardSizeInPx = boardSizeInPx;

                if (boardSizeInPx > docW) {
                    boardSizeInPx = docW - sideMargin;
                }
                var playersWidthInPx = boardSizeInPx;
                var playerWidthInPx = boardSizeInPx / nbPlayers;
                var boardSideMargins = ((docW - sideMargin) - boardSizeInPx) / 2;

                if (boardSideMargins == 0) {
                    boardSideMargins = 5;
                }
                var boardTopMargin = ((gameBoardContainerHeightDiv - boardSizeInPx) / 2);

                //to center the gameboard horizontally
                this.boardDiv.style.marginLeft = boardSideMargins + 'px';
                //this.boardDiv.style.marginRight = boardSideMargins + 'px';

                //to center the gameboard vertically
                this.boardDiv.style.marginTop = boardTopMargin + 'px';

                this.lastActionContainerDiv.style.height = lastActionStripHeightDiv + "px";

                this.boardDivContainer.style.width = docW + "px";
                //this.boardDivContainer.style.height = boardContainerHeightInPx - boardTopMargin + "px";
                this.boardDivContainer.style.height = boardContainerHeightInPx + "px";

                this.boardDiv.style.width = boardSizeInPx + "px";
                this.boardDiv.style.height = boardSizeInPx + "px";

                this.playerRacksDiv.style.width = (docW - 2) + "px";
                this.playerRacksDiv.style.height = (playerRackHeightInPx) + "px";


                this.menuDiv.style.width = docW + "px";
                this.menuDiv.style.height = menuHeightDiv + "px";

                //display border on desktop browser
                if (isMobile == false) {
                    this.screenDiv.style.border = "3px solid #ffffff";
                }

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    //console.log(("DRAWING THE PLAYER COMPONENT...");
                    for (var i = 0; i < this.controler.playerControlers.length; i++) {
                        var playerControler = this.controler.playerControlers[i];
                        playerControler.draw(docW, playerHeightInPx, docW, playerRackHeightInPx);
                    }

                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                var borderPadding = 2;
                var tileCount = 15;

                //displays the board tiles
                var tileSizeInPx = (boardSizeInPx / tileCount) - borderPadding;

                var i = void 0,
                    j = void 0;
                for (i = 0; i < tileCount; i++) {
                    for (j = 0; j < tileCount; j++) {
                        var tileBgDiv = document.getElementById("board_tileBg_" + i + "_" + j);

                        this.drawTileBg(tileSizeInPx, tileBgDiv, i, j);
                        if (this.controler.model.board[i * tileCount + j]) {
                            var tile = this.controler.model.board[i * tileCount + j];
                            var childNode = tileBgDiv.childNodes[0];
                            tileBgDiv.removeChild(childNode);
                            tile.component.draw(tileSizeInPx, tile.component.tileDiv, tileBgDiv);
                            tileBgDiv.appendChild(tile.component.tileDiv);
                        }
                    }
                }

                this.buildSwapTile();

                //display the available tile row
                var letters = letterValues[this.controler.model.getPlayer().lang][this.controler.gameMode];

                var currentDataPos = 0;
                var dataSource = Object.keys(letters).map(function(key) {
                    var data = {
                        "letter": String(key),
                        "n": letters[key].n
                    };
                    return data;
                });

                var bagSize = this.controler.model.getPlayer().bag.length;

                //disable swapping if tile bag is empty
                if(bagSize <= 0) {
                    this.disableSwapTile();
                }
                else {
                    this.enableSwapTile();
                }

                this.tilesCount.innerHTML = bagSize + ' ' + this.controler.appLanguage.tilesLeft;
                while (currentDataPos < dataSource.length) {
                    var currentData = dataSource[currentDataPos++];
                    this.drawAvailableTiles(currentData.letter, 0);
                }

                this.tileBagCountDiv.innerHTML = bagSize;

            }
        }, {
            key: "buildTileBg",
            value: function buildTileBg(tileBg, i, j, id) {
                var tileBgDiv = document.createElement('div');
                tileBgDiv.className = "tileBg";
                tileBgDiv.id = id;
                tileBgDiv.classList.add("tileBg" + tileBg, "boardTileBg", "floatLeft");
                tileBgDiv.x = j;
                tileBgDiv.y = 15 - i;
                tileBgDiv.acceptsDropping = function(el, tileBgDiv, source, sibling) {
                    var isDropAllowed = typeof tileBgDiv.tileId == "undefined" || tileBgDiv.tileId == null;
                    // if(!isDropAllowed) {
                    //     //console.log(('Cannot drop on this tile - ' + ' destination.id: ' + tileBgDiv.id + ' tileId: ' + tileBgDiv.tileId);
                    // }
                    return isDropAllowed;
                };
                tileBgDiv.onDropped = function(tileDiv, tileBdDiv, source, sibling, mousePos) {
                    var tile = tileDiv.component.model;
                    var gameComponent = tileDiv.component.playerControler.gameControler.component;
                    tile.setBoardPosition(tileBdDiv.x, tileBdDiv.y);
                    tileBdDiv.tileId = tile.id;
                    tileDiv.component.playerControler.gameControler.play(false);
                    source.tileId = null;
                    gameControler.component.zoomInGameBoard(mousePos);
                    gameControler.updateMenuButtons();
                };

                tileBgDiv.onOver = function(tileDiv, tileBgDiv, originTileBg) {

                    tileDiv.component.draw(tileBgDiv.clientWidth, tileDiv);
                };
                tileDragula.containers.push(tileBgDiv);
                return tileBgDiv;
            }
        }, {
            key: "drawTileBg",
            value: function drawTileBg(tileSizeInPx, tileBgDiv, i, j) {
                tileBgDiv.style.width = tileSizeInPx + "px";
                tileBgDiv.style.height = tileSizeInPx + "px";
                tileBgDiv.tileSizeInPx = tileSizeInPx;
                return tileBgDiv;
            }
        }, {
            key: "displayTempScore",
            value: function displayTempScore(score) {
                this.tempScoreDiv.innerHTML = score;
                this.tempScoreDiv.style.display = "block";
                var f = function f() {
                    this.tempScoreDiv.style.display = "none";
                };
                setTimeout(f.bind(this), 4000);
            }
        },
        {
            key: "drawDivider",
            value: function drawDivider() {
                var dividerDiv = document.createElement('div');
                dividerDiv.className = "playerDivider";
                this.playerContainerMid.appendChild(dividerDiv);
            }
        },
        {
            key: "displayLastAction",
            value: function displayLastAction(text) {
                var style = window.getComputedStyle(this.lastActionTextDiv, null).getPropertyValue('font-size');
                var fontSize = parseFloat(style);

                //adjust the size if text is long
                if (text.length > 64) {
                    var docW = document.documentElement.clientWidth;

                    if(docW != 768 ) {
                        //this.lastActionTextDiv.style.fontSize = '12px';
                    }
                }

                this.lastActionTextDiv.innerHTML = text;

            }
        },
        {
          key: "saveAction",
          value: function saveAction(word, text, type, source, target, style, rebuild) {
            //get number of turns
            var model = this.controler.model;
            var turnNo = model.movesHistory.length + 1;

            if(type == "word") {
                //build entry
                var wordsPlayed = document.getElementById('wordsPlayedTab');
                var actionDiv = document.createElement('div');
                actionDiv.className = "wordPlayedEntry";
                var generatedText = rebuild ? text : this.controler.appLanguage.turn.toUpperCase() + " " + style.turn + ": " + this.generateActionText(word, style)
                text = generatedText;

                actionDiv.innerHTML = text;
                var component = this;

                actionDiv.addEventListener("click", function(event) {
                    component.getDefinition(word, "test", source, target, false, style);
                  }
                );

                wordsPlayed.insertBefore(actionDiv, wordsPlayed.firstChild);

                component.getDefinition(word, "test", source, target, true, style);

                model.noPoint = 0;
            } else {
              //no point
              var wordsPlayed = document.getElementById('wordsPlayedTab');
              var actionDiv = document.createElement('div');
              actionDiv.className = "wordPlayedEntry";
              var text = rebuild ? text : this.controler.appLanguage.turn.toUpperCase() + " " + turnNo + ": " + text;
              actionDiv.innerHTML = text;
              var component = this;

              wordsPlayed.insertBefore(actionDiv, wordsPlayed.firstChild);
              model.noPoint++;
              if(model.noPoint > 5) {
                //end game
                //console.log(("endgame",model.noPoint);
                this.controler.endGame();
              }
            }

            //add move to moves movesHistory
            //console.log((text);
            model.movesHistory.push({word: word, text: text, type: type, source: source, target: target, style: style});
            model.timeElapsed = dateUtils.getCurrentDateUTC();


            // //console.log(("CALL SAVE STATE");
            // //console.log((model);
            // saveState(model);
          }
        }, {
          key: "generateActionText",
          value: function generateActionText(word, points) {
            var model = this.controler.model;
            var currentPlayerLang = model.getPlayer().lang;
            var nextPlayerLang = model.getNextPlayer().lang;
            var mainStyle = "player-"+model.playerToPlay+"-color";
            var secondaryStyle = model.playerToPlay == 0 ? "player-1-color" : "player-0-color";


            var playedWord = this.controler.appLanguage.played + " <span class='"+mainStyle+"'>" + word.toUpperCase()+ "</span>";

            try {
              if(currentPlayerLang != nextPlayerLang && window.marbbleDic[currentPlayerLang][nextPlayerLang]) {
                var translation = window.marbbleDic[currentPlayerLang][nextPlayerLang][word];
                if(typeof translation != "undefined") {
                    playedWord += " <span class='"+secondaryStyle+"'>(= "+translation+")</span>";
                }
              }
            } catch(e) {
              console.error("unable to add translation to action text");
            }



            if(this.controler.getDoNotAskValue() == true || this.controler.allowInvalidWord == true) {
                playedWord += " <span style='color:#5b5b5b;'>(= " + this.controler.appLanguage.unknown +")</span>";
            }

            //add translation to each horizontal tile
            var lastActionText = model.getPlayer().username + " " + playedWord.toUpperCase() + this.controler.appLanguage.for + " <font color='red'>" + points + "</font> " + this.controler.appLanguage.points;
            var lastActionTextWithoutPoint = model.getPlayer().username + " " + playedWord;
            var style = { main: mainStyle, secondary: secondaryStyle};
            lastActionText = points > 0 ? lastActionText : lastActionTextWithoutPoint;

            return lastActionText;
          }
        }, {
          key: "searchDefinition",
          value: function searchDefinition() {
            //console.log((this.searchInput.value);
          }
        },{
          key: "displayTranslation",
          value: function(text, translation, source, target, style) {
            //console.log("displayTranslation - %s %s %s %s", text, translation, source, target);
            var model = this.controler.model;
            this.wordsPlayedTab.classList.remove("active");

            this.notInDictionarySection.style.display = "none";
            this.wordsDefinitionTable.style.display = "block";
            this.definitionsSection.style.display = "block";


            this.wordDefinitionSource.innerHTML = text.toUpperCase();
            this.wordDefinitionSource.classList.add(style.main);
            this.wordDefinitionSource.classList.remove(style.secondary);

            this.wordDefinitionTarget.innerHTML = translation.toUpperCase();
            this.wordDefinitionTarget.classList.remove(style.main);
            this.wordDefinitionTarget.classList.add(style.secondary);

            this.changeFlag(source, target, text, translation, style);
            this.wordsDefinitionTable.style.display = 'table';
            this.translationRow.style.display = 'table-row';
            this.wordDefinitionFlags.style.display = 'table-row';
            if(model.type == 0) {
                fetchWiktionary(translation, target, style.secondary, model.type);
            }
          }
        }, {
          key: "displayNoDefinition",
          value: function(word, source, target) {
            //console.log(("no translation");
            this.showMessage.bind("no translation available for '"+word+"'");
            try {
              document.getElementById("noDefLabel").remove();
            } catch(e) {
              //deflabel
            }
            // this.translationRow.style.display = 'none';
            // this.wordsDefinitionTable.style.display = 'none';
            // this.wordDefinitionFlags.style.display = 'none';
            var noDefLabel = document.createElement('h3');
            noDefLabel.style.textAlign = 'center';
            noDefLabel.id = "noDefLabel";
            // noDefLabel.innerHTML = '<a target="_blank" href="https://translate.google.com/#'+source+'/'+target+'/'+word+'">Click here to see more definitions and translations</a>';

            noDefLabel.innerHTML = '<a target="_blank" href="https://'+source+'.wiktionary.org/wiki/'+word+'">Click here to see definition</a>';
            document.getElementById("definitionsSection").appendChild(noDefLabel);
          }
        }, {
          key: "getDefinition",
          value: function getDefinition(text, type, source, target, isHide, style) {
            //console.log("getDefinition(%s,%s,%s,%s)",text,type,source,target);
            var translation;
            var model = this.controler.model;
            this.wordDefinitionSpacer.style.display = 'block';
            this.wordDefinitionTarget.style.display = 'block';
            var noDefLabel = document.getElementById("noDefLabel");


            if(noDefLabel) {
                noDefLabel.remove();
            }

            if(source != target) {
              translation = window.marbbleDic[source][target][text];
              this.fetchDefinition(text, source, target);
            } else if (source == target) {
              this.wordDefinitionSpacer.style.display = 'none';
              this.wordDefinitionTarget.style.display = 'none';
              // this.fetchDefinition(text, source, target);
              //console.log((model.type)
              fetchWiktionary(text, source, style.main, model.type);
            }
            if(translation) {
              this.displayTranslation(text, translation, source, target, style);
            } else {
                //fetchWiktionary(text, source, style.main, model.type);
              //fetch translation
              //Commented this out as this causes a problem in safari
              /*this.fetchTranslation(text, source, target);
              this.displayNoDefinition(text, source, target);*/
              if(this.controler.gameMode == "MarbbleOpen") {
                  this.wordNotInDictionary(text, source, style.main, model.type);
              }


            }
            if(!isHide) {
                this.toggleWordsModal("definition");
            }
          }
        }, {
          key: "fetchTranslation",
          value: function fetchTranslation(word, source, target) {
            var component = this;
            var request = new Request(
                'http://localhost:8080/marbble/translation/'+word+'/'+source+'/'+target,
                {
                  'method': 'GET',
                  'Content-Type': 'application/json'
                });
            fetch(request).then(function(response) {
              return response.json();
            }).then(function(data) {
              for(var i=0;i<data.length;i++) {
                //console.log((data);
                  component.displayTranslation(word, data[i].targetWord, source, target);
              }
            });
          }
        }, {
          key: "fetchDefinition",
          value: function fetchDefinition(word, source, target) {
          //   var component = this;
          //   document.getElementById("definitionsSection").innerHTML = "";
          //   var myRequest = new Request(
          //       'http://localhost:8080/marbble/word/definition/'+word+'/'+target,
          //       {
          //            'method': 'GET',
          //            'Content-Type': 'application/json'
          //       });
          //   fetch(myRequest).then(function(response) {
          //     return response.json();
          //   }).then(function(data) {
          //     //console.log((data);
          //     for (var i = 0, len = data.length; i < len; i++) {
          //       //console.log((data[i].definition);
          //       var definition = document.createElement('div')
          //       definition.className = "definition";
          //       if(definition!="") {
          //           definition.innerHTML = i+1 + ". " +data[i].definition;
          //       }
          //
          //       if(data.length < 1) {
          //         //console.log(("NONE");
          //         var noDefLabel = document.createElement('h3');
          //         noDefLabel.innerHTML = 'No Definition Available';
          //         document.getElementById("definitionsSection").appendChild(noDefLabel);
          //       }
          //       //console.log((definition);
          //       document.getElementById("definitionsSection").appendChild(definition);
          //       // component.displayNoDefinition(word, source, target);
          //     }
          //   }).catch(function(e) {
          //     // component.displayNoDefinition(word, source, target);
          //   });
          }
        }, {
          key: "changeFlag",
          value: function changeFlag(source, target, sourceWord, targetWord, style) {
            ////console.log(("change");
            this.wordDefinitionFlags.innerHTML = '';

            //prepare row
            var sourceTd = document.createElement('td');
            var spacerTd = document.createElement('td');
            var targetTd = document.createElement('td');
            this.wordDefinitionFlags.appendChild(sourceTd);
            this.wordDefinitionFlags.appendChild(spacerTd);
            this.wordDefinitionFlags.appendChild(targetTd);

            var sourceFlag = document.createElement('a');
            // sourceFlag.href = 'https://'+source+'.wiktionary.org/wiki/'+sourceWord;
            sourceFlag.onclick = function() { fetchWiktionary(sourceWord, source, style.main, gameControler.model.type); };
            sourceFlag.target = "_blank";
            sourceFlag.className = 'flag-origin';
            sourceFlag.classList.add(style.main);
            sourceFlag.classList.remove(style.secondary);
            var sourceImg = document.createElement('img');
            sourceFlag.appendChild(sourceImg);
            sourceImg.src = 'img/flags/' + source + '.png';
            // sourceFlag.innerHTML += LANG[source];
            checkWiktionary(sourceWord, source, style, gameControler.model.type, sourceFlag);
            // sourceFlag.addEventListener('click', function(e) {
            //     gameControler.component.openLinkFromMobile(sourceFlag.href);
            // });

            var targetFlag = document.createElement('a');
            // targetFlag.href = 'https://'+target+'.wiktionary.org/wiki/'+targetWord;
            targetFlag.onclick = function() { fetchWiktionary(targetWord, target, style.secondary, gameControler.model.type); };
            targetFlag.target = "_blank";
            targetFlag.className = 'flag-target';
            targetFlag.classList.remove(style.main);
            targetFlag.classList.add(style.secondary);
            var targetImg = document.createElement('img');
            targetImg.src = 'img/flags/' + target + '.png';
            targetFlag.appendChild(targetImg);
            // targetFlag.innerHTML += LANG[target];
            checkWiktionary(targetWord, target, style, gameControler.model.type, targetFlag);
            // targetFlag.addEventListener('click', function(e) {
            //     gameControler.component.openLinkFromMobile(targetFlag.href);
            // });

            sourceTd.appendChild(sourceFlag);
            targetTd.appendChild(targetFlag);
          }
        }, {
            key: "resizeImage",
            value: function resizeImage(divId, newHeight) {
                if (!divId) {
                    //divId missing
                    return;
                }

                var div = document.getElementById(divId);
                var divWidth = div.clientWidth;
                var divHeight = div.clientHeight;

                var newWidth = Math.round((divWidth / divHeight) * newHeight);

                div.style.width = newWidth + "px";
                div.style.height = newHeight + "px";

            }
        }, {
            key: "zoomInGameBoard",
            value: function zoomInGameBoard(mousePos) {
                if (typeof mousePos == 'undefined') {
                    mousePos = null;
                }

                if (mousePos !== null) {
                    if (this.zoomActive !== true) {
                        var mPosX = mousePos.x;
                        var mPosY = mousePos.y;
                        var boardPosX = 0;
                        var boardPosY = 0;
                        var zoom = 2;

                        var obj = this.boardDiv;

                        //get parent element position in document
                        if (obj.offsetParent) {
                            do {
                                boardPosX += obj.offsetLeft;
                                boardPosY += obj.offsetTop;
                            } while (obj = obj.offsetParent);
                        }

                        //this is the position of the tile relative to the board
                        var newXPos = mPosX - boardPosX;
                        var newYPos = mPosY - boardPosY;

                        var boardSizeHalf = this.boardDiv.clientWidth / 2;

                        var leftRightPadding = newXPos > boardSizeHalf ? -10 : 10;
                        var topBottomPadding = newYPos > boardSizeHalf ? -10 : 10;

                        var cx = (boardSizeHalf - newXPos) + leftRightPadding;
                        var cy = (boardSizeHalf - newYPos) + topBottomPadding;

                        this.moveX = cx;
                        this.moveY = cy;

                        this.lastX = cx;
                        this.lastY = cy;

                        this.zoomXCenter = cx;
                        this.zoomYCenter = cy;

                        this.zoomActive = true;

                        var translate = 'translate(' + cx + 'px, ' + cy + 'px) ' + 'scale(' + zoom + ')';
                        var transition = 'all .3s ease-out';



                        //for desktop and browser
                        this.boardDiv.style.setProperty('transform', translate);
                        this.boardDiv.style.setProperty('transition', transition);
                        // use -webkit for android
                        this.boardDiv.style.setProperty('-webkit-transition', transition);
                        this.boardDiv.style.setProperty('-webkit-transform', translate);

                    }
                } else {
                    if (this.zoomActive !== true) {

                        var scaleX = 0;
                        var scaleY = 0;
                        var zoom = 2;

                        this.zoomXCenter = scaleX;
                        this.zoomYCenter = scaleY;

                        this.zoomActive = true;

                        //test for zoom in center
                        var translate = 'translate(' + scaleX + 'px, ' + scaleY + 'px) ' + 'scale(' + zoom + ')';
                        var transition = 'all .3s ease-out';

                        //for desktop and browser
                        this.boardDiv.style.setProperty('transform', translate);
                        this.boardDiv.style.setProperty('transition', transition);
                        // use -webkit for android
                        this.boardDiv.style.setProperty('-webkit-transition', transition);
                        this.boardDiv.style.setProperty('-webkit-transform', translate);
                    }
                }

            }
        },
        {
            key: "zoomOutGameBoard",
            value: function zoomOutGameBoard(e) {
                if (this.zoomActive !== false) {
                    this.zoomActive = false;

                    //reset the xy position
                    var xPos = 0;
                    var yPos = 0;
                    //reset the zoom
                    var zoom = 1;

                    this.lastX = 0;
                    this.lastY = 0;

                    this.moveX = 0;
                    this.moveY = 0;

                    var translate = 'translate(' + xPos + 'px, ' + yPos + 'px) ' + 'scale(' + zoom + ')';
                    var transition = 'all .3s ease-out';

                    var docW = document.documentElement.clientWidth;

                    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && docW > 1024) {
                        docW = 360;
                    }


                    var parentHeight = this.boardDivContainer.clientHeight;
                    var boardSizeInPx = this.boardDiv.clientWidth;

                    var sideMargin = 10;

                    var boardSideMargins = ((docW - sideMargin) - boardSizeInPx) / 2;

                    if (boardSideMargins == 0) {
                        boardSideMargins = 5;
                    }

                    var boardTopMargin = ((parentHeight - boardSizeInPx) / 2);

                    //to center the gameboard horizontally
                    this.boardDiv.style.marginLeft = boardSideMargins + 'px';

                    //to center the gameboard vertically
                    this.boardDiv.style.marginTop = boardTopMargin + 'px';

                    //for desktop browser and ios
                    this.boardDiv.style.setProperty('transform', translate);
                    this.boardDiv.style.setProperty('transition', transition);
                    //use -webkit for android
                    this.boardDiv.style.setProperty('-webkit-transition', transition);
                    this.boardDiv.style.setProperty('-webkit-transform', translate);

                }
            }
        },
        {
            key: "zoom",
            value: function zoom(e) {
                //double tap zooms in on the board location if not zoomed in. If zoomed in, double tap zooms out
                if (e && e.pointers) {
                    if (e.pointers.length > 0) {
                        //get the x and y coordinates of the doubletap for zooming
                        var mousePos = {
                            x: e.center.x,
                            y: e.center.y
                        };

                        if (this.zoomActive === false) {
                            this.zoomInGameBoard(mousePos);
                        } else {
                            this.zoomOutGameBoard();
                        }
                    }
                }
            }
        },
        {
            key: "boardActions",
            value: function boardActions(e) {

                if (e.type === 'doubletap') {
                    //double tap zooms in on the board location if not zoomed in. If zoomed in, double tap zooms out
                    this.zoom(e);
                } else if (e.type == 'panleft' || e.type == 'panright' || e.type == 'panup' || e.type == 'pandown') {
                    if (this.zoomActive === true) {
                        this.panBoard(e);
                    }
                } else if (e.type == 'panend') {
                    //update the last xy position of the cursor when panning
                    this.updateLastPos(e);
                } else if (e.type == 'pinchin') {
                    this.zoomOutGameBoard();
                } else if (e.type == 'pinchout') {
                    //zoom in to the pinch center
                    var mousePos = {
                        x: e.center.x,
                        y: e.center.y
                    };
                    this.zoomInGameBoard(mousePos);
                }
            }
        },
        {
            key: "panBoard",
            value: function panBoard(e) {

                var deltaX = e.deltaX;
                var deltaY = e.deltaY;
                var direction = e.direction;
                var zoom = 2;

                var boardSize = this.boardDiv.clientWidth;

                if (this.controler.getPanning() == true) {
                    //board pan
                    var newX = this.restrictXPos(deltaX, boardSize, direction);

                    var newY = this.restrictYPos(deltaY, boardSize, direction);

                    var translate = 'translate(' + newX + 'px, ' + newY + 'px) ' + 'scale(' + zoom + ')';
                    var transition = 'all .3s ease-out';

                    this.moveX = newX;
                    this.moveY = newY;

                    //for desktop and browser
                    this.boardDiv.style.setProperty('transform', translate);
                    this.boardDiv.style.setProperty('transition', transition);
                    // use -webkit for android
                    this.boardDiv.style.setProperty('-webkit-transition', transition);
                    this.boardDiv.style.setProperty('-webkit-transform', translate);
                }

            }
        },
        {
            key: "updateMenuButtons",
            value: function updateMenuButtons(isTilePlayed) {

                if (isTilePlayed) {
                    //hide shuffle button and replace with recall button
                    this.shuffleDiv.style.display = "none";
                    this.gatherTilesDiv.style.display = "inline-block";

                    //hide pass div and replace with play button
                    this.passDiv.style.display = "none";
                    this.playDiv.style.display = "inline-block";
                } else {
                    this.gatherTilesDiv.style.display = "none";
                    this.shuffleDiv.style.display = "inline-block";

                    //hide play div and replace with pass button
                    this.playDiv.style.display = "none";
                    this.passDiv.style.display = "inline-block";
                }
            }
        }, {
            key: "showScoreBubble",
            value: function showScoreBubble(div, isTempScore, score) {
                if (div) {
                    var bgColor = isTempScore == true ? 'blueCircle' : 'redCircle';
                    div.classList.remove('blueCircle', 'redCircle');
                    div.classList.add(bgColor);
                    div.style.display = "block";
                    div.textContent = score;
                }
            }
        }, {
            key: "hideScoreBubble",
            value: function hideScoreBubble(div) {
                if (div) {
                    div.style.display = "none";
                }
            }
        }, {
            key: "showNextTurnDialog",
            value: function showNextTurnDialog(name) {

                var isVsComputer = false;
                for(var i=0; i<this.controler.model.players.length;i++) {
                    if(this.controler.model.players[i].isComputer == true || this.controler.model.players[i].isComputer == "true") {
                        isVsComputer = true;
                        break;
                    }

                }

                if(isVsComputer == true) {
                    return;
                }
                var nextTurnMsg = this.controler.appLanguage.passDeviceTo + " " + name;

                /*
                if(this.controler.model.online) {
                  if(this.controler.model.playerToPlay == 0) {
                    document.querySelector("#playerRack_1").style.display = "block";
                    document.querySelector("#playerRack_0").style.display = "none";
                    if(this.controler.model.challenger) {
                      this.enableTurnButtons();
                    } else {
                      this.disableTurnButtons();
                    }
                  } else {
                    if(!this.controler.model.challenger) {
                      this.enableTurnButtons();
                    } else {
                      this.disableTurnButtons();
                    }
                  }
                  return;
              }*/


                _windowOpened = 'nextTurnPopup';

                this.nextTurnDiv.style.display = "block";

                this.messageTurnPass.innerHTML = this.controler.appLanguage.passDeviceTo + " " + name;

                var hideDiv = document.getElementById('hideDiv_' + this.controler.model.getPlayer().idx);
                hideDiv.style.display = "block";
            }
        }, {
          key: "enableTurnButtons",
          value: function enableTurnButtons() {
            removeClass(document.getElementById("playButton"), "tint");
            this.playDiv.addEventListener("click", this.controler.playForGood.bind(this.controler), true);
            removeClass(document.getElementById("passButton"), "tint");
            this.passDiv.addEventListener("click", this.controler.pass.bind(this.controler), true);
            removeClass(document.getElementById("swapButton"), "tint");
            removeClass(document.getElementById("shuffleButton"), "tint");
          }
        }, {
          key: "disableTurnButtons",
          value: function disableTurnButtons() {
            document.querySelector("#playerRack_0").style.display = "block";
            document.querySelector("#playerRack_1").style.display = "none";
            addClass(document.getElementById("playButton"), "tint");
            this.playDiv.removeEventListener("click", this.controler.playForGood.bind(this.controler), true);
            addClass(document.getElementById("passButton"), "tint");
            this.passDiv.removeEventListener("click", this.controler.pass.bind(this.controler), true);
            addClass(document.getElementById("swapButton"), "tint");
            addClass(document.getElementById("shuffleButton"), "tint");
          }
        },{
            key: "hideNextTurnDialog",
            value: function hideNextTurnDialog() {
                _windowOpened = 'gameScreenWindow';
                this.nextTurnDiv.style.display = "none";
                var hideDiv = document.getElementById('hideDiv_' + this.controler.model.getPlayer().idx);
                hideDiv.style.display = "none";
            }
        },
        {
            key: "showMessage",
            value: function showMessage(message) {
                if (message) {
                    _windowOpened = 'gamePopupWindow';

                    this.buttonContainerDiv.style.display = "none";
                    this.gameOverModalContainerDiv.style.display = "none";
                    this.showModalContentDiv.style.display = "block";
                    this.showModalSpan.style.display = "block";
                    this.showModalDiv.style.display = "block";
                    this.showModalParagraphText.innerHTML = message;

                    //this opens the tipeeeLink url
                    var tipeeeLinkButton = document.getElementById('tipeeeLink');

                    if(tipeeeLinkButton) {
                        this.showModalParagraphText.addEventListener('click', this.openTipeeeLinkFromMobile);
                    }

                    //play sound
                    sound.openPopupInGame();
                }
            }
        }, {
            key: "hideDialog",
            value: function hideDialog() {
                _windowOpened = 'gameScreenWindow';

                this.showModalDiv.style.display = "none";
                this.showModalContentDiv.classList.remove('blank-tile-container');

                this.showModalParagraphText.innerHTML = "";
                this.showModalParagraphText.removeEventListener('click', this.openTipeeeLinkFromMobile);

                //play sound
                sound.openPopupInGame();
            }
        }, {
            key: "showConfirmation",
            value: function showConfirmation(message, type) {
                if (type == 'undefined') {
                    type = 'success';
                }
                if (message) {
                    _windowOpened = 'gamePopupWindow';

                    this.showModalSpan.style.display = "none";
                    this.gameOverModalContainerDiv.style.display = "none";
                    this.showModalDiv.style.display = "block";
                    this.showModalContentDiv.style.display = "block";
                    this.buttonContainerDiv.style.display = "block";
                    this.showModalParagraphText.innerHTML = message;

                    if (type == 'pass') {
                        this.leaveModalDivContainer.style.display = 'none';
                        this.successModalDivContainer.style.display = 'none';
                        this.backToMainDivContainer.style.display = 'none';
                        this.passModalDivContainer.style.display = "block";
                    } else if (type == 'leave') {
                        this.passModalDivContainer.style.display = "none";
                        this.successModalDivContainer.style.display = 'none';
                        this.backToMainDivContainer.style.display = 'none';
                        this.leaveModalDivContainer.style.display = 'block';

                    } else if (type == 'success') {
                        this.passModalDivContainer.style.display = "none";
                        this.leaveModalDivContainer.style.display = 'none';
                        this.backToMainDivContainer.style.display = 'none';
                        this.successModalDivContainer.style.display = 'block';
                    } else if (type == 'backToMain') {
                        this.passModalDivContainer.style.display = "none";
                        this.leaveModalDivContainer.style.display = 'none';
                        this.successModalDivContainer.style.display = 'none';
                        this.backToMainDivContainer.style.display = 'block';
                    } else if (type == 'displayTranslation') {
                      this.showModalParagraphText.innerHTML = "See translation for '"+message.word.toUpperCase()+"'?";
                      this.leaveModalDivContainer.style.display = 'none';
                      this.successModalDivContainer.style.display = 'none';
                      this.backToMainDivContainer.style.display = 'none';
                      this.passModalDivContainer.style.display = "none";

                      //translation confirm container div
                      var viewTranslationConfirmContainer = document.createElement('div');
                      viewTranslationConfirmContainer.id = 'viewTranslationConfirmContainer';
                      viewTranslationConfirmContainer.className = 'viewTranslationConfirmContainer';
                      viewTranslationConfirmContainer.style.overflow = 'auto';

                      //translation confirm  cancel button
                      var modalCancelButton = document.createElement('button');
                      modalCancelButton.innerHTML = this.controler.appLanguage.cancel;
                      modalCancelButton.id = 'cancelButton';
                      modalCancelButton.className = 'cancelButton';
                      modalCancelButton.classList.add('floatLeft');
                      modalCancelButton.addEventListener('click', this.hideDialog.bind(this));

                      //append the cancel button to the translation confirm
                      viewTranslationConfirmContainer.appendChild(modalCancelButton);

                      //translation confirm  ok button
                      var passOkButton = document.createElement('button');
                      passOkButton.innerHTML = this.controler.appLanguage.ok;
                      passOkButton.id = 'passOkButton';
                      passOkButton.className = 'okButton';
                      passOkButton.classList.add('floatRight');
                      var component = this;
                      passOkButton.addEventListener('click', function() { component.showTranslationConfirm(message); }, true);
                      //append the pass ok button to the translation confirm
                      viewTranslationConfirmContainer.appendChild(passOkButton);
                      viewTranslationConfirmContainer.style.display = 'block';
                      //append the viewTranslationConfirmContainer to the translation confirm
                      this.buttonContainerDiv.appendChild(viewTranslationConfirmContainer);
                    }

                    //play sound
                    sound.openPopupInGame();
                }
            }
        }, {
          key: "showTranslationConfirm",
          value: function showTranslationConfirm(message) {
            this.hideDialog();
            this.getDefinition(message.word, "translation", message.lang, message.targetLang);
            this.toggleWordsModal("played");
            this.wordModal.classList.add("active");
            this.toggleWordsModal("definition");
            this.wordsDiv.classList.add("active");
            document.getElementById("viewTranslationConfirmContainer").remove();
          }
        }, {
            key: "showBlankTileSelect",
            value: function showBlankTileSelect(letters, tileEl, tileComponent) {
                letters = letters[tileComponent.firstChild.component.playerControler.gameControler.gameMode];
                var modal = this.showModalContentDiv;
                var modalMessage = this.showModalDiv;

                modal.classList.add('blank-tile-container');

                _windowOpened = 'blankTilePopup';

                this.showModalSpan.style.display = "none";
                this.gameOverModalContainerDiv.style.display = "none";
                this.buttonContainerDiv.style.display = "none";
                this.showModalDiv.style.display = "block";
                this.showModalContentDiv.style.display = "block";
                this.leaveModalDivContainer.style.display = "none";
                this.showModalSpan.style.display = "block";

                //generate tiles here
                var keys = Object.keys(letters);
                var tileDivContainer = document.createElement('div');
                tileDivContainer.className = "clear";
                this.showModalParagraphText.innerHTML = "";
                this.showModalParagraphText.appendChild(tileDivContainer);
                this.passModalDivContainer.style.display = "none";
                this.successModalDivContainer.style.display = 'none';
                for (var k in keys) {
                    var key = keys[k].toUpperCase();
                    if (key != "") {
                        var tileDiv = document.createElement('div');
                        var tileContainer = document.createElement('div');
                        tileContainer.className = 'tileSelectContainer'
                        var textGroupContainer = document.createElement('div');
                        tileDiv.appendChild.textGroupContainer;
                        var tileTextContainer = document.createElement('div');
                        tileDiv.innerHTML = keys[k].toUpperCase();
                        tileDiv.className = 'tile blank-tile-select';
                        tileContainer.appendChild(tileDiv)
                        tileDivContainer.appendChild(tileContainer);
                    }
                }
                var classname = document.getElementsByClassName("blank-tile-select");
                Array.from(classname).forEach(function(element) {
                    element.addEventListener('click',
                        function() {
                            tileEl.letter = this.innerHTML.toLowerCase();
                            tileComponent.firstChild.component.model.letter = this.innerHTML.toLowerCase();
                            //unchanged element letter that has already been dropped
                            tileEl.textElement.textContent = this.innerHTML;
                            this.hideDialog;
                            modal.style.display = "none";
                            modalMessage.style.display = "none";
                            modal.classList.remove('blank-tile-container');
                            _windowOpened = 'gameScreenWindow';
                        }
                    );
                });

                //play sound
                sound.openPopupInGame();
            }
        }, {
            key: "showGameOver",
            value: function showGameOver(players) {
                _windowOpened = 'gameOverPopup';

                this.showModalContentDiv.style.display = "none";
                this.gameOverModalContainerDiv.style.display = "block";
                this.showModalDiv.style.display = "block";
                var gameOverStatusText = "";
                var rematchMessageText = this.controler.appLanguage.doYouWantToPlayAgain;

                var player1 = null;
                var player2 = null;

                if(players && players.length > 1) {
                    player1 = players[0].model;
                    player2 = players[1].model;
                }

                this.player1Name.innerHTML = player1.username;
                this.player1Score.innerHTML = player1.score;
                this.player2Name.innerHTML = player2.username;
                this.player2Score.innerHTML = player2.score;

                var isComputer = ((player1.isComputer == "true" || player1.isComputer == true) || (player2.isComputer == "true" || player2.isComputer == true)) ? true : false;


                if (player1.score > player2.score && this.controler.isPlayerResigned == false) {
                    if(isComputer == true) {
                        gameOverStatusText = this.controler.appLanguage.youWon;
                    }
                    else {
                        gameOverStatusText = player1.username + " " + this.controler.appLanguage.won;
                    }
                    this.player1Trophy.classList.add('winner');
                    sound.gameWon();

                } else if (player1.score < player2.score && this.controler.isPlayerResigned == false) {
                    if(isComputer == true) {
                        gameOverStatusText = this.controler.appLanguage.youLost;
                        sound.gameLost();
                    }
                    else {
                        gameOverStatusText = player2.username + " " + this.controler.appLanguage.won;
                        sound.gameWon();
                    }

                    this.player2Trophy.classList.add('winner');
                }
                else if(player1.score == player2.score && this.controler.isPlayerResigned == false){
                    gameOverStatusText = this.controler.appLanguage.tie.toUpperCase();
                    this.drawTrophy.classList.add('show');
                    sound.gameDraw();
                }
                else if(this.controler.isPlayerResigned == true) {

                    if(this.controler.model.getPlayer().username == player1.username) {
                        //player 1 quit
                        gameOverStatusText = player2.username + " " + this.controler.appLanguage.won;
                        this.player1Trophy.classList.add('resignFlag');
                        this.player2Trophy.classList.add('winner');
                        if(isComputer == true) {
                            sound.gameLost();
                        }
                        else {
                            sound.gameWon();
                        }
                    }
                    else {
                        //player 2 quit
                        gameOverStatusText = player1.username + " " + this.controler.appLanguage.won;
                        this.player1Trophy.classList.add('winner');
                        this.player2Trophy.classList.add('resignFlag');
                        sound.gameWon();
                    }


                }

                if(isComputer == true) {
                    rematchMessageText = this.controler.appLanguage.challenge + " " + player2.username + " " + this.controler.appLanguage.again;
                }

                this.rematchMessageText.nodeValue = rematchMessageText;
                this.gameOverStatusText.nodeValue = gameOverStatusText.toUpperCase();

            }
        }, {
            key: "buildSwapTile",
            value: function buildSwapTile() {
              document.getElementById("availableTilesContainer").innerHTML = ""; //reset - tiles change per player
              //display the available tile row

              var letters = letterValues[this.controler.model.getPlayer().lang][this.controler.model.gameMode];

              var currentDataPos = 0;
              var dataSource = Object.keys(letters).map(function(key) {
                  var data = {
                      "letter": String(key),
                      "n": letters[key].n
                  };
                  return data;
              });
              var j = 0;

              while (currentDataPos < dataSource.length) {
                  var tileRowDiv = document.createElement('div');
                  tileRowDiv.id = "availableTileRow_" + j;
                  tileRowDiv.className = "tileExchangeRow";
                  this.availableTilesContainer.appendChild(tileRowDiv);

                  for (var i = 0; i < 5; i++) {
                      var currentData = dataSource[currentDataPos++];
                      if (currentData) {
                          var letterContainerDiv = this.buildAvailableTiles(currentData.letter, currentData.n);
                          tileRowDiv.appendChild(letterContainerDiv);
                      } else {
                          break;
                      }
                  }
                  j++;
              }


              this.flagDiv.style.backgroundImage = "url(img/opponent_info/"+this.controler.model.getPlayer().lang+"_flag.png)";
            }
        }, {
            key: "showSwapTile",
            value: function showSwapTile() {

                _windowOpened = 'exchangeTileWindow';

                this.showModalDiv.style.display = "none";
                this.showExchangeDiv.style.display = "block";
                this.bottomExchangeDiv.style.display = "block";

                this.swapTilesDiv.classList.add("active");

                //play sound
                sound.openPopupInGame();
            }
        }, {
            key: "hideSwapTile",
            value: function hideSwapTile() {
                _windowOpened = 'gameScreenWindow';

                this.isMenuEnabled = true;
                this.showExchangeDiv.style.display = "none";
                this.bottomExchangeDiv.style.display = "none";

                this.swapTilesDiv.classList.remove("active");

                //play sound
                sound.openPopupInGame();
            }
        }, {
            key: "getMenuEnabled",
            value: function getMenuEnabled() {
                return this.isMenuEnabled;
            }
        }, {
            key: "buildSwapTileRack",
            value: function buildSwapTileRack(id) {
                var tileBgDiv = document.createElement('div');
                tileBgDiv.className = "swapTileBg";
                tileBgDiv.id = id;
                tileBgDiv.classList.add("floatLeft");

                tileBgDiv.acceptsDropping = function(el, tileBgDiv, source, sibling) {
                    var isDropAllowed = typeof tileBgDiv.tileId == "undefined" || tileBgDiv.tileId == null;
                    return isDropAllowed;
                };
                tileBgDiv.onDropped = function(tileDiv, tileBdDiv, source, sibling, mousePos) {
                    var tileComponent = tileDiv.component;
                    var tile = tileComponent.model;
                    var player = tileComponent.playerControler.model;
                    tile.setSwapRackIdx(tileBdDiv.swapRackIdx);
                    tileBdDiv.tileId = tile.id;
                    source.tileId = null;

                    if (!tileComponent.isToSwap) {
                        tileComponent.toggleSwap();
                    }

                };

                tileBgDiv.onOver = function(tileDiv, tileBgDiv, originTileBg) {
                    tileDiv.component.draw(tileBgDiv.clientWidth, tileDiv);
                };
                tileDragula.containers.push(tileBgDiv);
                return tileBgDiv;
            }
        }, {
            key: "buildAvailableTiles",
            value: function buildAvailableTiles(letter, letterCount) {
                var tileExchangeContainer = document.createElement('div');
                tileExchangeContainer.id = 'available_letter_' + letter;
                tileExchangeContainer.className = 'tileExchangeContainer';

                var letterContainerDiv = document.createElement('div');
                letterContainerDiv.className = 'letterExchangeDiv';
                tileExchangeContainer.appendChild(letterContainerDiv);

                var tileDiv = document.createElement('div');
                tileDiv.className = 'tile';
                tileDiv.classList.add('tileLetterSize');
                letterContainerDiv.appendChild(tileDiv);

                var textGroupContainerDiv = document.createElement('div');
                textGroupContainerDiv.className = "tileElementContainer";
                tileDiv.appendChild(textGroupContainerDiv);

                var tileTextContainer = document.createElement('div');
                tileTextContainer.id = 'letter_' + letter;
                tileTextContainer.className = 'tileBagTextContainer';
                tileTextContainer.innerHTML = letter.toUpperCase();
                // tileTextContainer.innerHTML = "-";
                textGroupContainerDiv.appendChild(tileTextContainer);

                var letterCountExchangeDiv = document.createElement('div');
                letterCountExchangeDiv.className = 'letterCountExchangeDiv';
                tileExchangeContainer.appendChild(letterCountExchangeDiv);

                var letterCountDiv = document.createElement('div');
                letterCountDiv.id = 'letterCount_' + letter;
                letterCountDiv.className = "letterCount";
                letterCountDiv.innerHTML = letterCount;
                // letterCountDiv.innerHTML = '0';
                letterCountExchangeDiv.appendChild(letterCountDiv);

                return tileExchangeContainer;

            }
        }, {
            key: "drawAvailableTiles",
            value: function drawAvailableTiles(letter, count) {
                var availableLetterDiv = document.getElementById("letter_" + letter);
                var letterCountDiv = document.getElementById("letterCount_" + letter);
                if (availableLetterDiv) {
                    availableLetterDiv.innerHTML = letter.toUpperCase();
                }
                if (letterCountDiv) {
                    letterCountDiv.innerHTML = count;
                }


            }
        }, {
            key: "updateRemainingTileCount",
            value: function updateRemainingTileCount(letter, count) {

                var letterCountDiv = document.getElementById("letterCount_" + letter);
                if (letterCountDiv) {
                    letterCountDiv.innerHTML = count;
                }
            }
        }, {
            key: "enableGestures",
            value: function enableGestures(el) {

                var options = {
                    preventDefault: true,
                    multiUser: true
                };
                 var mc = new Hammer(el, options);
                //enables the pan event
                mc.get('pan').set({
                    direction: Hammer.DIRECTION_ALL
                });

                if(el.id == 'mbb_board') {
                    //enables the pinch event
                    mc.get('pinch').set({
                        enable: true
                    });
                    //enables gestures for the board
                    mc.on('doubletap panleft panright panup pandown panend pinchin pinchout', this.boardActions.bind(this));
                }

                //disables the scrolling
                mc.on("dragup dragdown swipeup swipedown", function(ev){ });
            }
        }, {
          key: "openWordsModal",
          value: function openWordsModal(open) {
            ////console.log(("OPEN");
            if(open) {
              ////console.log(("open")
              _windowOpened = 'wordsPlayedPopup';

              this.wordModal.classList.add("active");
              this.toggleWordsModal("played");
              this.wordsDiv.classList.add("active");
            } else {
              _windowOpened = 'gameScreenWindow';

              this.wordModal.classList.remove("active");
            }

            //play sound
            sound.openPopupInGame();
          }
        }, {
          key: "toggleWordsModal",
          value: function toggleWordsModal(tab) {
            if(tab == "played") {
              this.playedButton.classList.add("active");
              this.definitionButton.classList.remove("active");
              this.wordsPlayedTab.classList.add("active");
              this.wordsDefinitionTab.classList.remove("active");
            } else {
              this.playedButton.classList.remove("active");
              this.definitionButton.classList.add("active");
              this.wordsPlayedTab.classList.remove("active");
              this.wordsDefinitionTab.classList.add("active");
            }
          }
      },  {
          key: "updateLastPos",
          value: function updateLastPos(e) {
              this.lastX = this.moveX;
              this.lastY = this.moveY;
              var direction = e.direction;

              var boardDivSize = this.boardDiv.clientWidth;
              var boardSizeHalf = Math.ceil(boardDivSize / 2) + 10;

              if(this.moveX <= -boardSizeHalf) {
                  this.lastX = -boardSizeHalf;
              }
              else if(this.moveX >= boardSizeHalf) {
                  this.lastX = boardSizeHalf;
              }

              if(this.moveY <= -boardSizeHalf) {
                  this.lastY = -boardSizeHalf;
              }
              else if(this.moveY >= boardSizeHalf) {
                  this.lastY = boardSizeHalf;
              }

          }
      }, {
          key: "restrictXPos",
          value: function restrictXPos(deltaX, boardDim, direction) {

              var boardSizeHalf = Math.ceil(boardDim / 2) + 10;

              var pos = Math.ceil(this.lastX + deltaX);

              if(pos <= -boardSizeHalf) {
                  pos = -boardSizeHalf;
              }
              else if(pos >= boardSizeHalf) {
                  pos = boardSizeHalf;
              }

              return pos;
          }
      }, {
          key: "restrictYPos",
          value: function restrictYPos(deltaY, boardDim, direction) {

              var boardHalf = Math.ceil(boardDim / 2) + 10;

              var pos = Math.ceil(this.lastY + deltaY);

              if(pos <= -boardHalf) {
                  pos = -boardHalf;
              } else if(pos >= boardHalf) {
                  pos = boardHalf;
              }

              return pos;
          }
      }, {
          key: "drawSwapRack",
          value: function drawSwapRack(tile) {
              var tileComponent = tile.component;
              if(tile.swapRackIdx == null && tile.rackIdx != null) {

                  var swapRackIdToUse = null;

                  for(var i=0;i<this.letterRackHolder.children.length;i++) {
                      if(!this.letterRackHolder.childNodes[i].hasChildNodes()) {
                          swapRackIdToUse = i;
                          break;
                      }
                  }

                  if(swapRackIdToUse != null) {

                      var swapContainerDiv = document.getElementById('swap_rack_tileBg_' + swapRackIdToUse);
                      var rackContainerDiv = tileComponent.tileDiv.parentNode;

                      if(rackContainerDiv && rackContainerDiv.hasChildNodes()) {
                          tile.setSwapRackIdx(swapRackIdToUse);
                          swapContainerDiv.tileId = tile.id;
                          rackContainerDiv.tileId = null;
                          rackContainerDiv.removeChild(rackContainerDiv.lastChild);
                      }

                      if(swapContainerDiv && !swapContainerDiv.hasChildNodes()) {
                          swapContainerDiv.appendChild(tileComponent.tileDiv);
                      }

                      if (!tileComponent.isToSwap) {
                          tileComponent.toggleSwap();
                      }

                  }
              }
              else if(tile.swapRackIdx != null && tile.rackIdx == null) {

                  var playerRackIdToUse = null;

                  for(var i=0;i<tile.player.rack.length;i++) {
                      if(tile.player.rack[i] == null) {
                          playerRackIdToUse = i;
                          break;
                      }
                  }

                  if(playerRackIdToUse != null) {

                      var playerIdx = tile.player.idx;

                      var rackContainerDiv = document.getElementById('player_tileBg_' + playerIdx + '_' + playerRackIdToUse);
                      var swapContainerDiv = tileComponent.tileDiv.parentNode;


                      if(swapContainerDiv && swapContainerDiv.hasChildNodes()) {
                          tile.player.swapRack[tile.swapRackIdx] = null;
                          tile.swapRackIdx = null;
                          swapContainerDiv.removeChild(swapContainerDiv.lastChild);
                          swapContainerDiv.tileId = null;
                      }

                      if(rackContainerDiv && !rackContainerDiv.hasChildNodes()) {
                          rackContainerDiv.appendChild(tileComponent.tileDiv);
                          tile.player.rack[playerRackIdToUse] = tile;
                          tile.setRackIdx(playerRackIdToUse);
                          rackContainerDiv.tileId = tile.id;
                      }

                  }
              }

              //play sound
              sound.plungerPopTileOff();
          }
      }, {
          key: "showLoader",
          value: function showLoader() {
              this.loaderContainerDiv.style.display = "block";
              this.loaderContentDiv.style.display = "block";
              var loadGameText = isGameSaved ? this.controler.appLanguage.recoveringGame : this.controler.appLanguage.creatingGame;
              this.loaderParagraph.innerHTML = loadGameText + "<br /><br />";
          }
      }, {
          key: "hideLoader",
          value: function hideLoader() {
              this.loaderContainerDiv.style.display = "none";
          }
      }, {
          key: "openLinkFromMobile",
          value: function openLinkFromMobile(link) {

              var isRunningOnBrowser = window.__cordovaRunningOnBrowser__;
              if(!isRunningOnBrowser) {
                  var ref = cordova.InAppBrowser.open(link, '_system', 'location=yes', 'hardwareback=no');
              }
              else {
                  //console.log(('link: ' + link + ' was clicked from browser...');
              }

          }
      }, {
          key: "openTipeeeLinkFromMobile",
          value: function openTipeeeLinkFromMobile() {
              var isRunningOnBrowser = window.__cordovaRunningOnBrowser__;
              if(!isRunningOnBrowser) {
                  var ref = cordova.InAppBrowser.open('https://www.tipeee.com/manatygames', '_system', 'location=yes', 'hardwareback=no');
              }
              else {
                  //console.log(('tipeee link was clicked from browser...');
              }
          }
      }, {
         key: "disableSwapTile",
         value: function disableSwapTile() {
             this.swapTilesDiv.style.opacity = 0.5;
         }
     }, {
         key: "enableSwapTile",
         value: function enableSwapTile() {
             this.swapTilesDiv.style.opacity = 1.0;
         }
     }, {
        key: "placeTileOnBoard",
        value: function placeTileOnBoard(tile, boardNum) {
          //tile = tile object, boardNum = index of board tile
          var tileObj = tile.component.model;
          var tileComponent = new TileComponent(tileObj, tile.component.playerControler);
          this.model.board[i].component = tileComponent;
          //set board tile isPlayed to true to make it undraggable
          this.controler.model.board[boardNum].isPlayed = true;
        }
     }, {
         key: "updateGameButtonLocale",
         value: function updateGameButtonLocale() {

             if(_languageSet == "fr") {
                 //updates the buttons to french
                 this.playAgainDiv.classList.remove('playAgainButton');
                 this.playAgainDiv.classList.add('playAgainButton-fr');

                 this.leaveGameDiv.classList.remove('leaveGameButton');
                 this.leaveGameDiv.classList.add('leaveGameButton-fr');

                 this.wordsDiv.classList.remove('wordButton');
                 this.wordsDiv.classList.add('wordButton-fr');

                 this.leaveDiv.classList.remove('leaveButton');
                 this.leaveDiv.classList.add('leaveButton-fr');

                 this.swapTilesDiv.classList.remove('swapButton');
                 this.swapTilesDiv.classList.add('swapButton-fr');

                 this.shuffleDiv.classList.remove('shuffleButton');
                 this.shuffleDiv.classList.add('shuffleButton-fr');

                 this.gatherTilesDiv.classList.remove('gatherButton');
                 this.gatherTilesDiv.classList.add('gatherButton-fr');

                 this.passDiv.classList.remove('passButton');
                 this.passDiv.classList.add('passButton-fr');

                 this.playDiv.classList.remove('playButton');
                 this.playDiv.classList.add('playButton-fr');

             }
         }
     }, {
         key: "hideOpponentRack",
         value: function hideOpponentRack(opponentId) {

             var playerId = 1 - opponentId;
             var playerRack = document.getElementById('playerRack_' + playerId);
             var opponentRack = document.getElementById('playerRack_' + opponentId);
             if(opponentRack) {
                 opponentRack.style.display = 'none';
             }
             if(playerRack) {
                 playerRack.style.display = 'block';
             }

             console.log(" button is disabled " + this.controler.isMenuButtonDisabled);
             this.disableMenuButtons();

         }
     }, {
         key: "disableMenuButtons",
         value: function disableMenuButtons() {
             console.log("--- DISABLING MENU BUTTONS --- ");
             var passButton = document.getElementById('passButton');
             var playButton = document.getElementById('playButton');
             var shuffleButton = document.getElementById('shuffleButton');
             var gatherButton = document.getElementById('gatherButton');
             var gatherButton = document.getElementById('gatherButton');
             var swapButton = document.getElementById('swapButton');
             passButton.style.opacity = 0.5;
             playButton.style.opacity = 0.5;
             shuffleButton.style.opacity = 0.5;
             gatherButton.style.opacity = 0.5;
             swapButton.style.opacity = 0.5;
         }
     }, {
         key: "enableMenuButtons",
         value: function enableMenuButtons() {
             var passButton = document.getElementById('passButton');
             var playButton = document.getElementById('playButton');
             var shuffleButton = document.getElementById('shuffleButton');
             var gatherButton = document.getElementById('gatherButton');
             var gatherButton = document.getElementById('gatherButton');
             var swapButton = document.getElementById('swapButton');
             passButton.style.opacity = 1;
             playButton.style.opacity = 1;
             shuffleButton.style.opacity = 1;
             gatherButton.style.opacity = 1;
             swapButton.style.opacity = 1;
         }
     }, {
         key: "showUnknownWordDialog",
         value: function showUnknownWordDialog(word) {
             _windowOpened = 'unknownWordPopup';

             var invalidWords = [];
             for(var i=0;i<word.length;i++) {
                 if(window.marbbleWordmap[this.controler.model.getPlayer().lang][word[i]] == undefined) {
                     invalidWords.push(word[i]);
                 }
             }

             var wordText = this.controler.appLanguage.wordNotFoundInDic;
             var headerText = this.controler.appLanguage.wordUnknown;

             this.unknownWordTextDiv.innerHTML = "";

             if(invalidWords.length > 1) {
                 wordText = this.controler.appLanguage.wordsNotFoundInDic;
                 headerText = this.controler.appLanguage.wordsUnknown;
             }

             invalidWords = invalidWords.join(" & ");

             this.unknownHeaderTitleDiv.innerHTML = headerText;
             var unknownWordReplace = "<span id='unknownWordText' style='font-weight:bold; color: #2A78E4;'>"+ invalidWords +"</span>";
             this.unknownWordTextDiv.innerHTML = wordText.replace("{W}", unknownWordReplace)  + " </span>";


             this.unknownWordDiv.style.display = "block";


         }
    }, {
        key: "hideUnknownWordDialog",
        value: function hideUnknownWordDialog() {
            _windowOpened = 'gameScreenWindow';
            this.unknownWordDiv.style.display = "none";
        }
    }, {
        key: "createUnknownWordDialog",
        value: function createUnknownWordDialog() {
            //unknown word dialog
            this.unknownWordDiv = document.createElement('div');
            this.unknownWordDiv.className = "showModalDialog";
            this.unknownWordDiv.id = "unknownWordDialog";
            this.gameScreenDiv.appendChild(this.unknownWordDiv);

            //unknown word content div
            this.unknownWordContentDiv = document.createElement('div');
            this.unknownWordContentDiv.className = "showModalContentPass";
            this.unknownWordContentDiv.id = "unknownWordContent";
            this.unknownWordDiv.appendChild(this.unknownWordContentDiv);

            //pop-up header
            var unknownWordHeaderDiv = document.createElement('div');
            unknownWordHeaderDiv.className = "popup-header";
            this.unknownWordContentDiv.appendChild(unknownWordHeaderDiv);

            //pop-up header title
            this.unknownHeaderTitleDiv = document.createElement('div');
            this.unknownHeaderTitleDiv.className = "popup-header-title";
            this.unknownHeaderTitleDiv.innerHTML = this.controler.appLanguage.wordUnknown;
            unknownWordHeaderDiv.appendChild(this.unknownHeaderTitleDiv);

            //message text pass
            this.unknownWordTextDiv = document.createElement('div');
            this.unknownWordTextDiv.id = 'messageTextPass';
            //if(window._languageSet == "fr") {
                var unknownWordReplace = "<span id='unknownWordText' style='font-weight:bold; color: #2A78E4;'>Word</span>";
                this.unknownWordTextDiv.innerHTML = this.controler.appLanguage.wordNotFoundInDic.replace("{W}", unknownWordReplace)  + " </span>";
            //}
            //else {
            //    this.unknownWordTextDiv.innerHTML = "<span id='unknownWordText' style='font-weight:bold; color: #2A78E4;'>Word</span> " + this.controler.appLanguage.wordNotFoundInDic  + " </span>";
            //}

            unknownWordHeaderDiv.appendChild(this.unknownWordTextDiv);

            var checkboxContainer = document.createElement('div');
            checkboxContainer.className = "unknown-word-checkbox-container";
            this.unknownWordContentDiv.appendChild(checkboxContainer);

            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "unknownWordAllowed";
            checkbox.id = "unknownWordAllowed";

            checkboxContainer.appendChild(checkbox);

            var text = document.createTextNode(this.controler.appLanguage.doNotAskAnymore);
            checkboxContainer.appendChild(text);

            //button container
            var unknownWordButtonContainerDiv = document.createElement('div');
            unknownWordButtonContainerDiv.className = 'buttonContainer';
            this.unknownWordContentDiv.appendChild(unknownWordButtonContainerDiv)

            //unknown word playbutton
            var unknownWordPlayButton = document.createElement('button');
            unknownWordPlayButton.innerHTML = this.controler.appLanguage.play;
            unknownWordPlayButton.id = 'unknownWordOkBtn';
            unknownWordPlayButton.className = 'okButton';
            unknownWordPlayButton.classList.add('floatLeft');
            //unknownWordPlayButton.addEventListener('click', this.controler.hideUnknownWordDialog.bind(this.controler), true);
            unknownWordPlayButton.addEventListener("click", this.controler.confirmPlayUnknownWord.bind(this.controler), true);
            unknownWordButtonContainerDiv.appendChild(unknownWordPlayButton);


            //cancel button
            var unknownWordCancelButton = document.createElement('button');
            unknownWordCancelButton.innerHTML = this.controler.appLanguage.cancel;
            unknownWordCancelButton.className = 'cancelButton';
            unknownWordCancelButton.classList.add('floatRight');
            unknownWordCancelButton.addEventListener('click', this.controler.cancelInvalidWord.bind(this.controler), true);
            unknownWordButtonContainerDiv.appendChild(unknownWordCancelButton);

            var unknownClearDiv = document.createElement('div');
            unknownClearDiv.className = 'clearFloat';
            unknownWordButtonContainerDiv.appendChild(unknownClearDiv);


            //end unknown word dialog
        }
    }, {
        key: "setTileAsUnknownWord",
        value: function setTileAsUnknownWord(tile) {
            if(tile) {
                tile.isUnknownWord = true;
                tile.component.tileDiv.classList.remove('playerTile0', 'playerTile1');
                tile.component.tileDiv.classList.add('unknownWordTile');
                var tileTextDiv = tile.component.tileDiv.querySelectorAll("#tileTextContainer");
                var tileValueDiv = tile.component.tileDiv.querySelectorAll("#tileValueContainer");

                for(var i=0;i<tileTextDiv.length;i++) {
                    tileTextDiv[i].style.color = "#ffffff";
                }

                for(var j=0;j<tileValueDiv.length;j++) {
                    tileValueDiv[j].style.color = "#ffffff";
                }
            }

        }
    }, {
        key: "wordNotInDictionary",
        value: function wordNotInDictionary(word, source, style, type) {

            this.notInDictionaryText.nodeValue = word.toUpperCase();

            this.wordsDefinitionTable.style.display = "none";

            this.definitionsSection.style.display = "none";

            fetchWiktionary(word, source, style, type, false);

            if(isOnline()) {
                this.notInDictionarySection.style.display = "block";
            }

        }
    }
    ]);

    return GameComponent;
}();
