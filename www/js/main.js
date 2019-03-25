"use strict";

var mainInterface;

// Production steps of ECMA-262, Edition 6, 22.1.2.1
//Fix for Array.from issue with ES6 on Android webview
if (!Array.from) {
    Array.from = (function() {
        var toStr = Object.prototype.toString;
        var isCallable = function(fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function(value) {
            var number = Number(value);
            if (isNaN(number)) {
                return 0;
            }
            if (number === 0 || !isFinite(number)) {
                return number;
            }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function(value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // The length property of the from method is 1.
        return function from(arrayLike /*, mapFn, thisArg */ ) {
            // 1. Let C be the this value.
            var C = this;

            // 2. Let items be ToObject(arrayLike).
            var items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null) {
                throw new TypeError('Array.from requires an array-like object - not null or undefined');
            }

            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }

                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method
            // of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. Let k be 0.
            var k = 0;
            // 17. Repeat, while k < len… (also steps a - h)
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. Let putStatus be Put(A, "length", len, true).
            A.length = len;
            // 20. Return A.
            return A;
        };
    }());
}

var MainInterface = function() {
    var self = this;

    self.selectedLanguage = "";

    self.docW = document.documentElement.clientWidth;
    self.docH = document.documentElement.clientHeight;
    self.gameType = "passAndPlay";

    self.loadedScripts = 0;
    self.scriptsToLoad = 0;
    self.src = [];
    self.scripts = [];
    self.scriptIds = [];
    self.gameMode = "MarbbleClassic";
    self.online = false;
    self.classicLanguage = null;
    self.parentUrl = "";
    self.gameIdToDelete = null;
    self.loggedPlayerProfile = null;

    self.sound = new SoundControler();

    self.init = function() {
        window.onload = self.initMainScreen();
    };

    self.initMainScreen = function() {

        window.addEventListener('message', function(event) {

            if (event.data) {
                self.parentUrl = event.data;

                var isRunningOnBrowser = window.__cordovaRunningOnBrowser__;

                if (isRunningOnBrowser) {

                    self.getAppLanguage();
                    self.updateGameTexts();
                    self.updateGameButtonLocale();

                }
            }
        });

        if (_languageSet == null) {
            self.getAppLanguage();
        }

        self.appLanguage = window.applanguage[_languageSet];


        var screenDiv = document.getElementById("marbblescreen");
        self.screenDiv = screenDiv;
        self.manatySplashScreen = document.getElementById("manatySplashScreen");
        self.marbbleSplashScreen = document.getElementById("marbbleSplashScreen");
        var mainMenuDiv = document.getElementById("mainMenu");
        self.mainMenuDiv = mainMenuDiv;
        var mainMenuBtn = document.getElementById("mainMenuBtn");
        self.mainMenuBtn = mainMenuBtn;
        var newGameBtn = document.getElementById("newGameBtn");
        self.newGameBtn = newGameBtn;
        var settingsBtn = document.getElementById("settingsBtn");
        var gameConfigPopupDiv = document.getElementById("gameConfigModal");
        var notImplementedPopupDiv = document.getElementById("showModalDialog");
        var passAndPlayBtn = document.getElementById("passAndPlayBtn");
        var passAndPlayTab = document.getElementById("passAndPlayTab");
        var playAgainstComputerTab = document.getElementById("playAgainstComputerTab");
        self.gamePlayBtn = document.getElementById("gamePlayBtn");
        var playWithFriendBtn = document.getElementById("playWithFriend");
        var findOpponentBtn = document.getElementById("findOpponent");
        var soloGameBtn = document.getElementById("soloGame");
        var cancelGameBtn = document.getElementById("cancelGameBtn");
        self.marbbleClassicBtn = document.getElementById("marbbleClassicBtn");
        self.marbbleOpenBtn = document.getElementById("marbbleOpenBtn");
        self.classicBtn = document.getElementById("classicBtn");
        self.gameModeText = document.getElementById("gameModeText");
        self.gameModeIcon = document.getElementById("gameModeIcon");
        var editLanguagesBtn = document.getElementById("editLanguagesBtn");
        var player1LanguageEnBtn = document.getElementById("player1LanguageEn");
        var player1LanguageFrBtn = document.getElementById("player1LanguageFr");
        var player1LanguageEsBtn = document.getElementById("player1LanguageEs");
        var player1LanguageTlBtn = document.getElementById("player1LanguageTl");
        // var player1LanguageDeBtn = document.getElementById("player1LanguageDe");
        // var player1LanguageItBtn = document.getElementById("player1LanguageIt");
        // var player1LanguagePtBtn = document.getElementById("player1LanguagePt");
        var player2LanguageEnBtn = document.getElementById("player2LanguageEn");
        var player2LanguageFrBtn = document.getElementById("player2LanguageFr");
        var player2LanguageEsBtn = document.getElementById("player2LanguageEs");
        var player2LanguageTlBtn = document.getElementById("player2LanguageTl");
        // var player2LanguageDeBtn = document.getElementById("player2LanguageDe");
        // var player2LanguageItBtn = document.getElementById("player2LanguageIt");
        // var player2LanguagePtBtn = document.getElementById("player2LanguagePt");
        var classicLanguageEnBtn = document.getElementById("classicLanguageEn");
        var classicLanguageFrBtn = document.getElementById("classicLanguageFr");
        var classicLanguageEsBtn = document.getElementById("classicLanguageEs");
        var classicLanguageTlBtn = document.getElementById("classicLanguageTl");
        // var classicLanguageDeBtn = document.getElementById("classicLanguageDe");
        // var classicLanguageItBtn = document.getElementById("classicLanguageIt");
        // var classicLanguagePtBtn = document.getElementById("classicLanguagePt");
        var onlinePlayerLanguageEnBtn = document.getElementById("onlinePlayerLanguageEn");
        var onlinePlayerLanguageFrBtn = document.getElementById("onlinePlayerLanguageFr");
        var onlinePlayerLanguageEsBtn = document.getElementById("onlinePlayerLanguageEs");
        var onlinePlayerLanguagePhBtn = document.getElementById("onlinePlayerLanguageTl");
        var onlineOpponentLanguageEnBtn = document.getElementById("onlineOpponentLanguageEn");
        var onlineOpponentLanguageFrBtn = document.getElementById("onlineOpponentLanguageFr");
        var onlineOpponentLanguageEsBtn = document.getElementById("onlineOpponentLanguageEs");
        var onlineOpponentLanguagePhBtn = document.getElementById("onlineOpponentLanguageTl");
        var onlineClassicLanguageEnBtn = document.getElementById("onlineClassicLanguageEn");
        var onlineClassicLanguageFrBtn = document.getElementById("onlineClassicLanguageFr");
        var onlineClassicLanguageEsBtn = document.getElementById("onlineClassicLanguageEs");
        var onlineClassicLanguagePhBtn = document.getElementById("onlineClassicLanguageTl");
        var modalCloseButton = document.getElementById("close");
        var deleteGameModalDialog = document.getElementById("deleteGameModalDialog");
        self.creditsScreen = document.getElementById("creditsScreen");
        self.creditsBackButton = document.getElementById("creditBack");
        //self.soundButton = document.getElementById("soundButton");
        self.gameModeScreen = document.getElementById("gameModeScreen");
        self.newGameInterfaceBtn = document.getElementById("newGameInterfaceBtn");
        var importGameBtn = document.getElementById("importGameBtn");

        self.newGameInterfaceContainer = document.getElementById("newGameInterfaceContainer");
        self.mainInterfaceDiv = document.getElementById("mainInterface");
        self.settingsScreen = document.getElementById("settingsScreen");

        self.exitAppPopupDiv = document.getElementById("exitAppModalDialog");

        self.exitOKButton = document.getElementById('exitOKButton');
        self.exitCancelButton = document.getElementById('exitCancelButton');

        self.deleteOKButton = document.getElementById('deleteOKButton');
        self.deleteCancelButton = document.getElementById('deleteCancelButton');

        self.loginOKButton = document.getElementById('loginOkButton');
        self.loginCancelButton = document.getElementById('loginCancelButton');

        self.localStorage = self.getSupportedLocalStorage();

        self.activeGamesContainerDiv = document.getElementById('activeGamesContainer');

        self.onlineInterface = document.getElementById('onlineInterface');
        var arenaHowToBackBtn = document.getElementById('arenaHowToBackBtn');
        var acc = document.getElementsByClassName("accordion");
        self.classicArena = document.getElementById("classicArena");
        self.marbbleClassicArena = document.getElementById("marbbleClassicArena");
        var profileMarbbleClassicSelect = document.getElementById("profileMarbbleClassicSelect");
        var profileClassicSelect = document.getElementById("profileClassicSelect");
        var arenaBackBtn = document.getElementById('arenaBackBtn');
        var loginBackToMainBtn = document.getElementById('loginBackToMainBtn');
        var registerBackToMainBtn = document.getElementById('registerBackToMainBtn');
        var importCancel = document.getElementById("importCancel");
        var importAndPlayBtn = document.getElementById("importAndPlayBtn");
        var challengePlayBtn = document.getElementById("challengePlayBtn");
        var challengeCancelBtn = document.getElementById("challengeCancelBtn");
        var settingsLoggedOutPhotoUploadBtn = document.getElementById("settingsLoggedOutPhotoUploadBtn");
        var settingsLoggedInPhotoUploadBtn = document.getElementById("settingsLoggedInPhotoUploadBtn");
        var registerPhotoUploadBtn = document.getElementById("registerPhotoUploadBtn");

        var submitTempProfileBtn = document.getElementById("submitTempProfileBtn");
        var submitProfileBtn = document.getElementById("submitProfileBtn");

        var selectGameModeDiv = document.getElementById("selectGameMode");

        if(selectGameModeDiv) {
            selectGameModeDiv.innerHTML = self.appLanguage.selectMode;
        }

        self.importCancel = importCancel;
        self.importAndPlayBtn = importAndPlayBtn;
        self.localStorage.removeItem("isImportGame");
        self.activeTab = "newGame";

        self.preferredLangEn = document.getElementById("preferredLangEn");
        self.preferredLangFr = document.getElementById("preferredLangFr");
        self.preferredLangEs = document.getElementById("preferredLangEs");
        self.preferredLangPh = document.getElementById("preferredLangPh");
        // self.preferredLangDe = document.getElementById("preferredLangDe");
        // self.preferredLangIt = document.getElementById("preferredLangIt");
        // self.preferredLangPt = document.getElementById("preferredLangPt");

        self.online = false;

        self.playerPublicKey = self.getPlayerPublicKey();
        var publicKeyId = null;


        var timeout = window.__cordovaRunningOnBrowser__ ? 500 : 2000;


        if (self.playerPublicKey) {
            publicKeyId = self.getPublicKeyID(self.playerPublicKey);
            if (saveUtils.getIndexedDB()) {
                //indexed db is supported
                setTimeout(function() {
                    saveUtils.getPlayerProfileByUserId(publicKeyId, self.getPlayerProfile);
                }, timeout);
            } else {
                //indexed db is not supported, use local storage instead
                self.loggedPlayerProfile = getPlayerProfile(publicKeyId);
            }


        }

        self.tempProfile = getTempProfile() ? getTempProfile() : self.setTempProfile();

        if (self.loggedPlayerProfile) {
            self.updateProfilePreferences(self.loggedPlayerProfile);
        } else {
            self.updateTempProfileSettings(self.tempProfile);
        }

        self.challengeNotificationScreen = document.getElementById("challengeNotificationScreen");

        var arenaFlagEnBtn = document.getElementById("arenaFlagEn");
        var arenaFlagFrBtn = document.getElementById("arenaFlagFr");
        var arenaFlagEsBtn = document.getElementById("arenaFlagEs");
        var arenaFlagPhBtn = document.getElementById("arenaFlagPh");
        // var arenaFlagDeBtn = document.getElementById("arenaFlagDe");
        // var arenaFlagItBtn = document.getElementById("arenaFlagIt");
        // var arenaFlagPtBtn = document.getElementById("arenaFlagPt");
        self.arenaInterface = document.getElementById("arenaInterface");

        var updateLanguagePreferenceBtn = document.getElementById('updatePreferences');
        var saveSettingsBtn = document.getElementById('saveSettings');

        var loginSubmit = document.getElementById('loginSubmit');
        var loginWithFb = document.getElementById('loginWithFb');
        var loginEmail = document.getElementById('loginWithEmail');

        var registerSubmit = document.getElementById('registerSubmit');

        var settingsLoginSubmit = document.getElementById("settingsLoginSubmit");

        var loginRegister = document.getElementById("loginRegister");
        var settingsRegister = document.getElementById("settingsRegister");

        var logoutButton = document.getElementById("logoutButton");

        var activateLanguagesBtn = document.getElementById("activateLanguagesBtn");

        var activateLanguagesCancelBtn = document.getElementById("activateLanguagesCancelBtn");

        var homeLoginBtn = document.getElementById('homeLoginBtn');


        self.settingsLoggedIn = document.getElementById("settingsLoggedIn");
        self.settingsLoggedOut = document.getElementById("settingsLoggedOut");

        self.arenaTitleText = document.getElementById("arenaTitle");

        self.importGameScreen = document.getElementById("importGameScreen");

        self.arenaPlayersList = document.getElementById("arenaPlayersList");

        self.devicePlatform = null;
        self.deviceVersion = null;
        self.isRunningOnBrowser = window.__cordovaRunningOnBrowser__;

        self.loginDialog = document.getElementById("loginDialog");

        if (activateLanguagesBtn) {
            activateLanguagesBtn.addEventListener('click', function(e) {
                self.hideGameModeScreen();
                self.showSettings();
            });
        }

        if (activateLanguagesCancelBtn) {
            activateLanguagesCancelBtn.addEventListener('click', self.hideGameModeScreen);
        }

        if (settingsLoggedOutPhotoUploadBtn) {
            settingsLoggedOutPhotoUploadBtn.addEventListener('click', self.uploadProfilePhoto);
        }

        if (settingsLoggedInPhotoUploadBtn) {
            settingsLoggedInPhotoUploadBtn.addEventListener('click', self.uploadProfilePhoto);
        }

        if (registerPhotoUploadBtn) {
            registerPhotoUploadBtn.addEventListener('click', self.uploadProfilePhoto);
        }

        if (updateLanguagePreferenceBtn) {
            updateLanguagePreferenceBtn.addEventListener('click', self.updateLanguagePreference);
        }

        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', self.saveSettings);
        }

        if (loginRegister) {
            loginRegister.addEventListener('click', self.showRegisterScreen);
        }

        if (settingsRegister) {
            settingsRegister.addEventListener('click', self.showRegisterScreen);
        }

        if (loginSubmit) {
            loginSubmit.addEventListener('click', self.login);
        }

        if (registerSubmit) {
            registerSubmit.addEventListener('click', self.createAccount);
        }

        if (loginWithFb) {
            loginWithFb.addEventListener('click', self.showNotImplementedPopup);
        }

        if (loginEmail) {
            loginEmail.addEventListener('click', self.showNotImplementedPopup);
        }

        if (settingsLoginSubmit) {
            settingsLoginSubmit.addEventListener('click', self.login);
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', self.logout);
        }

        if (submitTempProfileBtn) {
            submitTempProfileBtn.addEventListener('click', self.updateProfile)
        }

        if (submitProfileBtn) {
            submitProfileBtn.addEventListener('click', self.updateProfile)
        }

        if (homeLoginBtn) {
            homeLoginBtn.addEventListener('click', self.showSettings);
        }

        if (profileMarbbleClassicSelect) {
            profileMarbbleClassicSelect.addEventListener('click', function(e) {
                profileMarbbleClassicSelect.classList.toggle("selected");
            });
        }

        if (profileClassicSelect) {
            profileClassicSelect.addEventListener('click', function(e) {
                profileClassicSelect.classList.toggle("selected");
            });
        }

        if (importCancel) {
            importCancel.addEventListener('click', self.hideImportGameScreen);
        }

        if (challengeCancelBtn) {
            challengeCancelBtn.addEventListener('click', self.hideChallengeNotificationScreen);
        }

        if (importAndPlayBtn) {
            importAndPlayBtn.addEventListener('click', self.startPlay);
        }

        if (self.classicArena) {
            self.classicArena.addEventListener('click', function() {
                var arenaType = "Classic";
                self.enterArena(arenaType);
            });
        }

        if (self.marbbleClassicArena) {
            self.marbbleClassicArena.addEventListener('click', function() {
                var arenaType = "Marbble Classic";
                self.enterArena(arenaType);
            });
        }

        if (arenaFlagEnBtn) {
            arenaFlagEnBtn.addEventListener('click', self.selectArenaLanguage);
        }

        if (arenaFlagFrBtn) {
            arenaFlagFrBtn.addEventListener('click', self.selectArenaLanguage);
        }

        if (arenaFlagEsBtn) {
            arenaFlagEsBtn.addEventListener('click', self.selectArenaLanguage);
        }

        if (arenaFlagPhBtn) {
            arenaFlagPhBtn.addEventListener('click', self.selectArenaLanguage);
        }


        if (acc.length > 0) {

            for (var i = 0; i < acc.length; i++) {
                acc[i].addEventListener('click', function() {
                    this.classList.toggle("active");
                    var chevron = this.getElementsByClassName("chevron")[0];
                    if (chevron) {
                        chevron.classList.toggle("up");
                    }
                    var panel = this.nextElementSibling;

                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                });
            }

        }

        if (self.newGameInterfaceBtn) {
            self.newGameInterfaceBtn.innerHTML = self.appLanguage.newgame.toUpperCase();
            self.newGameInterfaceBtn.addEventListener('click', self.showNewGame);
        }

        if (importGameBtn) {
            importGameBtn.innerHTML = self.appLanguage.importGame.toUpperCase();
        }

        if (self.exitCancelButton) {
            self.exitCancelButton.addEventListener('click', self.hideExitAppDialog);
        }

        if (self.exitOKButton) {
            self.exitOKButton.addEventListener('click', self.exitApp);
        }

        if (self.deleteOKButton) {
            self.deleteOKButton.addEventListener('click', self.removeGame);
        }

        if (self.deleteCancelButton) {
            self.deleteCancelButton.addEventListener('click', self.hideDeletePopup);
        }

        if (self.loginOKButton) {
            self.loginOKButton.addEventListener('click', self.showSettings);
        }

        if (self.loginCancelButton) {
            self.loginCancelButton.addEventListener('click', self.hideLoginDialog);
        }

        if (arenaHowToBackBtn) {
            arenaHowToBackBtn.addEventListener('click', self.backToMainMenu);
        }

        if (arenaBackBtn) {
            arenaBackBtn.addEventListener('click', self.backToOnlineScreen);
        }

        if (loginBackToMainBtn) {
            loginBackToMainBtn.addEventListener('click', self.backToMainMenu);
        }

        if (registerBackToMainBtn) {
            registerBackToMainBtn.addEventListener('click', self.backToSettings);
        }

        var tipeeeLink = document.getElementById("tipeeeLink");

        var creditsButton = document.getElementById("credits");

        self.settingsLoggedOutPhotoUpload = document.getElementById('settingsLoggedOutPhotoUpload');

        self.settingsLoggedInPhotoUpload = document.getElementById("settingsLoggedInPhotoUpload");

        self.registerPhotoUpload = document.getElementById("registerPhotoUpload");

        if (self.settingsLoggedOutPhotoUpload) {
            self.settingsLoggedOutPhotoUpload.addEventListener('change', self.startPhotoUpload);
        }

        if (self.settingsLoggedInPhotoUpload) {
            self.settingsLoggedInPhotoUpload.addEventListener('change', self.startPhotoUpload);
        }

        if (self.registerPhotoUpload) {
            self.registerPhotoUpload.addEventListener('change', self.startPhotoUpload);
        }


        self.scriptsToLoad = 0;

        if (creditsButton) {
            creditsButton.addEventListener('click', self.openCredits);
        }

        if (tipeeeLink) {
            var isRunningOnBrowser = window.__cordovaRunningOnBrowser__;

            if (!isRunningOnBrowser) {
                tipeeeLink.addEventListener('click', self.tipeeeLinkClick);
            }
        }

        if (self.creditsBackButton) {
            self.creditsBackButton.addEventListener('click', self.backToMainMenu);
        }

        if (passAndPlayBtn) {
            passAndPlayBtn.addEventListener('click', self.passAndPlaySelected);
        }

        if (self.marbbleClassicBtn) {
            marbbleClassicBtn.addEventListener('click', self.selectMarbbleClassicMode);
        }

        if (self.preferredLangEn) {
            self.preferredLangEn.addEventListener('click', self.setPreferredLanguage);
        }

        if (self.preferredLangFr) {
            self.preferredLangFr.addEventListener('click', self.setPreferredLanguage);
        }

        if (self.preferredLangEs) {
            self.preferredLangEs.addEventListener('click', self.setPreferredLanguage);
        }

        if (self.preferredLangPh) {
            self.preferredLangPh.addEventListener('click', self.setPreferredLanguage);
        }

        if (self.marbbleOpenBtn) {
            marbbleOpenBtn.addEventListener('click', self.selectOpenMode);
        }

        if (self.classicBtn) {
            classicBtn.addEventListener('click', self.selectClassicMode);
        }

        if (mainMenuBtn) {
            mainMenuBtn.addEventListener('click', self.showMainInterface);
        }

        if (newGameBtn) {
            newGameBtn.addEventListener('click', self.showNewGame);
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', self.showSettings);
        }

        if (self.gamePlayBtn) {
            self.gamePlayBtn.addEventListener('click', self.startPlay);
        }


        if (cancelGameBtn) {
            cancelGameBtn.addEventListener('click', self.hideGameModeScreen);
        }

        if (onlinePlayerLanguageEnBtn) {
            onlinePlayerLanguageEnBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (onlinePlayerLanguageFrBtn) {
            onlinePlayerLanguageFrBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (onlinePlayerLanguageEsBtn) {
            onlinePlayerLanguageEsBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (onlinePlayerLanguagePhBtn) {
            onlinePlayerLanguagePhBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (onlineOpponentLanguageEnBtn) {
            onlineOpponentLanguageEnBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (onlineOpponentLanguageFrBtn) {
            onlineOpponentLanguageFrBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (onlineOpponentLanguageEsBtn) {
            onlineOpponentLanguageEsBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (onlineOpponentLanguagePhBtn) {
            onlineOpponentLanguagePhBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (onlineClassicLanguageEnBtn) {
            onlineClassicLanguageEnBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (onlineClassicLanguageFrBtn) {
            onlineClassicLanguageFrBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (onlineClassicLanguageEsBtn) {
            onlineClassicLanguageEsBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (onlineClassicLanguagePhBtn) {
            onlineClassicLanguagePhBtn.addEventListener('click', self.toggleOnlineLanguage);
        }

        if (player1LanguageEnBtn) {
            player1LanguageEnBtn.setAttribute('isselected', false);
            player1LanguageEnBtn.addEventListener('click', self.toggleSelectedLanguage);
        }

        if (player1LanguageFrBtn) {
            player1LanguageFrBtn.setAttribute('isselected', false);
            player1LanguageFrBtn.addEventListener('click', self.toggleSelectedLanguage);
        }

        if (player1LanguageEsBtn) {
            player1LanguageEsBtn.setAttribute('isselected', false);
            player1LanguageEsBtn.addEventListener('click', self.toggleSelectedLanguage);
        }

        if (player1LanguageTlBtn) {
            player1LanguageTlBtn.setAttribute('isselected', false);
            player1LanguageTlBtn.addEventListener('click', self.toggleSelectedLanguage);
        }

        // if (player1LanguageDeBtn) {
        //     player1LanguageDeBtn.setAttribute('isselected', false);
        //     player1LanguageDeBtn.addEventListener('click', self.toggleSelectedLanguage);
        // }
        // if (player1LanguageItBtn) {
        //     player1LanguageItBtn.setAttribute('isselected', false);
        //     player1LanguageItBtn.addEventListener('click', self.toggleSelectedLanguage);
        // }
        // if (player1LanguagePtBtn) {
        //     player1LanguagePtBtn.setAttribute('isselected', false);
        //     player1LanguagePtBtn.addEventListener('click', self.toggleSelectedLanguage);
        // }

        if (player2LanguageEnBtn) {
            player2LanguageEnBtn.setAttribute('isselected', false);
            player2LanguageEnBtn.addEventListener('click', self.toggleSelectedLanguage);
        }

        if (player2LanguageFrBtn) {
            player2LanguageFrBtn.setAttribute('isselected', false);
            player2LanguageFrBtn.addEventListener('click', self.toggleSelectedLanguage);
        }

        if (player2LanguageEsBtn) {
            player2LanguageEsBtn.setAttribute('isselected', false);
            player2LanguageEsBtn.addEventListener('click', self.toggleSelectedLanguage);
        }

        if (player2LanguageTlBtn) {
            player2LanguageTlBtn.setAttribute('isselected', false);
            player2LanguageTlBtn.addEventListener('click', self.toggleSelectedLanguage);
        }

        // if (player2LanguageDeBtn) {
        //     player2LanguageDeBtn.setAttribute('isselected', false);
        //     player2LanguageDeBtn.addEventListener('click', self.toggleSelectedLanguage);
        // }
        // if (player2LanguageItBtn) {
        //     player2LanguageItBtn.setAttribute('isselected', false);
        //     player2LanguageItBtn.addEventListener('click', self.toggleSelectedLanguage);
        // }
        // if (player2LanguagePtBtn) {
        //     player2LanguagePtBtn.setAttribute('isselected', false);
        //     player2LanguagePtBtn.addEventListener('click', self.toggleSelectedLanguage);
        // }

        if (classicLanguageEnBtn) {
            classicLanguageEnBtn.setAttribute('isselected', false);
            classicLanguageEnBtn.addEventListener('click', self.toggleClassicLanguage);
        }

        if (classicLanguageFrBtn) {
            classicLanguageFrBtn.setAttribute('isselected', false);
            classicLanguageFrBtn.addEventListener('click', self.toggleClassicLanguage);
        }

        if (classicLanguageEsBtn) {
            classicLanguageEsBtn.setAttribute('isselected', false);
            classicLanguageEsBtn.addEventListener('click', self.toggleClassicLanguage);
        }

        // if (classicLanguageDeBtn) {
        //     classicLanguageDeBtn.setAttribute('isselected', false);
        //     classicLanguageDeBtn.addEventListener('click', self.toggleClassicLanguage);
        // }
        //
        // if (classicLanguageItBtn) {
        //     classicLanguageItBtn.setAttribute('isselected', false);
        //     classicLanguageItBtn.addEventListener('click', self.toggleClassicLanguage);
        // }
        //
        // if (classicLanguagePtBtn) {
        //     classicLanguagePtBtn.setAttribute('isselected', false);
        //     classicLanguagePtBtn.addEventListener('click', self.toggleClassicLanguage);
        // }

        if (classicLanguageTlBtn) {
            classicLanguageTlBtn.setAttribute('isselected', false);
            classicLanguageTlBtn.addEventListener('click', self.toggleClassicLanguage);
        }

        if (modalCloseButton) {
            modalCloseButton.addEventListener('click', self.hideNotImplementedPopup);
        }

        if (playWithFriendBtn) {
            playWithFriendBtn.addEventListener('click', self.showNotImplementedPopup);
        }

        if (findOpponentBtn) {
            findOpponentBtn.addEventListener('click', self.findOpponent);
        }

        if (soloGameBtn) {
            //soloGameBtn.addEventListener('click', self.showGameConfigPopupSolo);
            soloGameBtn.addEventListener('click', self.soloPlaySelected);
        }

        if (editLanguagesBtn) {
            editLanguagesBtn.addEventListener('click', self.showSettings);
        }

        // if (self.soundButton) {
        //     self.soundButton.addEventListener('click', self.toggleSoundButton);
        // }

        var isMobile = self.isMobile();

        if (isMobile == false) {
            self.docW = 360;
            self.docH = 640;
            screenDiv.style.border = "3px solid #ffffff";
        }

        screenDiv.style.width = self.docW + "px";
        screenDiv.style.height = self.docH + "px";

        if (gameConfigPopupDiv) {
            gameConfigPopupDiv.style.width = self.docW + "px";
            gameConfigPopupDiv.style.height = self.docH + "px";
        }

        if (notImplementedPopupDiv) {
            notImplementedPopupDiv.style.width = self.docW + "px";
            notImplementedPopupDiv.style.height = self.docH + "px";
        }

        if (deleteGameModalDialog) {
            deleteGameModalDialog.style.width = self.docW + "px";
            deleteGameModalDialog.style.height = self.docH + "px";
        }

        if (self.exitAppPopupDiv) {
            self.exitAppPopupDiv.style.width = self.docW + "px";
            self.exitAppPopupDiv.style.height = self.docH + "px";
        }

        if (self.loginDialog) {
            self.loginDialog.style.width = self.docW + "px";
            self.loginDialog.style.height = self.docH + "px";
        }

        var body = document.getElementsByTagName("body")[0];
        body.style.display = "block";

        var enFlagDiv = document.getElementById("enFlag");
        var frFlagDiv = document.getElementById("frFlag");
        var esFlagDiv = document.getElementById("esFlag");
        var deFlagDiv = document.getElementById("deFlag");


        // var isRunningOnBrowser = window.__cordovaRunningOnBrowser__;
        // //
        // if(isRunningOnBrowser) {
        //
        //     self.getAppLanguage();
        //     self.updateGameTexts();
        //     self.updateGameButtonLocale();
        //
        // }

        //TODO DISABLE ACTIVATION OF LANGUAGES FOR NOW
        //self.updateHomeLanguages();

        self.startManatySplash();

        var activeGames = [];

        var activeGames = getActiveGamesList();


        if (activeGames.length > 0) {
            self.getAppLanguage();
            //self.updateGameTexts();
            //self.updateGameButtonLocale();
            self.mainMenuBtn.click();

            for (var i = 0; i < activeGames.length; i++) {
                self.createGamesList(activeGames[i]);
            }
        }

    };

    self.isMobile = function() {

        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && self.docW > 1024) {
            return false;
        }
        return true;

    };

    self.toggleSoundButton = function(e) {
        var soundButtonValue = self.getSoundButtonValue();
        var div = self.soundButton;

        if (soundButtonValue == true || soundButtonValue == "true") {
            div.classList.remove("player_config_soundON");
            div.classList.add("player_config_soundOFF");
            soundButtonValue = false;
        } else {
            div.classList.remove("player_config_soundOFF");
            div.classList.add("player_config_soundON");
            soundButtonValue = true;
        }
        self.setSoundButtonValue(soundButtonValue);
    };

    self.getGameModeSelected = function(e) {
        var gameModeValue = document.getElementById("gameModeSelected").value;
        return gameModeValue;
    };

    self.setGameModeSelected = function(val) {
        var gameModeSelected = document.getElementById("gameModeSelected");
        gameModeSelected.value = val;
    };

    self.getSoundButtonValue = function(e) {
        var soundButtonValue = document.getElementsByName("soundButtonValue")[0].value.trim();
        return soundButtonValue;
    };

    self.setSoundButtonValue = function(val) {
        var soundButton = document.getElementsByName("soundButtonValue")[0];
        soundButton.value = val;
    };

    self.getPlayer1Input = function(e) {
        var player1Input = document.getElementsByName("player1pseudo")[0].value.trim();
        return player1Input;
    };

    self.getPlayer2Input = function(e) {
        var player2Input = document.getElementsByName("player2pseudo")[0].value.trim();
        return player2Input;
    };

    self.getOnlinePlayerLanguage = function(e) {
        var language = document.getElementById('onlinePlayerLanguage').value;
        return language;
    };

    self.getOnlineOpponentLanguage = function(e) {
        var language = document.getElementById('onlineOpponentLanguage').value;
        return language;
    };

    self.getPlayer1Language = function(e) {
        var playerLanguage = document.getElementsByName("player1Language")[0].value;
        return playerLanguage;
    };

    self.getPlayer2Language = function(e) {
        var playerLanguage = document.getElementsByName("player2Language")[0].value;
        return playerLanguage;
    };

    self.getClassicLanguage = function(e) {
        var classicLanguage = document.getElementsByName("classicLanguage")[0].value;
        return classicLanguage;
    }


    self.setPlayerInfoFromStorage = function() {
        var player1Input = document.getElementsByName("player1pseudo")[0];
        var player2Input = document.getElementsByName("player2pseudo")[0];
        var player1LanguageInput = document.getElementsByName("player1Language")[0];
        var player2LanguageInput = document.getElementsByName("player2Language")[0];
        var classicLanguageInput = document.getElementsByName("classicLanguage")[0];
        var classicLanguageEn = document.getElementById("classicLanguageEn");
        var classicLanguageFr = document.getElementById("classicLanguageFr");
        var classicLanguageEs = document.getElementById("classicLanguageEs");
        var classicLanguageTl = document.getElementById("classicLanguageTl");
        // var classicLanguageDe = document.getElementById("classicLanguageDe");
        // var classicLanguageIt = document.getElementById("classicLanguageIt");
        // var classicLanguagePt = document.getElementById("classicLanguagePt");

        var soundButton = document.getElementsByName("soundButtonValue")[0];

        var gameModeSelected = document.getElementById('gameModeSelected');

        var player1LanguageEn = document.getElementById("player1LanguageEn");
        var player1LanguageFr = document.getElementById("player1LanguageFr");
        var player1LanguageEs = document.getElementById("player1LanguageEs");
        var player1LanguageTl = document.getElementById("player1LanguageTl");
        // var player1LanguageDe = document.getElementById("player1LanguageDe");
        // var player1LanguageIt = document.getElementById("player1LanguageIt");
        // var player1LanguagePt = document.getElementById("player1LanguagePt");
        var player2LanguageEn = document.getElementById("player2LanguageEn");
        var player2LanguageFr = document.getElementById("player2LanguageFr");
        var player2LanguageEs = document.getElementById("player2LanguageEs");
        var player2LanguageTl = document.getElementById("player2LanguageTl");
        // var player2LanguageDe = document.getElementById("player2LanguageDe");
        // var player2LanguageIt = document.getElementById("player2LanguageIt");
        // var player2LanguagePt = document.getElementById("player2LanguagePt");

        var player1NameKey = 'player1Name';
        var player2NameKey = 'player2Name';
        var player1LanguageKey = 'player1Language';
        var player2LanguageKey = 'player2Language';

        var soundButtonValueKey = 'soundButtonKey';

        var gameModeKey = 'gameModeKey';

        var classicLanguageKey = 'classicLanguageKey';

        player1LanguageEn.classList.remove('selected');
        player1LanguageFr.classList.remove('selected');
        player1LanguageEs.classList.remove('selected');
        player1LanguageTl.classList.remove('selected');
        // player1LanguageDe.classList.remove('selected');
        // player1LanguageIt.classList.remove('selected');
        // player1LanguagePt.classList.remove('selected');

        player2LanguageEn.classList.remove('selected');
        player2LanguageFr.classList.remove('selected');
        player2LanguageEs.classList.remove('selected');
        player2LanguageTl.classList.remove('selected');
        // player2LanguageDe.classList.remove('selected');
        // player2LanguageIt.classList.remove('selected');
        // player2LanguagePt.classList.remove('selected');

        classicLanguageEn.classList.remove('selected');
        classicLanguageFr.classList.remove('selected');
        classicLanguageEs.classList.remove('selected');
        classicLanguageTl.classList.remove('selected');
        // classicLanguageDe.classList.remove('selected');
        // classicLanguageIt.classList.remove('selected');
        // classicLanguagePt.classList.remove('selected');

        self.marbbleClassicBtn.classList.remove('active');
        self.marbbleOpenBtn.classList.remove('active');
        self.classicBtn.classList.remove('active');

        if (self.localStorage) {
            var player1Name = self.localStorage.getItem(player1NameKey);

            if (self.tempProfile && (self.tempProfile.pseudo != '' && self.tempProfile.pseudo != null) ) {
                player1Name = self.tempProfile.pseudo;
            }

            // if (self.loggedPlayerProfile && self.loggedPlayerProfile.pseudo != '') {
            //     player1Name = self.loggedPlayerProfile.pseudo;
            // }


            //player1Name = (self.loggedPlayerProfile && self.loggedPlayerProfile.pseudo) ? self.loggedPlayerProfile.pseudo : player1Name;

            if (player1Name && player1Name != '') {
                player1Input.value = player1Name;
            }

            var player2Name = self.localStorage.getItem(player2NameKey);

            if (player2Name && player2Name != '') {
                player2Input.value = player2Name;
            }

            var player1Language = self.localStorage.getItem(player1LanguageKey);

            if (player1Language) {
                if (player1Language == "en") {
                    player1LanguageEn.classList.add("selected");
                } else if (player1Language == "fr") {
                    player1LanguageFr.classList.add("selected");
                } else if (player1Language == "es") {
                    player1LanguageEs.classList.add("selected");
                } else if (player1Language == "tl") {
                    player1LanguageTl.classList.add("selected");
                }
                // else if (player1Language == "de") {
                //     player1LanguageDe.classList.add("selected");
                // } else if (player1Language == "it") {
                //     player1LanguageIt.classList.add("selected");
                // } else if (player1Language == "pt") {
                //     player1LanguagePt.classList.add("selected");
                // }
                player1LanguageInput.value = player1Language;
            } else {
                //set to english the default language of player 1
                player1LanguageEn.classList.add('selected');
                player1LanguageInput.value = "en";
            }

            var player2Language = self.localStorage.getItem(player2LanguageKey);

            if (player2Language) {
                if (player2Language == "en") {
                    player2LanguageEn.classList.add("selected");
                } else if (player2Language == "fr") {
                    player2LanguageFr.classList.add("selected");
                } else if (player2Language == "es") {
                    player2LanguageEs.classList.add("selected");
                } else if (player2Language == "tl") {
                    player2LanguageTl.classList.add("selected");
                }
                // else if (player2Language == "de") {
                //     player2LanguageDe.classList.add("selected");
                // } else if (player2Language == "it") {
                //     player2LanguageIt.classList.add("selected");
                // } else if (player2Language == "pt") {
                //     player2LanguagePt.classList.add("selected");
                // }
                player2LanguageInput.value = player2Language;
            } else {
                //set to french the default language of player 2
                player2LanguageFr.classList.add('selected');
                player2LanguageInput.value = "fr";
            }

            var classicLanguage = self.localStorage.getItem(classicLanguageKey);

            if (classicLanguage) {
                if (classicLanguage == "en") {
                    classicLanguageEn.classList.add("selected");
                } else if (classicLanguage == "fr") {
                    classicLanguageFr.classList.add("selected");
                } else if (classicLanguage == "es") {
                    classicLanguageEs.classList.add("selected");
                } else if (classicLanguage == "tl") {
                    classicLanguageTl.classList.add("selected");
                }
                // else if (classicLanguage == "de") {
                //     classicLanguageDe.classList.add("selected");
                // } else if (classicLanguage == "it") {
                //     classicLanguageIt.classList.add("selected");
                // } else if (classicLanguage == "pt") {
                //     classicLanguagePt.classList.add("selected");
                // }
            } else {
                //set to english the default language
                classicLanguageEn.classList.add('selected');
                classicLanguageInput.value = "en";
            }

            /*var soundButtonValue = self.localStorage.getItem(soundButtonValueKey);


            if (soundButtonValue != null) {

                var div = self.soundButton;

                if (soundButtonValue == true || soundButtonValue == "true") {
                    div.classList.remove("player_config_soundOFF");
                    div.classList.add("player_config_soundON");
                } else {
                    div.classList.remove("player_config_soundON");
                    div.classList.add("player_config_soundOFF");
                }
                self.setSoundButtonValue(soundButtonValue);
            } else {
                soundButton.value = self.getSoundButtonValue();
            }*/

            //disable retaining game mode selection
            /*var gameModeValue = self.localStorage.getItem(gameModeKey);
            if (gameModeValue) {
                console.log("game mode value exists...");
                gameModeSelected.value = gameModeValue;
                self.gameMode = gameModeValue;
                if (gameModeValue == "MarbbleClassic") {
                    self.showMarbbleClassicModeOptions();
                } else if (gameModeValue == "MarbbleOpen") {
                    self.showOpenModeOptions();
                } else {

                    self.showClassicModeOptions();

                }
            } else {
                //no value selected
                console.log("no value selected");
                if (self.gameMode == "MarbbleClassic") {
                    self.selectMarbbleClassicMode();
                } else if (self.gameMode == "MarbbleOpen") {
                    //self.marbbleOpenBtn.classList.add('active');
                    self.showOpenModeOptions();
                } else {
                    self.selectClassicMode();
                }
                gameModeSelected.value = self.gameMode;
            }*/


        }

    };
    self.startPlay = function() {
        if(self.gameMode == "MarbbleOpen" && self.gameType == "soloPlay") {
            var errorMessage = "Open & collaborative mode is not available for solo game";
            self.showErrorMessage(errorMessage);
            return;
        }

        if (self.localStorage.getItem("isImportGame") == "true") {
            var game = JSON.retrocycle(JSON.parse(self.localStorage.getItem("tempGame")));
            saveState(game);
            self.hideImportGameScreen();
            self.loadGame(false, game.gameId);
            self.localStorage.removeItem("tempGame");
            self.localStorage.removeItem("isImportGame");
            self.online = game.online;
        } else if (self.gameType == "onlineGame") {
            var playerLanguage = self.getOnlinePlayerLanguage();
            var opponentLanguage = self.getOnlineOpponentLanguage();
            var pseudo = document.getElementById("onlinePseudo").value;
            self.online = true;

            //TODO start smart search
            invite(pseudo, playerLanguage, opponentLanguage);
            self.hideGameModeScreen();
            document.querySelector("#mainMenu").style.display = 'none';
            // self.showNotImplementedPopup();
        } else {
            self.doStartPlay(true);
        }
    }

    self.doStartPlay = function(rebuild) {
        //temporarily disable for classic mode

        var player1Input = self.getPlayer1Input();
        var player2Input = self.getPlayer2Input();
        var player1LanguageInput = self.getPlayer1Language();
        var player2LanguageInput = self.getPlayer2Language();
        var classicLanguage = self.getClassicLanguage();
        self.classicLanguage = classicLanguage;
        var language = window.applanguage[_languageSet];

        if (self.gameMode == "Classic") {

            // self.showNotImplementedPopup();
            // return;
        }
        else if(self.gameMode == "MarbbleOpen") {

        }
        else if (self.gameMode == "MarbbleClassic" && rebuild) {

            //For MarbbleClassic, same language is not allowed for both players
            if (player1LanguageInput == player2LanguageInput) {
                var errorMessage = language.selectDifferentLanguage;
                self.showErrorMessage(errorMessage);
                return;
            }
        }

        //var soundButtonValue = self.getSoundButtonValue();

        var gameModeSelected = self.getGameModeSelected();

        var player1NameKey = 'player1Name';
        var player2NameKey = 'player2Name';
        var player1LanguageKey = 'player1Language';
        var player2LanguageKey = 'player2Language';
        var player1isComputerKey = 'player1isComputer';
        var player2isComputerKey = 'player2isComputer';
        var soundButtonValueKey = 'soundButtonKey';
        var gameModeKey = 'gameModeKey';
        var classicLanguageKey = 'classicLanguageKey';

        if (rebuild) {
            window.localStorage.removeItem("board");
            window.localStorage.removeItem("game");
        } else {
            self.gameMode = window.localStorage.getItem("gameModeKey");
            gameModeSelected = window.localStorage.getItem("gameModeKey");
            player1Input = window.localStorage.getItem("player1NameKey");
            player2Input = window.localStorage.getItem("player2NameKey");
            player1LanguageInput = window.localStorage.getItem("player1LanguageKey");
            player2LanguageInput = window.localStorage.getItem("player2LanguageKey");
            isComputer = window.localStorage.getItem("player2isComputerKey");
            soundButtonValue = window.localStorage.getItem("soundButtonKeyKey");
            classicLanguage = window.localStorage.getItem("classicLanguageKey");
        }
        if (self.localStorage) {


            if (player1Input) {
                self.localStorage.setItem(player1NameKey, player1Input);
            }

            if (player2Input) {
                self.localStorage.setItem(player2NameKey, player2Input);
            }

            if (player1LanguageInput) {
                self.localStorage.setItem(player1LanguageKey, player1LanguageInput);
            }

            if (player2LanguageInput) {
                self.localStorage.setItem(player2LanguageKey, player2LanguageInput);
            }

            if (gameModeSelected) {
                self.localStorage.setItem(gameModeKey, gameModeSelected);
            }

            if (classicLanguage) {
                self.localStorage.setItem(classicLanguageKey, classicLanguage);
            }

            var isComputer = self.gameType == 'soloPlay' ? true : false;

            self.localStorage.setItem(player1isComputerKey, false);

            self.localStorage.setItem(player2isComputerKey, isComputer);

            //self.localStorage.setItem(soundButtonValueKey, soundButtonValue);

            if (isComputer) {
                for (var i = 0; i < 5; i++) {
                    if (document.getElementById("size_" + (i + 1)).checked) {
                        self.localStorage.setItem("aiDifficulty", i);
                    }
                }
            }


            self.hideGameModeScreen();
            self.loadGame(rebuild);

        }
    };

    self.loadScriptsSync = function(scriptIds, _scripts, scripts) {
      //console.log("LOAD SCRIPTS SYNC");
        var x = 0;

        var loopArray = function(scriptIds, _scripts, scripts) {
            //call itself

            self.loadScript(scriptIds[x], _scripts[x], scripts[x], function() {
                // set x to next item
                x++;
                try {
                  if (x < _scripts.length) {
                      loopArray(scriptIds, _scripts, scripts);
                  } else {
                      self.src = [];
                      self.scriptIds = [];
                      gameControler.component.hideLoader();
                  }
                } catch(e) {
                    console.log(e);
                }
            });
        };
        loopArray(scriptIds, _scripts, scripts);
    };

    self.loadGame = function(rebuild, gameId) {
        self.mainMenuDiv.style.display = 'none';
        self.classicLanguage = self.getClassicLanguage();
        initMarbble('marbblescreen', self.gameMode, self.classicLanguage, gameId, self.online);
        self.loadDictionary(rebuild, gameId);
    };

    self.showLoginDialog = function() {
        if (self.loginDialog) {
            self.loginDialog.style.display = "block";
        }
    };

    self.hideLoginDialog = function() {

        if (self.loginDialog) {
            self.loginDialog.style.display = "none";
        }
    }

    self.showExitAppDialog = function() {
        if (self.exitAppPopupDiv) {
            self.exitAppPopupDiv.style.display = "block";
        }
    };

    self.hideExitAppDialog = function() {

        if (self.exitAppPopupDiv) {
            self.exitAppPopupDiv.style.display = "none";
        }
    }

    self.exitApp = function() {
        self.hideExitAppDialog();
        if (navigator && navigator.app) {
            navigator.app.exitApp();
        }

    };

    self.loadScript = function(id, src, script, callback) {
      try {
        var isRunningOnBrowser = window.__cordovaRunningOnBrowser__;

        if (!isRunningOnBrowser) {
            gameControler.component.showLoader();
        }

        script = document.createElement('script');
        var r, t = false;

        script.type = 'text/javascript';
        script.id = id;
        script.src = src;
        script.onerror = function(e) {
            // handling error when loading script
            //console.log('Error to handle');
            //console.log(e);
            gameControler.component.hideLoader();
        }

        script.onload = script.onreadystatechange = function() {
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                callback();
            }
        };

        t = document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1];
        //console.log("INSERT", script, t.nextSibling);
        t.parentNode.insertBefore(script, t.nextSibling);
      } catch(e) {
        console.log(e);
      }
    };


    self.loadDictionary = function(rebuild, gameId) {
      //console.log("load dictionary");
        var lang1 = self.getPlayer1Language();
        var lang2 = self.getPlayer2Language();
        if (rebuild) {
            lang1 = self.getPlayer1Language();
            lang2 = self.getPlayer2Language();
        } else {

            var savedGame = gameId ? getActiveGame(gameId) : null;

            lang1 = savedGame ? savedGame.players[0].lang : window.localStorage.getItem("player1Language");
            lang2 = savedGame ? savedGame.players[1].lang : window.localStorage.getItem("player2Language");

        }

        var src = "js/dic/full_" + lang1 + "_" + lang2 + ".js";

        var dictionaryId = 'dic_' + lang1 + '_' + lang2;
        var checkSrc = document.getElementById(dictionaryId);

        if (!checkSrc) {
            if (lang1 != lang2) {
                self.src.push(src);
                self.scriptIds.push(dictionaryId);
            }
        }


        src = "js/dic/full_" + lang2 + "_" + lang1 + ".js";
        dictionaryId = 'dic_' + lang2 + '_' + lang1;

        checkSrc = document.getElementById(dictionaryId);
        if (!checkSrc) {
            if (lang1 != lang2) {
                self.src.push(src);
                self.scriptIds.push(dictionaryId);
            }
        }

        src = "js/wordlist/full/" + lang1 + "_wordlist.js";
        var wordlistId = 'wordlist_' + lang1;

        checkSrc = document.getElementById(wordlistId);
        if (!checkSrc) {
            self.src.push(src);
            self.scriptIds.push(wordlistId);
        }

        src = "js/wordlist/full/" + lang2 + "_wordlist.js";
        wordlistId = 'wordlist_' + lang2;

        checkSrc = document.getElementById(wordlistId);
        if (!checkSrc) {
            self.src.push(src);
            self.scriptIds.push(wordlistId);
        }

        var scripts = [];

        if (self.scriptIds.length > 0) {
            self.loadScriptsSync(self.scriptIds, self.src, scripts);
            if(!window.marbbleDic[lang1][lang2]){
              console.error("NO TRANSLATION FILE AVAILABLE!");
              getTranslationPack(lang1,lang2)
            }
        }


    };

    self.enablePlayerLanguage = function(id) {
        var player1LanguageEn = document.getElementById("player1LanguageEn");
        var player1LanguageFr = document.getElementById("player1LanguageFr");
        var player1LanguageEs = document.getElementById("player1LanguageEs");
        var player1LanguageTl = document.getElementById("player1LanguageTl");
        var player2LanguageEn = document.getElementById("player2LanguageEn");
        var player2LanguageFr = document.getElementById("player2LanguageFr");
        var player2LanguageEs = document.getElementById("player2LanguageEs");
        var player2LanguageTl = document.getElementById("player2LanguageTl");

        player1LanguageEn.style.opacity = 1.0;
        player1LanguageFr.style.opacity = 1.0;
        player1LanguageEs.style.opacity = 1.0;
        player1LanguageTl.style.opacity = 1.0;

        player2LanguageEn.style.opacity = 1.0;
        player2LanguageFr.style.opacity = 1.0;
        player2LanguageEs.style.opacity = 1.0;
        player2LanguageTl.style.opacity = 1.0;
    };

    self.disablePlayerLanguage = function(id) {
        if(self.gameMode == "MarbbleOpen") {
            return;
        }
        var player1LanguageEn = document.getElementById("player1LanguageEn");
        var player1LanguageFr = document.getElementById("player1LanguageFr");
        var player1LanguageEs = document.getElementById("player1LanguageEs");
        var player1LanguageTl = document.getElementById("player1LanguageTl");
        var player2LanguageEn = document.getElementById("player2LanguageEn");
        var player2LanguageFr = document.getElementById("player2LanguageFr");
        var player2LanguageEs = document.getElementById("player2LanguageEs");
        var player2LanguageTl = document.getElementById("player2LanguageTl");

        var player1Language = document.getElementsByName("player1Language")[0];
        var player2Language = document.getElementsByName("player2Language")[0];

        self.enablePlayerLanguage();

        if (id == "player1LanguageEn") {
            player2LanguageEn.classList.remove("selected");
            player2LanguageEn.style.opacity = 0.5;
        } else if (id == "player1LanguageFr") {
            player2LanguageFr.classList.remove("selected");
            player2LanguageFr.style.opacity = 0.5;
        } else if (id == "player1LanguageEs") {
            player2LanguageEs.classList.remove("selected");
            player2LanguageEs.style.opacity = 0.5;
        } else if (id == "player1LanguageTl") {
            player2LanguageTl.classList.remove("selected");
            player2LanguageTl.style.opacity = 0.5;
        } else if (id == "player2LanguageEn") {
            player1LanguageEn.classList.remove("selected");
            player1LanguageEn.style.opacity = 0.5;
        } else if (id == "player2LanguageFr") {
            player1LanguageFr.classList.remove("selected");
            player1LanguageFr.style.opacity = 0.5;
        } else if (id == "player2LanguageEs") {
            player1LanguageEs.classList.remove("selected");
            player1LanguageEs.style.opacity = 0.5;
        } else if (id == "player2LanguageTl") {
            player1LanguageTl.classList.remove("selected");
            player1LanguageTl.style.opacity = 0.5;
        }

    };

    self.toggleClassicLanguage = function(e) {

        var div = e.target;
        var classicLanguage = document.getElementsByName("classicLanguage")[0];
        var classicLanguageEn = document.getElementById("classicLanguageEn");
        var classicLanguageFr = document.getElementById("classicLanguageFr");
        var classicLanguageEs = document.getElementById("classicLanguageEs");
        var classicLanguageTl = document.getElementById("classicLanguageTl");

        var isSelected = div.classList.contains('selected');

        if (div.id == "classicLanguageEn") {
            if (!isSelected) {
                div.classList.toggle("selected");
                classicLanguageFr.classList.remove("selected");
                classicLanguageEs.classList.remove("selected");
                classicLanguageTl.classList.remove("selected");
                classicLanguage.value = "en";
            }
        } else if (div.id == "classicLanguageFr") {
            if (!isSelected) {
                div.classList.toggle("selected");
                classicLanguageEn.classList.remove("selected");
                classicLanguageEs.classList.remove("selected");
                classicLanguageTl.classList.remove("selected");
                classicLanguage.value = "fr";
            }
        } else if (div.id == "classicLanguageEs") {
            if (!isSelected) {
                div.classList.toggle("selected");
                classicLanguageEn.classList.remove("selected");
                classicLanguageFr.classList.remove("selected");
                classicLanguageTl.classList.remove("selected");
                classicLanguage.value = "es";
            }
        } else if (div.id == "classicLanguageTl") {
            if (!isSelected) {
                div.classList.toggle("selected");
                classicLanguageEn.classList.remove("selected");
                classicLanguageFr.classList.remove("selected");
                classicLanguageEs.classList.remove("selected");
                classicLanguage.value = "tl";
            }
        }
    };

    self.selectArenaLanguage = function(e) {
        var div = e.target;
        var id = div.id;

        var arenaFlagEn = document.getElementsByName("arenaFlagEn")[0];
        var arenaFlagFr = document.getElementsByName("arenaFlagFr")[0];
        var arenaFlagEs = document.getElementsByName("arenaFlagEs")[0];
        var arenaFlagPh = document.getElementsByName("arenaFlagPh")[0];
        div.classList.toggle("selected");

    };

    self.toggleOnlineLanguage = function(e) {
        var div = e.target;
        var onlinePlayerLanguageEn = document.getElementById("onlinePlayerLanguageEn");
        var onlinePlayerLanguageFr = document.getElementById("onlinePlayerLanguageFr");
        var onlinePlayerLanguageEs = document.getElementById("onlinePlayerLanguageEs");
        var onlinePlayerLanguagePh = document.getElementById("onlinePlayerLanguageTl");
        var onlinePlayerLanguage = document.getElementsByName("onlinePlayerLanguage");
        var onlineOpponentLanguageEn = document.getElementById("onlineOpponentLanguageEn");
        var onlineOpponentLanguageFr = document.getElementById("onlineOpponentLanguageFr");
        var onlineOpponentLanguageEs = document.getElementById("onlineOpponentLanguageEs");
        var onlineOpponentLanguagePh = document.getElementById("onlineOpponentLanguageTl");
        var onlinePlayerLanguage = document.getElementById("onlinePlayerLanguage");
        var onlineOpponentLanguage = document.getElementById("onlineOpponentLanguage");

        var onlineClassicLanguageEn = document.getElementById("onlineClassicLanguageEn");
        var onlineClassicLanguageFr = document.getElementById("onlineClassicLanguageFr");
        var onlineClassicLanguageEs = document.getElementById("onlineClassicLanguageEs");
        var onlineClassicLanguagePh = document.getElementById("onlineClassicLanguageTl");
        var onlineClassicLanguage = document.getElementById("onlineClassicLanguage");

        if (div.id == "onlinePlayerLanguageEn") {
            div.classList.toggle("selected");
            onlinePlayerLanguageFr.classList.remove("selected");
            onlinePlayerLanguageEs.classList.remove("selected");
            onlinePlayerLanguagePh.classList.remove("selected");
            onlinePlayerLanguage.value = "en";
        } else if (div.id == "onlinePlayerLanguageFr") {
            div.classList.toggle("selected");
            onlinePlayerLanguageEn.classList.remove("selected");
            onlinePlayerLanguageEs.classList.remove("selected");
            onlinePlayerLanguagePh.classList.remove("selected");
            onlinePlayerLanguage.value = "fr";
        } else if (div.id == "onlinePlayerLanguageEs") {
            div.classList.toggle("selected");
            onlinePlayerLanguageEn.classList.remove("selected");
            onlinePlayerLanguageFr.classList.remove("selected");
            onlinePlayerLanguagePh.classList.remove("selected");
            onlinePlayerLanguage.value = "es";
        } else if (div.id == "onlinePlayerLanguageTl") {
            div.classList.toggle("selected");
            onlinePlayerLanguageEn.classList.remove("selected");
            onlinePlayerLanguageFr.classList.remove("selected");
            onlinePlayerLanguageEs.classList.remove("selected");
            onlinePlayerLanguage.value = "tl";
        }

        //opponent language
        if (div.id == "onlineOpponentLanguageEn") {
            div.classList.toggle("selected");
            onlineOpponentLanguageFr.classList.remove("selected");
            onlineOpponentLanguageEs.classList.remove("selected");
            onlineOpponentLanguagePh.classList.remove("selected");
            onlineOpponentLanguage.value = "en";
        } else if (div.id == "onlineOpponentLanguageFr") {
            div.classList.toggle("selected");
            onlineOpponentLanguageEn.classList.remove("selected");
            onlineOpponentLanguageEs.classList.remove("selected");
            onlineOpponentLanguagePh.classList.remove("selected");
            onlineOpponentLanguage.value = "fr";
        } else if (div.id == "onlineOpponentLanguageEs") {
            div.classList.toggle("selected");
            onlineOpponentLanguageEn.classList.remove("selected");
            onlineOpponentLanguageFr.classList.remove("selected");
            onlineOpponentLanguagePh.classList.remove("selected");
            onlineOpponentLanguage.value = "es";
        } else if (div.id == "onlineOpponentLanguageTl") {
            div.classList.toggle("selected");
            onlineOpponentLanguageEn.classList.remove("selected");
            onlineOpponentLanguageFr.classList.remove("selected");
            onlineOpponentLanguageEs.classList.remove("selected");
            onlineOpponentLanguage.value = "tl";
        }

        if (self.gameMode == "Classic") {
            if (div.id == "onlineClassicLanguageEn") {
                div.classList.toggle("selected");
                onlineClassicLanguageFr.classList.remove("selected");
                onlineClassicLanguageEs.classList.remove("selected");
                onlineClassicLanguagePh.classList.remove("selected");
                onlineClassicLanguage.value = "en";
            } else if (div.id == "onlineClassicLanguageFr") {
                div.classList.toggle("selected");
                onlineClassicLanguageEn.classList.remove("selected");
                onlineClassicLanguageEs.classList.remove("selected");
                onlineClassicLanguagePh.classList.remove("selected");
                onlineClassicLanguage.value = "fr";
            } else if (div.id == "onlineClassicLanguageEs") {
                div.classList.toggle("selected");
                onlineClassicLanguageEn.classList.remove("selected");
                onlineClassicLanguageFr.classList.remove("selected");
                onlineClassicLanguagePh.classList.remove("selected");
                onlineClassicLanguage.value = "es";
            } else if (div.id == "onlineClassicLanguageTl") {
                div.classList.toggle("selected");
                onlineClassicLanguageEn.classList.remove("selected");
                onlineClassicLanguageFr.classList.remove("selected");
                onlineClassicLanguageEs.classList.remove("selected");
                onlineClassicLanguage.value = "tl";
            }

        }

    };


    self.toggleSelectedLanguage = function(e) {
        var div = e.target;
        var player1Language = document.getElementsByName("player1Language")[0];
        var player2Language = document.getElementsByName("player2Language")[0];
        var player1LanguageEn = document.getElementById("player1LanguageEn");
        var player1LanguageFr = document.getElementById("player1LanguageFr");
        var player1LanguageEs = document.getElementById("player1LanguageEs");
        var player1LanguageTl = document.getElementById("player1LanguageTl");
        // var player1LanguageDe = document.getElementById("player1LanguageDe");
        // var player1LanguageIt = document.getElementById("player1LanguageIt");
        // var player1LanguagePt = document.getElementById("player1LanguagePt");
        var player2LanguageEn = document.getElementById("player2LanguageEn");
        var player2LanguageFr = document.getElementById("player2LanguageFr");
        var player2LanguageEs = document.getElementById("player2LanguageEs");
        var player2LanguageTl = document.getElementById("player2LanguageTl");
        // var player2LanguageDe = document.getElementById("player2LanguageDe");
        // var player2LanguageIt = document.getElementById("player2LanguageIt");
        // var player2LanguagePt = document.getElementById("player2LanguagePt");

        // var player2Languages = document.getElementById("player2_language_config");
        // var selectedLanguageP2 = player2Languages.getElementsByClassName("example");

        var isSelected = div.classList.contains('selected');

        if (div.id == "player1LanguageFr") {
            if (!isSelected) {
                div.classList.toggle("selected");
                player1LanguageEn.classList.remove("selected");
                player1LanguageEs.classList.remove("selected");
                player1LanguageTl.classList.remove("selected");
                // player1LanguageDe.classList.remove("selected");
                // player1LanguageIt.classList.remove("selected");
                // player1LanguagePt.classList.remove("selected");
                player1Language.value = "fr";
                self.disablePlayerLanguage(div.id);
            }

        } else if (div.id == "player1LanguageEn") {
            if (!isSelected) {
                div.classList.toggle("selected");
                player1LanguageFr.classList.remove("selected");
                player1LanguageEs.classList.remove("selected");
                player1LanguageTl.classList.remove("selected");
                // player1LanguageDe.classList.remove("selected");
                // player1LanguageIt.classList.remove("selected");
                // player1LanguagePt.classList.remove("selected");
                player1Language.value = "en";
                self.disablePlayerLanguage(div.id);
            }
        } else if (div.id == "player1LanguageEs") {
            if (!isSelected) {
                div.classList.toggle("selected");
                player1LanguageFr.classList.remove("selected");
                player1LanguageEn.classList.remove("selected");
                player1LanguageTl.classList.remove("selected");
                // player1LanguageDe.classList.remove("selected");
                // player1LanguageIt.classList.remove("selected");
                // player1LanguagePt.classList.remove("selected");
                player1Language.value = "es";
                self.disablePlayerLanguage(div.id);
            }
        } else if (div.id == "player1LanguageTl") {
            if (!isSelected) {
                div.classList.toggle("selected");
                player1LanguageFr.classList.remove("selected");
                player1LanguageEn.classList.remove("selected");
                player1LanguageEs.classList.remove("selected");
                // player1LanguageDe.classList.remove("selected");
                // player1LanguageIt.classList.remove("selected");
                // player1LanguagePt.classList.remove("selected");
                player1Language.value = "tl";
                self.disablePlayerLanguage(div.id);
            }
        }
        // else if (div.id == "player1LanguageDe") {
        //     if (!isSelected) {
        //         div.classList.toggle("selected");
        //         player1LanguageFr.classList.remove("selected");
        //         player1LanguageEn.classList.remove("selected");
        //         player1LanguageEs.classList.remove("selected");
        //         player1LanguageTl.classList.remove("selected");
        //         player1LanguageIt.classList.remove("selected");
        //         player1LanguagePt.classList.remove("selected");
        //         player1Language.value = "de";
        //         self.disablePlayerLanguage(div.id);
        //     }
        // } else if (div.id == "player1LanguageIt") {
        //     if (!isSelected) {
        //         div.classList.toggle("selected");
        //         player1LanguageFr.classList.remove("selected");
        //         player1LanguageEn.classList.remove("selected");
        //         player1LanguageEs.classList.remove("selected");
        //         player1LanguageDe.classList.remove("selected");
        //         player1LanguageTl.classList.remove("selected");
        //         player1LanguagePt.classList.remove("selected");
        //         player1Language.value = "it";
        //         self.disablePlayerLanguage(div.id);
        //     }
        // } else if (div.id == "player1LanguagePt") {
        //     if (!isSelected) {
        //         div.classList.toggle("selected");
        //         player1LanguageFr.classList.remove("selected");
        //         player1LanguageEn.classList.remove("selected");
        //         player1LanguageEs.classList.remove("selected");
        //         player1LanguageDe.classList.remove("selected");
        //         player1LanguageIt.classList.remove("selected");
        //         player1LanguageTl.classList.remove("selected");
        //         player1Language.value = "pt";
        //         self.disablePlayerLanguage(div.id);
        //     }
        // }
        else if (div.id == "player2LanguageFr") {
            if (!isSelected) {
                div.classList.toggle("selected");
                player2LanguageEn.classList.remove("selected");
                player2LanguageEs.classList.remove("selected");
                player2LanguageTl.classList.remove("selected");
                // player2LanguageDe.classList.remove("selected");
                // player2LanguageIt.classList.remove("selected");
                // player2LanguagePt.classList.remove("selected");
                player2Language.value = "fr";
                self.disablePlayerLanguage(div.id);
            }
        } else if (div.id == "player2LanguageEn") {
            if (!isSelected) {
                div.classList.toggle("selected");
                player2LanguageFr.classList.remove("selected");
                player2LanguageEs.classList.remove("selected");
                player2LanguageTl.classList.remove("selected");
                // player2LanguageDe.classList.remove("selected");
                // player2LanguageIt.classList.remove("selected");
                // player2LanguagePt.classList.remove("selected");
                player2Language.value = "en";
                self.disablePlayerLanguage(div.id);
            }
        } else if (div.id == "player2LanguageEs") {
            if (!isSelected) {
                div.classList.toggle("selected");
                player2LanguageFr.classList.remove("selected");
                player2LanguageEn.classList.remove("selected");
                player2LanguageTl.classList.remove("selected");
                // player2LanguageDe.classList.remove("selected");
                // player2LanguageIt.classList.remove("selected");
                // player2LanguagePt.classList.remove("selected");
                player2Language.value = "es";
                self.disablePlayerLanguage(div.id);
            }
        } else if (div.id == "player2LanguageTl") {
            if (!isSelected) {
                div.classList.toggle("selected");
                player2LanguageFr.classList.remove("selected");
                player2LanguageEn.classList.remove("selected");
                player2LanguageEs.classList.remove("selected");
                // player2LanguageDe.classList.remove("selected");
                // player2LanguageIt.classList.remove("selected");
                // player2LanguagePt.classList.remove("selected");
                player2Language.value = "tl";
                self.disablePlayerLanguage(div.id);
            }
        }
      //   else if (div.id == "player2LanguageDe") {
      //       if (!isSelected) {
      //           div.classList.toggle("selected");
      //           player2LanguageFr.classList.remove("selected");
      //           player2LanguageEn.classList.remove("selected");
      //           player2LanguageEs.classList.remove("selected");
      //           player2LanguageTl.classList.remove("selected");
      //           player2LanguageIt.classList.remove("selected");
      //           player2LanguagePt.classList.remove("selected");
      //           player2Language.value = "de";
      //           self.disablePlayerLanguage(div.id);
      //       }
      //   }
      //   else if (div.id == "player2LanguageIt") {
      //      if (!isSelected) {
      //          div.classList.toggle("selected");
      //          player2LanguageFr.classList.remove("selected");
      //          player2LanguageEn.classList.remove("selected");
      //          player2LanguageEs.classList.remove("selected");
      //          player2LanguageTl.classList.remove("selected");
      //          player2LanguageDe.classList.remove("selected");
      //          player2LanguagePt.classList.remove("selected");
      //          player2Language.value = "it";
      //          self.disablePlayerLanguage(div.id);
      //      }
      //  }
      //  else if (div.id == "player2LanguagePt") {
      //     if (!isSelected) {
      //         div.classList.toggle("selected");
      //         player2LanguageFr.classList.remove("selected");
      //         player2LanguageEn.classList.remove("selected");
      //         player2LanguageEs.classList.remove("selected");
      //         player2LanguageTl.classList.remove("selected");
      //         player2LanguageIt.classList.remove("selected");
      //         player2LanguageDe.classList.remove("selected");
      //         player2Language.value = "pt";
      //         self.disablePlayerLanguage(div.id);
      //     }
      // }
    };

    self.setLanguage = function(lang) {
        var activatedLanguagesDiv = document.getElementById("activatedLanguages");
        if (activatedLanguagesDiv) {
            activatedLanguagesDiv.innerHTML = lang;
        }
    };

    self.showErrorMessage = function(message) {
        var errorMessagePopupDiv = document.getElementById("showModalDialog");
        var messageDiv = document.getElementById('messageText');

        if (errorMessagePopupDiv) {
            _windowOpened = 'errorMessageWindow';
            messageDiv.innerHTML = message;
            errorMessagePopupDiv.style.display = "block";

            //play sound
            self.sound.openPopupInGame();
        }
    };

    self.showMessage = function(message) {
        var genericMessagePopupDiv = document.getElementById("genericShowModalDialog");
        var messageDiv = document.getElementById('genericMessageText');
        if (genericMessagePopupDiv) {
            _windowOpened = 'genericMessageWindow';
            messageDiv.innerHTML = message;
            genericMessagePopupDiv.style.display = "block";

            //play sound
            self.sound.openPopupInGame();
        }
    };

    self.showConfirmDeletePopup = function() {
        var deleteGamePopup = document.getElementById("deleteGameModalDialog");
        var messageDiv = document.getElementById('messageText');

        if (deleteGamePopup) {
            _windowOpened = 'confirmDeleteGame';
            messageDiv.innerHTML = "Are you sure you want to remove the game?";
            deleteGamePopup.style.display = "block";

            //play sound
            self.sound.openPopupInGame();
        }
    };

    self.removeGame = function() {
        if (self.gameIdToDelete) {
            //console.log("removing game id: " + self.gameIdToDelete);
            removeFromGamesList(self.gameIdToDelete);
            self.reloadGamesList();
            self.hideDeletePopup();
        }
    };

    self.hideDeletePopup = function() {
        var deleteGamePopup = document.getElementById("deleteGameModalDialog");

        if (deleteGamePopup) {
            self.gameIdToDelete = null;
            deleteGamePopup.style.display = "none";
            _windowOpened = 'mainMenuWindow';
            //play sound
            self.sound.openPopupInGame();
        }
    };

    self.showNotImplementedPopup = function(e) {
        if (_languageSet == null) {
            self.getAppLanguage();
            self.updateGameTexts();
            self.updateGameButtonLocale();
        }
        var notImplementedPopupDiv = document.getElementById("showModalDialog");
        var messageDiv = document.getElementById('messageText');
        var language = window.applanguage[_languageSet];
        var notAvailableTxt = language.notyetavailable;
        var helpImplementTxt = language.helpusimplement;


        messageDiv.innerHTML = notAvailableTxt + ", <a id='tipeeeLink' href='https://www.tipeee.com/manatygames' class='url' target='blank'>" + helpImplementTxt + "</a>.";

        if (notImplementedPopupDiv) {
            _windowOpened = 'notImplementedWindow';

            notImplementedPopupDiv.style.display = "block";

            //play sound
            self.sound.openPopupInGame();
        }
    };

    self.hideNotImplementedPopup = function(e) {
        var notImplementedPopupDiv = document.getElementById("showModalDialog");

        if (notImplementedPopupDiv) {
            _windowOpened = 'mainMenuWindow';

            notImplementedPopupDiv.style.display = "none";

            //play sound
            self.sound.openPopupInGame();
        }
    };

    self.openCredits = function(e) {

        self.mainMenuDiv.style.display = 'none';
        self.creditsScreen.style.display = 'block';
    };

    self.backToMainMenu = function(e) {
        var loginScreen = document.getElementById('loginScreen');
        if (loginScreen) {
            loginScreen.style.display = 'none';
        }

        self.creditsScreen.style.display = 'none';
        self.onlineInterface.style.display = 'none';
        self.mainMenuDiv.style.display = 'block';

    };

    self.backToSettings = function(e) {
        var registerScreen = document.getElementById('settingsRegisterScreen');
        if (registerScreen) {
            registerScreen.style.display = 'none';
        }
        self.mainMenuDiv.style.display = 'block';

    };

    self.backToOnlineScreen = function(e) {
        self.arenaInterface.style.display = 'none';
        self.onlineInterface.style.display = 'block';
    };

    self.soloPlaySelected = function(e) {
        self.gameType = "soloPlay";
        self.localStorage.setItem("soloPlay", true);
        self.localStorage.setItem("edit", false);
        self.online = false;
        self.showGameModeScreen();
    }

    self.passAndPlaySelected = function(e) {
        self.gameType = "passAndPlay";
        self.localStorage.setItem("soloPlay", false);
        self.localStorage.setItem("edit", false);
        self.online = false;
        self.showGameModeScreen();
    };

    self.editSoloPlaySelected = function(e) {
        self.gameType = "soloPlay";
        self.localStorage.setItem("soloPlay", true);
        self.localStorage.setItem("edit", true);
        self.showGameModeScreen();
    }

    self.editPassAndPlaySelected = function(e) {
        self.gameType = "passAndPlay";
        self.localStorage.setItem("soloPlay", false);
        self.localStorage.setItem("edit", true);
        self.showGameModeScreen();
    };

    self.showGameModeScreen = function(e) {
        if (_languageSet == null) {
            self.getAppLanguage();
            self.updateGameTexts();
            self.updateGameButtonLocale();
        }

        var language = window.applanguage[_languageSet];

        var gameConfigHeaderDiv = document.getElementById("gameConfigHeader");
        var player1TextDiv = document.getElementById('player1Txt');
        var headerPlayer2Div = document.getElementById("headerPlayer2");
        var classicLanguageHeaderDiv = document.getElementById("classicLanguageHeader");
        var player2NameInputDiv = document.getElementById("player2NameInput");
        var difficultySelectionDiv = document.getElementById("difficultySelection");
        var difficultyTextDiv = document.getElementById('difficultyTxt');

        //online parameters
        var onlineGameDiv = document.getElementById("onlineGame");
        var offlineGameDiv = document.getElementById("offlineGame");
        var onlinePseudoInputDiv = document.getElementById("onlinePseudo");

        var onlinePlayerLanguageEn = document.getElementById("onlinePlayerLanguageEn");
        var onlinePlayerLanguageFr = document.getElementById("onlinePlayerLanguageFr");
        var onlinePlayerLanguageEs = document.getElementById("onlinePlayerLanguageEs");
        var onlinePlayerLanguagePh = document.getElementById("onlinePlayerLanguageTl");

        var onlineOpponentLanguageEn = document.getElementById("onlineOpponentLanguageEn");
        var onlineOpponentLanguageFr = document.getElementById("onlineOpponentLanguageFr");
        var onlineOpponentLanguageEs = document.getElementById("onlineOpponentLanguageEs");
        var onlineOpponentLanguagePh = document.getElementById("onlineOpponentLanguageTl");

        var onlineClassicLanguageEn = document.getElementById("onlineClassicLanguageEn");
        var onlineClassicLanguageFr = document.getElementById("onlineClassicLanguageFr");
        var onlineClassicLanguageEs = document.getElementById("onlineClassicLanguageEs");
        var onlineClassicLanguagePh = document.getElementById("onlineClassicLanguageTl");

        self.marbbleOpenBtn.style.display = "block";
        self.marbbleClassicBtn.classList.add('marbble-classic-btn');
        self.marbbleClassicBtn.classList.remove('marbble-classic-btn-2-col');
        self.classicBtn.classList.add('classic-btn');
        self.classicBtn.classList.remove('classic-btn-2-col');

        self.hideGameModeContent();

        if (self.gameType == "passAndPlay") {
            self.marbbleOpenBtn.style.opacity = "1";
            onlineGameDiv.style.display = "none";
            offlineGameDiv.style.display = "block";
            gameConfigHeaderDiv.innerHTML = language.passDeviceToPlay;
            player2NameInputDiv.style.display = "block";
            difficultySelectionDiv.style.display = "none";
            player1TextDiv.innerHTML = language.definePlayerPseudoLanguage.replace("{x}", "1");
            headerPlayer2Div.innerHTML = language.definePlayerPseudoLanguage.replace("{x}", "2");

            if(self.gameMode == "Classic") {
                classicLanguageHeaderDiv.innerHTML = language.selectGameLanguage;
            }

        } else if (self.gameType == "onlineGame") {
            self.marbbleOpenBtn.style.opacity = "1";
            offlineGameDiv.style.display = "none";
            onlineGameDiv.style.display = "block";
            gameConfigHeaderDiv.innerHTML = "New game against a random player";
            onlinePseudoInputDiv.value = self.loggedPlayerProfile ? self.loggedPlayerProfile.pseudo : '';
            //player language
            onlinePlayerLanguageEn.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.en == true) ? "block" : "none";
            onlinePlayerLanguageFr.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.fr == true) ? "block" : "none";
            onlinePlayerLanguageEs.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.es == true) ? "block" : "none";
            onlinePlayerLanguagePh.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.ph == true) ? "block" : "none";

            //opponent language
            onlineOpponentLanguageEn.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.en == true) ? "block" : "none";
            onlineOpponentLanguageFr.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.fr == true) ? "block" : "none";
            onlineOpponentLanguageEs.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.es == true) ? "block" : "none";
            onlineOpponentLanguagePh.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.ph == true) ? "block" : "none";

            //classic language
            onlineClassicLanguageEn.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.en == true) ? "block" : "none";
            onlineClassicLanguageFr.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.fr == true) ? "block" : "none";
            onlineClassicLanguageEs.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.es == true) ? "block" : "none";
            onlineClassicLanguagePh.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.ph == true) ? "block" : "none";


        } else {
            self.marbbleOpenBtn.style.opacity = "0.5";
            onlineGameDiv.style.display = "none";
            offlineGameDiv.style.display = "block";
            gameConfigHeaderDiv.innerHTML = language.playAgainstComputer;
            player1TextDiv.innerHTML = language.definePlayerPseudoLanguage.replace("{x}", "1");
            headerPlayer2Div.innerHTML = language.defineComputerLanguage;
            player2NameInputDiv.style.display = "none";
            difficultySelectionDiv.style.display = "block";
            document.getElementById("size_1").checked = true;
            for (var i = 0; i < 5; i++) {
                if (self.localStorage.getItem("aiDifficulty") == i) {
                    document.getElementById("size_" + (i + 1)).checked = true;
                }
            }

            if(self.gameType == "soloPlay") {
                self.marbbleOpenBtn.style.display = "none";
                self.marbbleClassicBtn.classList.remove('marbble-classic-btn');
                self.marbbleClassicBtn.classList.add('marbble-classic-btn-2-col');
                self.classicBtn.classList.remove('classic-btn');
                self.classicBtn.classList.add('classic-btn-2-col');
                difficultyTextDiv.innerHTML = language.difficulty;
            }

        }


        _windowOpened = 'gameConfigPopupWindow';


        self.mainMenuDiv.style.display = 'none';
        self.gameModeScreen.style.display = "block";
        self.setPlayerInfoFromStorage();
        self.sound.openPopupInGame();

        //play sound
        self.sound.openPopupInGame();

        if (self.localStorage.getItem("edit") == "true") {
            document.getElementById("player1LanguageRow").style.display = "none";
            document.getElementById("player2LanguageRow").style.display = "none";
            document.getElementById("game-mode-button-container").style.display = "none";
        } else if (self.localStorage.getItem("edit") == "true" && self.gamePlay == "passAndPlay") {
            document.getElementById("player1LanguageRow").style.display = "block";
            document.getElementById("player2LanguageRow").style.display = "block";
            document.getElementById("game-mode-button-container").style.display = "block";
        }

    };

    self.hideGameModeScreen = function(e) {
        self.gameModeScreen.style.display = "none";
        self.mainMenuDiv.style.display = 'block';

        _windowOpened = 'mainMenuWindow';

        //play sound
        self.sound.openPopupInGame();
    };

    self.showGameConfigPopup = function(e) {
        self.toggleGameMode(document.getElementById("passAndPlayTab"));
        var gameConfigPopupDiv = document.getElementById("gameConfigModal");

        self.setPlayerInfoFromStorage();
        self.localStorage.setItem("soloPlay", false);
        if (gameConfigPopupDiv) {
            _windowOpened = 'gameConfigPopupWindow';

            gameConfigPopupDiv.style.display = "block";

            //play sound
            self.sound.openPopupInGame();
        }
    };



    self.showGameConfigPopupSolo = function(e) {
        self.toggleGameMode(document.getElementById("playAgainstComputerTab"));
        var gameConfigPopupDiv = document.getElementById("gameConfigModal");

        self.setPlayerInfoFromStorage();
        self.localStorage.setItem("soloPlay", true);
        if (gameConfigPopupDiv) {
            _windowOpened = 'gameConfigPopupWindow';

            gameConfigPopupDiv.style.display = "block";

            //play sound
            self.sound.openPopupInGame();
        }
    };

    self.hideGameConfigPopup = function(e) {
        var gameConfigPopupDiv = document.getElementById("gameConfigModal");

        if (gameConfigPopupDiv) {
            _windowOpened = 'mainMenuWindow';

            gameConfigPopupDiv.style.display = "none";

            //play sound
            self.sound.openPopupInGame();
        }
    };

    self.showMarbbleClassicModeOptions = function(e) {

        self.gameModeIcon.classList.remove('classic-icon');
        self.gameModeIcon.classList.remove('marbble-open-icon');
        self.gameModeIcon.classList.add('marbble-classic-icon');

        var language = window.applanguage[_languageSet];

        var player1TextDiv = document.getElementById('player1Txt');
        var headerPlayer2Div = document.getElementById("headerPlayer2");
        var classicLanguageHeaderDiv = document.getElementById('classicLanguageHeader');
        classicLanguageHeaderDiv.style.display = "none";

        if(self.gameType == "passAndPlay") {
            player1TextDiv.innerHTML = language.definePlayerPseudoLanguage.replace("{x}", "1");
            headerPlayer2Div.innerHTML = language.definePlayerPseudoLanguage.replace("{x}", "2");

        }
        else if(self.gameType == "soloPlay") {
            player1TextDiv.innerHTML = language.definePseudoAndLanguage;
            headerPlayer2Div.innerHTML = language.defineComputerLanguage;
        }

        self.gameMode = "MarbbleClassic";
        self.gameModeText.innerHTML = language.marbbleClassic;
        self.setActiveMode(self.marbbleClassicBtn);
        var player1LanguageRow = document.getElementById('player1LanguageRow');
        var player2LanguageRow = document.getElementById('player2LanguageRow');
        var classicLanguageRow = document.getElementById('classicLanguageRow');

        if (player1LanguageRow) {
            player1LanguageRow.style.display = "block";
        }
        if (player2LanguageRow) {
            player2LanguageRow.style.display = "block";
        }

        if (classicLanguageRow) {
            classicLanguageRow.style.display = "none";
        }

        if (self.isLoggedIn() && self.gameType == "onlineGame") {
            if (self.getActiveLanguagesCount() <= 1) {
                self.showActivateLanguages();
            } else {

                var onlinePlayerLanguageRow = document.getElementById('onlinePlayerLanguageRow');
                var onlineOpponentLanguageRow = document.getElementById('onlineOpponentLanguageRow');
                var onlineClassicLanguageRow = document.getElementById('onlineClassicLanguageRow');

                if (onlinePlayerLanguageRow) {
                    onlinePlayerLanguageRow.style.display = "block";
                }

                if (onlineOpponentLanguageRow) {
                    onlineOpponentLanguageRow.style.display = "block";
                }

                if (onlineClassicLanguageRow) {
                    onlineClassicLanguageRow.style.display = "none";
                }

                self.hideActivateLanguages();
            }
        } else {
            self.hideActivateLanguages();
        }


        self.gamePlayBtn.style.opacity = 1.0;
    };

    self.selectMarbbleClassicMode = function(e) {
        self.gameMode = "MarbbleClassic";

        var gameModeSelected = document.getElementById("gameModeSelected");
        if (gameModeSelected) {
            gameModeSelected.value = self.gameMode;
        }

        self.displayGameModeContent();

        self.showMarbbleClassicModeOptions();

    };

    self.setActiveMode = function(div) {

        self.marbbleClassicBtn.classList.remove('active');
        self.marbbleOpenBtn.classList.remove('active');
        self.classicBtn.classList.remove('active');
        div.classList.toggle('active');

    };

    self.selectOpenMode = function(e) {
        if(self.gameType == "soloPlay") {
            var errorMessage = "This mode is not available against computer";
            self.showErrorMessage(errorMessage);
            return;
        }

        self.gameMode = "MarbbleOpen";

        var gameModeSelected = document.getElementById("gameModeSelected");
        if (gameModeSelected) {
            gameModeSelected.value = self.gameMode;
        }

        self.displayGameModeContent();

        self.showOpenModeOptions();

    };

    self.showClassicModeOptions = function(e) {
        self.gameModeIcon.classList.remove('marbble-classic-icon');
        self.gameModeIcon.classList.remove('marbble-open-icon');
        self.gameModeIcon.classList.add('classic-icon');

        var language = window.applanguage[_languageSet];

        var player1TextDiv = document.getElementById('player1Txt');
        var headerPlayer2Div = document.getElementById("headerPlayer2");
        var classicLanguageHeaderDiv = document.getElementById("classicLanguageHeader");



        if(self.gameType == "passAndPlay") {
            player1TextDiv.innerHTML = language.definePlayerPseudo.replace("{x}", "1");
            headerPlayer2Div.innerHTML = language.definePlayerPseudo.replace("{x}", "2");
            classicLanguageHeaderDiv.style.display = "block";
            classicLanguageHeaderDiv.innerHTML = language.selectGameLanguage;
        }
        else if(self.gameType == "soloPlay") {
            player1TextDiv.innerHTML = language.defineSoloClassicPseudoAndLanguage;
            headerPlayer2Div.innerHTML = language.defineComputerDifficulty;
            classicLanguageHeaderDiv.style.display = "none";
        }


        self.gameModeText.innerHTML = language.classicMode;
        self.setActiveMode(self.classicBtn);
        var player1LanguageRow = document.getElementById('player1LanguageRow');
        var player2LanguageRow = document.getElementById('player2LanguageRow');
        var classicLanguageRow = document.getElementById('classicLanguageRow');
        if (player1LanguageRow) {
            player1LanguageRow.style.display = "none";
        }
        if (player2LanguageRow) {
            player2LanguageRow.style.display = "none";
        }

        if (classicLanguageRow) {
            classicLanguageRow.style.display = "block";
        }

        if (self.isLoggedIn() && self.gameType == "onlineGame") {

            var onlinePlayerLanguageRow = document.getElementById('onlinePlayerLanguageRow');
            var onlineOpponentLanguageRow = document.getElementById('onlineOpponentLanguageRow');
            var onlineClassicLanguageRow = document.getElementById('onlineClassicLanguageRow');

            if (onlinePlayerLanguageRow) {
                onlinePlayerLanguageRow.style.display = "none";
            }

            if (onlineOpponentLanguageRow) {
                onlineOpponentLanguageRow.style.display = "none";
            }

            if (onlineClassicLanguageRow) {
                onlineClassicLanguageRow.style.display = "block";
            }

            self.hideActivateLanguages();
        }

        //self.gamePlayBtn.style.opacity = 0.5;
    };

    self.selectClassicMode = function(e) {
        self.gameMode = "Classic";

        var gameModeSelected = document.getElementById("gameModeSelected");
        if (gameModeSelected) {
            gameModeSelected.value = self.gameMode;
        }

        self.displayGameModeContent();

        self.showClassicModeOptions();

    };

    self.showOpenModeOptions = function() {
        self.gameModeIcon.classList.remove('classic-icon');
        self.gameModeIcon.classList.remove('marbble-classic-icon');
        self.gameModeIcon.classList.add('marbble-open-icon');

        var language = window.applanguage[_languageSet];

        var player1TextDiv = document.getElementById('player1Txt');
        var headerPlayer2Div = document.getElementById("headerPlayer2");
        var classicLanguageHeaderDiv = document.getElementById("classicLanguageHeader");

        classicLanguageHeaderDiv.style.display = "none";

        if(self.gameType == "passAndPlay") {
            player1TextDiv.innerHTML = language.definePlayerPseudoLanguage.replace("{x}", "1");
            headerPlayer2Div.innerHTML = language.definePlayerPseudoLanguage.replace("{x}", "2");
        }

        self.gameModeText.innerHTML = language.openMode;

        self.enablePlayerLanguage();
        self.setActiveMode(self.marbbleOpenBtn);
        var player1LanguageRow = document.getElementById('player1LanguageRow');
        var player2LanguageRow = document.getElementById('player2LanguageRow');
        var classicLanguageRow = document.getElementById('classicLanguageRow');

        if (player1LanguageRow) {
            player1LanguageRow.style.display = "block";
        }
        if (player2LanguageRow) {
            player2LanguageRow.style.display = "block";
        }

        if (classicLanguageRow) {
            classicLanguageRow.style.display = "none";
        }

        if (self.isLoggedIn() && self.gameType == "onlineGame") {
            if (self.getActiveLanguagesCount() <= 1) {
                self.showActivateLanguages();
            } else {

                var onlinePlayerLanguageRow = document.getElementById('onlinePlayerLanguageRow');
                var onlineOpponentLanguageRow = document.getElementById('onlineOpponentLanguageRow');
                var onlineClassicLanguageRow = document.getElementById('onlineClassicLanguageRow');

                if (onlinePlayerLanguageRow) {
                    onlinePlayerLanguageRow.style.display = "block";
                }

                if (onlineOpponentLanguageRow) {
                    onlineOpponentLanguageRow.style.display = "block";
                }

                if (onlineClassicLanguageRow) {
                    onlineClassicLanguageRow.style.display = "none";
                }

                self.hideActivateLanguages();
            }
        } else {
            self.hideActivateLanguages();
        }


        self.gamePlayBtn.style.opacity = 1.0;
    };

    /**
     * Get local storage. Return null if it cannot be supported
     */
    self.getSupportedLocalStorage = function() {
        try {
            var localStorage = window.localStorage;
            var testKey = 'isLocalStorageSupported';
            localStorage.setItem(testKey, '1');
            localStorage.removeItem(testKey);
            return localStorage;
        } catch (error) {
            //console.log(error);
            //console.log("Local storage may not be supported");
            return null;
        }
    }

    self.startManatySplash = function() {
        var isRunningOnBrowser = window.__cordovaRunningOnBrowser__;

        if (!isRunningOnBrowser) {
            if (/Android/i.test(navigator.userAgent)) {
                self.manatySplashScreen.classList.add('displaySplashScreen');
                setTimeout(self.startMarbbleSplash, 3000);
            } else if (/iPhone|iPod/i.test(navigator.userAgent)) {
                self.marbbleSplashScreen.classList.add('displaySplashScreen');
                setTimeout(function(e) {
                    self.marbbleSplashScreen.classList.remove('displaySplashScreen');
                    //self.marbbleSplashScreen.classList.add('hideSplashScreen');
                    self.mainMenuDiv.classList.add('displayNextPage');
                }, 3000);


            } else {
                self.mainMenuDiv.style.display = 'block';
            }
        } else {
            self.mainMenuDiv.style.display = 'block';
        }
    }

    self.startMarbbleSplash = function() {
        self.manatySplashScreen.classList.remove('displaySplashScreen');
        self.manatySplashScreen.classList.add('hideSplashScreen');
        self.marbbleSplashScreen.classList.add('displaySplashScreen');

        setTimeout(function(e) {
            self.marbbleSplashScreen.classList.remove('displaySplashScreen');
            //self.marbbleSplashScreen.classList.add('hideSplashScreen');
            self.mainMenuDiv.classList.add('displayNextPage');
        }, 3000);

    }

    self.tipeeeLinkClick = function() {
        var ref = cordova.InAppBrowser.open('https://www.tipeee.com/manatygames', '_system', 'location=yes', 'hardwareback=no');
    }

    self.getPreferredLanguageSuccessCallback = function(language) {

        //console.log("raw language value: " + language.value);
        if (language.value.indexOf('fr') != -1) {
            //language is fr;
            _languageSet = "fr";
        } else {
            _languageSet = "en";
        }

        var isRunningOnBrowser = window.__cordovaRunningOnBrowser__;

        if (!isRunningOnBrowser) {
            self.updateGameTexts();
            self.updateGameButtonLocale();
        }

    };

    self.getPreferedLanguageErrorCallback = function() {
        //console.log('error getting language');
    };

    self.getBrowserLanguagePreference = function() {
        var userLang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);

        if (userLang.indexOf('fr') != -1) {
            //language is french;
            _languageSet = "fr";
        } else {
            _languageSet = "en";
        }
    };

    self.getUrlLanguage = function() {
        var pathArray = null;
        var preferredLanguage = "en";


        if (self.parentUrl != "") {
            pathArray = self.parentUrl.split('/');
        } else {
            return false;
        }

        if (pathArray) {

            if (pathArray[pathArray.length - 1].indexOf("index") != -1) {
                return false;
            }
            if (pathArray[pathArray.length - 1].indexOf("fr") != -1) {
                preferredLanguage = "fr";
                _languageSet = preferredLanguage;
                //console.log('getting preferred language: ' + preferredLanguage);
                return true;
            } else {
                _languageSet = preferredLanguage;
                //console.log('getting preferred language: ' + preferredLanguage);
                return true;
            }

        } else {
            return false;
        }
    }

    self.getAppLanguage = function() {

        if (_languageSet == null) {

            var preferredLanguage = self.getUrlLanguage();
            if (!preferredLanguage) {
                self.getBrowserLanguagePreference();
            }

        }
    };

    self.updateGameButtonLocale = function() {

        var mainMenuBtnDiv = document.getElementById("mainMenuBtn");
        var newGameBtnDiv = document.getElementById("newGameBtn");
        var settingsBtnDiv = document.getElementById("settingsBtn");
        var playWithFriendBtn = document.getElementById("playWithFriend");
        var findOpponentBtn = document.getElementById("findOpponent");
        var soloGameBtn = document.getElementById("soloGame");
        var passAndPlayBtn = document.getElementById("passAndPlayBtn");
        var activatedLanguagesDiv = document.getElementById("activatedLanguagesTitle");
        var editLanguagesBtn = document.getElementById("editLanguagesBtn");
        var gamePlayBtn = document.getElementById("gamePlayBtn");
        var cancelGameBtn = document.getElementById("cancelGameBtn");

        if (_languageSet == "fr") {

            if (mainMenuBtnDiv) {
                mainMenuBtnDiv.classList.remove('mainMenuBtn');
                mainMenuBtnDiv.classList.add('mainMenuBtn-fr');
            }

            if (newGameBtnDiv) {
                newGameBtnDiv.classList.remove('newGameBtn');
                newGameBtnDiv.classList.add('newGameBtn-fr');
            }

            if (settingsBtnDiv) {
                settingsBtnDiv.classList.remove('settingsBtn');
                settingsBtnDiv.classList.add('settingsBtn-fr');
            }

            if (playWithFriendBtn) {
                playWithFriendBtn.classList.remove('playWithFriendBtn');
                playWithFriendBtn.classList.add('playWithFriendBtn-fr');
            }

            if (findOpponentBtn) {
                findOpponentBtn.classList.remove('findOpponentBtn');
                findOpponentBtn.classList.add('findOpponentBtn-fr');
            }

            if (soloGameBtn) {
                soloGameBtn.classList.remove('soloGameBtn');
                soloGameBtn.classList.add('soloGameBtn-fr');
            }

            if (passAndPlayBtn) {
                passAndPlayBtn.classList.remove('passNplayBtn');
                passAndPlayBtn.classList.add('passNplayBtn-fr');
            }

            if (activatedLanguagesDiv) {
                activatedLanguagesDiv.classList.remove('activated_languages_title');
                activatedLanguagesDiv.classList.add('activated_languages_title-fr');
            }

            if (editLanguagesBtn) {
                editLanguagesBtn.classList.remove('edit_languages');
                editLanguagesBtn.classList.add('edit_languages-fr');
            }

            if (gamePlayBtn) {
                gamePlayBtn.classList.remove('lets-play-btn');
                gamePlayBtn.classList.add('lets-play-btn-fr');
            }

            if (cancelGameBtn) {
                cancelGameBtn.classList.remove('config-cancel-btn');
                cancelGameBtn.classList.add('config-cancel-btn-fr');
            }
        }
    };

    self.updateGameTexts = function() {

        var language = window.applanguage[_languageSet];


        //CREDITS
        var financingTextDiv = document.getElementById('financingTxt');
        var conceptTextDiv = document.getElementById('conceptTxt');
        var projectLeadTextDiv = document.getElementById('projectLeadTxt');
        var developmentTextDiv = document.getElementById('developmentTxt');
        var designTextDiv = document.getElementById('designTxt');
        var infrastructureTextDiv = document.getElementById('infrasctureTxt');
        var notAvailableTextDiv = document.getElementById('notAvailableTxt');
        var helpImplementTextDiv = document.getElementById('helpImplementTxt');
        var playSoundTextDiv = document.getElementById('playSoundTxt');
        var player1TextDiv = document.getElementById('player1Txt');
        var player1NameText = document.getElementById('player1NameTxt');
        var player2NameText = document.getElementById('player2NameTxt');
        var player1LanguageText = document.getElementById('player1LanguageTxt');
        var player2LanguageText = document.getElementById('player2LanguageTxt');
        var classicLanguageText = document.getElementById('classicLanguageTxt');
        var player1Pseudo = document.getElementById('player1pseudo');
        var player2Pseudo = document.getElementById('player2pseudo');
        var difficultyTextDiv = document.getElementById('difficultyTxt');
        var exitAppTextDiv = document.getElementById('exitAppTxt');
        var computerIsPlayingTxt = document.getElementById('computerIsPlayingTxt');
        var activatedLanguagesTitle = document.getElementsByClassName('activated-languages-title')[0];
        var multilingualText = document.getElementById('multilingualText');
        var monolingualText = document.getElementById('monolingualText');
        var openAndCollaborativeText = document.getElementById('openCollabTxt');


        if (financingTextDiv) {
            financingTextDiv.innerHTML = language.financing;
        }
        if (conceptTextDiv) {
            conceptTextDiv.innerHTML = language.concept;
        }
        if (projectLeadTextDiv) {
            projectLeadTextDiv.innerHTML = language.projectlead;
        }
        if (developmentTextDiv) {
            developmentTextDiv.innerHTML = language.development;
        }
        if (designTextDiv) {
            designTextDiv.innerHTML = language.design;
        }
        if (infrastructureTextDiv) {
            infrastructureTextDiv.innerHTML = language.infrastructure;
        }

        if (notAvailableTextDiv) {
            notAvailableTextDiv.innerHTML = language.notyetavailable;
        }

        if (helpImplementTextDiv) {
            helpImplementTextDiv.innerHTML = language.helpusimplement;
        }

        if (playSoundTextDiv) {
            playSoundTextDiv.innerHTML = language.playSound;
        }

        if (player1TextDiv) {
            player1TextDiv.innerHTML = language.definePlayerPseudoLanguage.replace("{x}", "1");
        }

        if (player1NameText) {
            player1NameText.innerHTML = language.name;
        }

        if (player2NameText) {
            player2NameText.innerHTML = language.name;
        }

        if (player1LanguageText) {
            player1LanguageText.innerHTML = language.language;
        }

        if (player2LanguageText) {
            player2LanguageText.innerHTML = language.language;
        }

        if (classicLanguageText) {
            classicLanguageText.innerHTML = language.language;
        }

        if (player1Pseudo) {
            player1Pseudo.placeholder = language.enterPseudo;
        }

        if (player2Pseudo) {
            player2Pseudo.placeholder = language.enterPseudo;
        }

        if (difficultyTextDiv) {
            difficultyTextDiv.innerHTML = language.difficulty;
        }

        if (computerIsPlayingTxt) {
            computerIsPlayingTxt.innerHTML = language.computerIsPlaying;
        }

        if (exitAppTextDiv) {
            exitAppTextDiv.innerHTML = language.exitapp;
        }

        if(activatedLanguagesTitle) {
            activatedLanguagesTitle.innerHTML = language.activatedlanguages.toUpperCase();
        }

        if(multilingualText) {
            multilingualText.innerHTML = language.multilingual;
        }

        if(monolingualText) {
            monolingualText.innerHTML = language.monolingual;
        }

        if(openAndCollaborativeText) {
            openAndCollaborativeText.innerHTML = language.openAndCollaborative;
        }


    };

    self.createOnlinePlayersList = function() {
        //this is hardcoded for now
        self.arenaPlayersList.innerHTML = "";

        for (var i = 0; i < 7; i++) {
            var player = {
                id: i,
                username: "User " + i,
                activeLanguages: ["en", "fr", "es"],
            }
            self.arenaPlayersList.appendChild(self.createOnlinePlayersRow(player));
        }

        self.arenaPlayersList.appendChild(self.createLoadMore());
    };

    self.createLoadMore = function() {
        var loadMoreDiv = document.createElement('div');
        loadMoreDiv.className = "load-more-row";

        var loadMoreText = document.createElement('div');
        loadMoreText.className = "arena-load-more-text";
        loadMoreText.innerHTML = "Load more";
        loadMoreDiv.appendChild(loadMoreText);

        return loadMoreDiv;
    };

    self.createOnlinePlayersRow = function(player) {

        if (player) {

            var id = player.id;
            var playerName = player.username;

            var arenaPlayerDiv = document.createElement('div');
            arenaPlayerDiv.id = "arenaPlayerId-" + id;
            arenaPlayerDiv.className = "arena-player-row";

            var arenaPlayerPhotoContainer = document.createElement('div');
            arenaPlayerPhotoContainer.className = "arena-photo-container";
            arenaPlayerDiv.appendChild(arenaPlayerPhotoContainer);

            var arenaPlayerPhoto = document.createElement('div');
            arenaPlayerPhoto.className = "arena-profile-photo";
            arenaPlayerPhotoContainer.appendChild(arenaPlayerPhoto);

            var arenaNameLanguageContainer = document.createElement('div');
            arenaNameLanguageContainer.className = "arena-name-language-container";
            arenaPlayerDiv.appendChild(arenaNameLanguageContainer);

            var arenaUserNameContainer = document.createElement('div');
            arenaUserNameContainer.className = "arena-user-name-container";
            arenaNameLanguageContainer.appendChild(arenaUserNameContainer);

            var arenaUserNameText = document.createElement('div');
            arenaUserNameText.className = "arena-username-text";
            arenaUserNameText.innerHTML = playerName;
            arenaUserNameContainer.appendChild(arenaUserNameText);

            var activeFlagsContainer = document.createElement('div');
            activeFlagsContainer.className = "arena-active-flags-container";
            arenaNameLanguageContainer.appendChild(activeFlagsContainer);

            for (var i = 0; i < player.activeLanguages.length; i++) {
                activeFlagsContainer.appendChild(self.createOnlinePlayerLanguageFlag(player.activeLanguages[i]));
            }

            var clearFloat = document.createElement('div');
            clearFloat.className = "clearFloat";
            activeFlagsContainer.appendChild(clearFloat);

            var arenaUserNameText = document.createElement('div');
            arenaUserNameText.className = "arena-username-text";

            var lastConnectionContainer = document.createElement('div');
            lastConnectionContainer.className = "last-connection-container";
            arenaPlayerDiv.appendChild(lastConnectionContainer);

            var timeElapsedContainer = document.createElement('div');
            timeElapsedContainer.className = "arena-time-elapsed-container";
            lastConnectionContainer.appendChild(timeElapsedContainer);

            var timeElapsedText = document.createElement('div');
            timeElapsedText.className = "arena-time-elapsed-text";
            timeElapsedText.innerHTML = "15m";
            timeElapsedContainer.appendChild(timeElapsedText);

            var timeElapsedIconContainer = document.createElement('div');
            timeElapsedIconContainer.className = "time-elapsed-icon-container";
            timeElapsedContainer.appendChild(timeElapsedIconContainer);

            var timeElapsedIcon = document.createElement('div');
            timeElapsedIcon.className = "arena-time-elapsed-icon";
            timeElapsedIconContainer.appendChild(timeElapsedIcon);

            var clearBottomFloat = document.createElement('div');
            clearBottomFloat.className = "clearFloat";
            arenaPlayerDiv.appendChild(clearBottomFloat);


            return arenaPlayerDiv;

        }

    };

    self.createOnlinePlayerLanguageFlag = function(lang) {
        var arenaActiveFlagContainer = document.createElement('div');
        arenaActiveFlagContainer.className = "arena-active-flag";


        var arenaActiveFlag = document.createElement('div');
        arenaActiveFlag.className = "arena-flag-" + lang;
        arenaActiveFlagContainer.appendChild(arenaActiveFlag);

        return arenaActiveFlagContainer;
    };


    self.showOnlineArena = function() {
        self.createOnlinePlayersList();
        self.mainMenuDiv.style.display = 'none';
        self.onlineInterface.style.display = 'block';
    };

    self.findOpponent = function() {
        self.showNotImplementedPopup();
        return;
        if (self.isLoggedIn()) {
            self.gameType = 'onlineGame';
            self.showGameModeScreen();
        } else {
            self.showLoginDialog();
        }

    };

    self.showLoginScreen = function() {
        self.hideLoginDialog();
        var loginScreen = document.getElementById('loginScreen');
        if (loginScreen) {
            self.mainMenuDiv.style.display = 'none';
            loginScreen.style.display = 'block';
        }
    };

    self.hideLoginScreen = function() {
        var loginScreen = document.getElementById('loginScreen');
        if (loginScreen) {
            self.mainMenuDiv.style.display = 'none';
            loginScreen.style.display = 'none';
        }
    }

    self.showRegisterScreen = function(e) {

        if (e && e.target) {
            var screenIdToUse = e.target.id;
            var registerScreen = document.getElementById('settingsRegisterScreen');

            if (registerScreen && screenIdToUse == 'settingsRegister') {
                self.mainMenuDiv.style.display = 'none';
                registerScreen.style.display = 'block';
            } else {
                self.hideLoginScreen();
                registerScreen.style.display = 'block';
            }
        }

    };

    self.hideRegisterScreen = function(e) {
        var registerScreen = document.getElementById('settingsRegisterScreen');
        if (registerSubmit) {
            registerScreen.style.display = 'none';
        }
    };

    self.enterArena = function(arenaType) {
        //console.log('entering classic arena... ' + arenaType);
        self.onlineInterface.style.display = 'none';
        self.arenaInterface.style.display = 'block';

        self.arenaTitleText.innerHTML = arenaType + " Arena";
    };

    self.enterMarbbleClassicArena = function() {
        //console.log('entering marbble classic arena... ');
        self.onlineInterface.style.display = 'none';
        self.arenaInterface.style.display = 'block';
    };


    self.showNewGame = function() {

        //TODO DISABLE ACTIVATION OF LANGUAGES FOR NOW
        //self.updateHomeLanguages();


        self.mainInterfaceDiv.style.display = 'none';
        self.settingsScreen.style.display = 'none';
        self.newGameInterfaceContainer.style.display = 'block';
        self.activeTab = "newGame";
    };

    self.showMainInterface = function(e) {
        self.newGameInterfaceContainer.style.display = 'none';
        self.settingsScreen.style.display = 'none';
        self.mainInterfaceDiv.style.display = 'block';
        self.activeTab = "main";

    };


    self.showSettings = function(e) {
        self.showNotImplementedPopup();
        return;
        self.activeTab = "settings";

        self.hideLoginDialog();

        var settingsDiv = document.getElementsByClassName("settings-content")[0];

        var preferencesMask = document.getElementsByClassName("preferences-mask");
        var isLoggedIn = self.isLoggedIn();
        if (preferencesMask) {
            for (var i = 0; i < preferencesMask.length; i++) {
                preferencesMask[i].style.display = isLoggedIn ? 'none' : 'block';
            }
        }

        if (isLoggedIn) {

            var profilePhoto = document.getElementById("settingsLoggedInProfilePhotoImg");

            if (profilePhoto) {
                profilePhoto.src = (self.loggedPlayerProfile && self.loggedPlayerProfile.photo) ? self.loggedPlayerProfile.photo : './img/opponent_info/user_icon.png';
            }

            self.settingsLoggedOut.style.display = "none";
            self.settingsLoggedIn.style.display = "block";
        } else {

            self.settingsLoggedIn.style.display = "none";
            self.settingsLoggedOut.style.display = "block";

        }
        self.newGameInterfaceContainer.style.display = 'none';
        self.mainInterfaceDiv.style.display = 'none';
        self.settingsScreen.style.display = 'block';

        if (settingsDiv) {
            settingsDiv.scrollTop = 0;
        }
    };

    self.reloadGamesList = function() {
        self.activeGamesContainerDiv.innerHTML = "";
        var activeGames = [];

        var activeGames = getActiveGamesList();

        if (activeGames.length > 0) {
            self.getAppLanguage();

            for (var i = 0; i < activeGames.length; i++) {
                self.createGamesList(activeGames[i]);
            }

            self.mainMenuBtn.click();
            self.newGameInterfaceContainer.style.display = 'none';
            self.mainInterfaceDiv.style.display = 'block';
        } else {
            self.mainInterfaceDiv.style.display = 'none';
            self.newGameInterfaceContainer.style.display = 'block';
        }
    };

    self.createGamesList = function(game) {
        var playerToPlay = game.playerToPlay;
        var gameMode = game.gameMode;
        var player = game.players[0];
        var opponent = game.players[1];
        var lastMove = "";
        var lastWordScore = "";
        var player1Score = 0;
        var player2Score = 0;
        var player1Lang = game.players[0].lang;
        var player2Lang = game.players[1].lang;
        var timeElapsed = game.timeElapsed;

        try {
            lastMove = game.movesHistory[game.movesHistory.length - 1].word;
            lastWordScore = game.movesHistory[game.movesHistory.length - 1].style ? game.movesHistory[game.movesHistory.length - 1].style.result : 0;
            player1Score = game.players[0].score;
            player2Score = game.players[1].score;
        } catch (e) {
            //console.log("NO WORD DATA",e);
        }

        var gameData = {
            id: game.gameId,
            playerToPlay: playerToPlay,
            gameMode: gameMode,
            player: player,
            opponent: opponent,
            lastMove: lastMove,
            lastWordScore: lastWordScore,
            player1Score: player1Score,
            player2Score: player2Score,
            player1Lang: player1Lang,
            player2Lang: player2Lang,
            timeElapsed: timeElapsed
        };

        if (playerToPlay == 0) {
            var yourTurnHeader = document.getElementById('yourTurnHeader');
            var yourTurnContainerDiv = document.getElementById('yourTurn');

            if (!yourTurnHeader) {
                yourTurnHeader = self.createTurnHeaderContainer();
            }
            self.activeGamesContainerDiv.appendChild(yourTurnHeader);

            if (!yourTurnContainerDiv) {
                yourTurnContainerDiv = self.createPlayerTurnContainer();
            }

            var activeGameDiv = self.createActiveGame(gameData);
            yourTurnContainerDiv.appendChild(activeGameDiv);
            self.activeGamesContainerDiv.appendChild(yourTurnContainerDiv);

        } else {
            var theirTurnHeader = document.getElementById('theirTurnHeader');
            var theirTurnContainerDiv = document.getElementById('theirTurn');

            if (!theirTurnHeader) {
                theirTurnHeader = self.createOpponentTurnHeader();
            }

            self.activeGamesContainerDiv.appendChild(theirTurnHeader);

            if (!theirTurnContainerDiv) {
                theirTurnContainerDiv = self.createOpponentTurnContainer();
            }

            var activeGameDiv = self.createActiveGame(gameData);
            theirTurnContainerDiv.appendChild(activeGameDiv);
            self.activeGamesContainerDiv.appendChild(theirTurnContainerDiv);


        }
    };

    self.createTurnHeaderContainer = function() {
        var turnHeaderDiv = document.createElement('div');
        turnHeaderDiv.id = "yourTurnHeader";
        turnHeaderDiv.className = "turn-header";
        turnHeaderDiv.innerHTML = self.appLanguage.yourTurn.toUpperCase();
        return turnHeaderDiv;
    };

    self.createPlayerTurnContainer = function(gameData) {

        var turnContainerDiv = document.createElement('div');
        turnContainerDiv.id = "yourTurn";
        turnContainerDiv.className = "turn-container";
        return turnContainerDiv;
    };

    self.createOpponentTurnHeader = function() {
        var turnHeaderDiv = document.createElement('div');
        turnHeaderDiv.id = "theirTurnHeader";
        turnHeaderDiv.className = "turn-header";
        turnHeaderDiv.innerHTML = self.appLanguage.theirTurn.toUpperCase();

        return turnHeaderDiv;
    };

    self.createOpponentTurnContainer = function(gameData) {
        var turnContainerDiv = document.createElement('div');
        turnContainerDiv.id = "theirTurn";
        turnContainerDiv.className = "turn-container";
        return turnContainerDiv;
    };

    self.createActiveGame = function(gameData) {
        var language = window.applanguage[_languageSet];
        var activeGameDiv = document.createElement('div');
        activeGameDiv.id = "activeGame-" + gameData.id;
        activeGameDiv.className = "saved-game-container";
        activeGameDiv.addEventListener('click', function(e) {
            self.loadGame(false, gameData.id);
        });


        // DELETE BUTTON
        var deleteButtonContainer = document.createElement('div');
        deleteButtonContainer.className = "delete-btn-container";
        activeGameDiv.appendChild(deleteButtonContainer);

        /*var deleteGameButton = document.createElement('div');
        deleteGameButton.className = "delete-active-game-btn";
        deleteGameButton.innerHTML = "Remove";
        deleteGameButton.addEventListener('click', function(e) {
            e.stopPropagation();
            self.gameIdToDelete = gameData.id;
            self.showConfirmDeletePopup();
        });

        deleteButtonContainer.appendChild(deleteGameButton);*/
        // DELETE BUTTON

        // EXPORT BUTTON
        var exportGameButton = document.createElement('div');
        exportGameButton.className = "delete-active-game-btn";
        exportGameButton.innerHTML = self.appLanguage.exportGame;
        exportGameButton.addEventListener('click', function(e) {
            e.stopPropagation();

            if (self.isRunningOnBrowser == false && device) {
                self.devicePlatform = getDevicePlatform();
                self.deviceVersion = getDeviceVersion() ? parseInt(getDeviceVersion()) : null;
            }

            if (self.devicePlatform == "iOS" && self.deviceVersion <= 9) {
                //disable exporting for ios 9 and lower...
                var errorMessage = "Not supported for " + self.devicePlatform + " ver " + getDeviceVersion();
                self.showErrorMessage(errorMessage);
            } else {
                var data = JSON.retrocycle(JSON.parse(window.localStorage.getItem("game-" + gameData.id)));
                exportGameState(data);
            }
        });

        deleteButtonContainer.appendChild(exportGameButton);
        // EXPORT BUTTON

        var gameContainerDiv = document.createElement('div');
        gameContainerDiv.className = "game-container-div";
        activeGameDiv.appendChild(gameContainerDiv);

        var photoContainerDiv = document.createElement('div');
        photoContainerDiv.className = "saved-game-photo-container";
        gameContainerDiv.appendChild(photoContainerDiv);

        var photoDiv = document.createElement('div');
        photoDiv.className = "saved-game-photo";
        var playerIcon = (gameData.opponent.isComputer == "true" || gameData.opponent.isComputer == true) ? "computer-icon" : "player-icon";
        photoDiv.classList.add(playerIcon);
        photoContainerDiv.appendChild(photoDiv);

        var turnContainerDiv = document.createElement('div');
        turnContainerDiv.className = "saved-game-turn-container";
        gameContainerDiv.appendChild(turnContainerDiv);

        var nameContainerDiv = document.createElement('div');
        nameContainerDiv.className = "saved-game-name-container";
        turnContainerDiv.appendChild(nameContainerDiv);

        var nameTextDiv = document.createElement('div');
        nameTextDiv.className = "saved-game-name-text";
        nameTextDiv.innerHTML = gameData.opponent.username;
        nameContainerDiv.appendChild(nameTextDiv);

        var wordContainerDiv = document.createElement('div');
        wordContainerDiv.className = "saved-game-word-container";
        turnContainerDiv.appendChild(wordContainerDiv);

        var isSwap = (gameData.lastMove.indexOf('swapped') != -1 || gameData.lastMove.indexOf('échangé') != -1) && gameData.lastWordScore == 0;
        var isPass = (gameData.lastMove.indexOf('passed') != -1 || gameData.lastMove.indexOf('passé') != -1) && gameData.lastWordScore == 0;
        var lastMoveText = gameData.lastMove + " <span class='last-word-score'>" + gameData.lastWordScore + " pts</span>";

        var previousPlayerLanguage = gameData.playerToPlay == 0 ? gameData.opponent.lang : gameData.player.lang;

        if (isSwap) {
            lastMoveText = window.applanguage[previousPlayerLanguage].gameListSwapped;
        }
        if (isPass) {
            lastMoveText = window.applanguage[previousPlayerLanguage].gameListPassed;
        }

        var lastWordTextDiv = document.createElement('div');
        var lastMoveColor = gameData.lastMove == gameData.opponent.lastWord ? "text-last-move-red" : "text-last-move-blue";
        lastWordTextDiv.id = "lastWord"
        lastWordTextDiv.className = "last-word";
        lastWordTextDiv.classList.add(lastMoveColor);
        lastWordTextDiv.innerHTML = lastMoveText;
        wordContainerDiv.appendChild(lastWordTextDiv);

        var playerSwapDiv = document.createElement('div');
        playerSwapDiv.id = "playerSwap";
        playerSwapDiv.className = "swap-container";
        playerSwapDiv.innerHTML = lastMoveText;
        wordContainerDiv.appendChild(playerSwapDiv);

        if (isSwap || isPass) {
            lastWordTextDiv.style.display = "none";
            playerSwapDiv.style.display = "block";
        } else {
            playerSwapDiv.style.display = "none";
            lastWordTextDiv.style.display = "block";
        }

        var gameModeContainerDiv = document.createElement('div');
        gameModeContainerDiv.className = "saved-game-mode-container";
        gameContainerDiv.appendChild(gameModeContainerDiv);

        var gameModeTextContainerDiv = document.createElement('div');
        gameModeTextContainerDiv.className = "saved-game-mode-text-container";
        gameModeContainerDiv.appendChild(gameModeTextContainerDiv);

        var gameModeTextDiv = document.createElement('div');
        gameModeTextDiv.className = "saved-game-mode-text";
        gameModeTextDiv.innerHTML = language['gameMode' + gameData.gameMode];
        gameModeTextContainerDiv.appendChild(gameModeTextDiv);

        var midContainerDiv = document.createElement('div');
        midContainerDiv.className = "saved-game-mid-container";
        gameModeContainerDiv.appendChild(midContainerDiv);

        var flagContainerDiv = document.createElement('div');
        flagContainerDiv.className = "flag-score-container";
        midContainerDiv.appendChild(flagContainerDiv);

        var playerOneFlagDiv = document.createElement('div');
        playerOneFlagDiv.className = "player-one-flag";
        playerOneFlagDiv.classList.add('flag-' + gameData.player1Lang);
        flagContainerDiv.appendChild(playerOneFlagDiv);

        var playerTwoFlagDiv = document.createElement('div');
        playerTwoFlagDiv.className = "player-two-flag";
        playerTwoFlagDiv.classList.add('flag-' + gameData.player2Lang);
        flagContainerDiv.appendChild(playerTwoFlagDiv);

        var scoreContainerDiv = document.createElement('div');
        scoreContainerDiv.className = "score-container";
        scoreContainerDiv.innerHTML = gameData.player1Score + " - " + gameData.player2Score;
        flagContainerDiv.appendChild(scoreContainerDiv);

        var clearFlagFloatDiv = document.createElement('div');
        clearFlagFloatDiv.className = "clearFloat";
        flagContainerDiv.appendChild(clearFlagFloatDiv);

        var timeContainerDiv = document.createElement('div');
        timeContainerDiv.className = "saved-game-time-container";
        gameContainerDiv.appendChild(timeContainerDiv);

        var timeElapsedContainerDiv = document.createElement('div');
        timeElapsedContainerDiv.className = "saved-game-time-elapsed-container";
        timeContainerDiv.appendChild(timeElapsedContainerDiv);

        var timeTextDiv = document.createElement('div');
        timeTextDiv.className = "saved-game-time-text";
        var timeElapsed = dateUtils.dateTimeToElapsed(gameData.timeElapsed)
        timeTextDiv.innerHTML = timeElapsed;
        timeElapsedContainerDiv.appendChild(timeTextDiv);

        var timeIconContainerDiv = document.createElement('div');
        timeIconContainerDiv.className = "saved-game-time-icon-container";
        timeContainerDiv.appendChild(timeIconContainerDiv);

        var timeIconDiv = document.createElement('div');
        timeIconDiv.className = "time-icon";
        timeIconContainerDiv.appendChild(timeIconDiv);

        var clearFloatDiv = document.createElement('div');
        clearFloatDiv.className = "clearFloat";
        gameContainerDiv.appendChild(clearFloatDiv);

        return activeGameDiv;
    };

    self.createChallengeNotificationScreen = function(id, username, gamemode, lang, targetLang, data) {
        document.getElementById("challengeNotificationScreenUsername").innerHTML = username;
        document.getElementById("challengeNotificationScreenUsername2").innerHTML = username;
        document.getElementById("challengeNotificationScreenGameMode").innerHTML = gamemode;
        document.getElementById("challengeNotificationScreenLang").innerHTML = LANG[lang];
        document.getElementById("challengeNotificationScreenTargetLang").innerHTML = LANG[targetLang];
        document.getElementById("challengeNotificationScreenId").value = id;
        document.getElementById("challengeNotificationScreenData").value = data;
        self.showChallengeNotificationScreen();
    };

    self.showChallengeNotificationScreen = function() {
        self.mainMenuDiv.style.display = 'none';
        self.challengeNotificationScreen.style.display = "block";
    };

    self.hideChallengeNotificationScreen = function() {
        self.challengeNotificationScreen.style.display = "none";
        self.mainMenuDiv.style.display = 'block';
    };


    self.showImportGameScreen = function(game) {
        if (game) {
            self.mainMenuDiv.style.display = 'none';
            self.importGameScreen.style.display = "block";
            var importGameIcon = document.getElementById("importGameIcon");
            var importGameModeText = document.getElementById("importGameModeText");
            var importGameVsText = document.getElementById("importGameVsText");
            var importPlayer1Flag = document.getElementById("importPlayer1Flag");
            var importPlayer2Flag = document.getElementById("importPlayer2Flag");
            var importPlayer1Name = document.getElementById("importPlayer1Name");
            var importPlayer2Name = document.getElementById("importPlayer2Name");
            var importPlayer1Score = document.getElementById("importPlayer1Score");
            var importPlayer2Score = document.getElementById("importPlayer2Score");
            var importComputerDifficulty = document.getElementById("importComputerDifficulty");
            var importGameHeader = document.getElementById("importGameHeader");
            var gameStartedDate = document.getElementById("gameStartedDate");
            var gameExportedDate = document.getElementById("gameExportedDate");
            var gameStartedText = document.getElementById("gameStartedText");
            var gameExportedText = document.getElementById("gameExportedText");



            self.localStorage.setItem("isImportGame", true);

            if (importGameIcon) {
                var iconToUse = game.gameMode == "MarbbleClassic" ? "marbble-classic-icon" : "classic-icon";
                importGameIcon.className = "";
                importGameIcon.classList.add(iconToUse);
            }

            if (importGameModeText) {
                importGameModeText.innerHTML = game.gameMode == "MarbbleClassic" ? "Marbble Classic" : "Classic";
            }

            if (importGameVsText) {
                importGameVsText.innerHTML = game.isSoloPlay == true || game.isSoloPlay == "true" ? " " + self.appLanguage.againstComputer : " " + self.appLanguage.againstPassAndPlay;
            }

            if (importPlayer1Flag) {
                var playerFlag = "import-flag-" + game.players[0].lang;
                importPlayer1Flag.className = "";
                importPlayer1Flag.classList.add(playerFlag);
            }

            if (importPlayer2Flag) {
                var playerFlag = "import-flag-" + game.players[1].lang;
                importPlayer2Flag.className = "";
                importPlayer2Flag.classList.add(playerFlag);
            }

            if (importPlayer1Name) {
                var playerName = game.players[0].username;
                importPlayer1Name.innerHTML = playerName + " ";
            }

            if (importPlayer2Name) {
                var playerName = game.players[1].username;
                importPlayer2Name.innerHTML = playerName + " ";
            }

            if (importPlayer1Score) {
                importPlayer1Score.innerHTML = game.players[0].score + " pts";
            }

            if (importPlayer2Score) {
                importPlayer2Score.innerHTML = game.players[1].score + " pts";
            }

            if (importComputerDifficulty) {

                if (game.isSoloPlay == "true" || game.isSoloPlay == true) {
                    importComputerDifficulty.style.display = "block";
                    importComputerDifficulty.innerHTML = self.appLanguage.computerDifficulty + ": " + game.playLevel;
                } else {
                    importComputerDifficulty.style.display = "none";
                }
            }

            if (self.importAndPlayBtn) {
                self.importAndPlayBtn.innerHTML = self.appLanguage.importAndPlay;
            }

            if (self.importCancel) {
                self.importCancel.innerHTML = self.appLanguage.cancel;
            }

            if (importGameHeader) {
                importGameHeader.innerHTML = self.appLanguage.doYouWantToImportGame;
            }

            if (gameStartedText) {
                gameStartedText.innerHTML = self.appLanguage.gameStarted + " ";
            }

            if (gameExportedText) {
                gameExportedText.innerHTML = self.appLanguage.gameExported;
            }

            if (gameExportedDate) {
                gameExportedDate.innerHTML = dateUtils.formatDate(game.timeElapsed);
            }

            if (gameStartedDate) {
                gameStartedDate.innerHTML = game.createdDate ? dateUtils.formatDate(game.createdDate) : " ";
            }

            _windowOpened = 'importGamePopupWindow';
            self.sound.openPopupInGame();

            if(game.online) {
              self.online = true;

              var playerName = self.localStorage.getItem('player1Name');

              if (self.localStorage) {
                  var playerName = self.localStorage.getItem('player1Name');

                  if (self.tempProfile && self.tempProfile.pseudo != '') {
                      playerName = self.tempProfile.pseudo;
                  }

                  if (self.loggedPlayerProfile && self.loggedPlayerProfile.pseudo != '') {
                      playerName = self.loggedPlayerProfile.pseudo;
                  }
              }
              console.log("Player to Play: " + game.players[game.playerToPlay].username + " player name: " + playerName);
              game.players[game.playerToPlay].username = playerName;
              console.log("player to play " + game.playerToPlay  + " name :" + game.players[game.playerToPlay].username);


              self.startPlay();
            }

        }

    };

    self.hideImportGameScreen = function(e) {
        self.localStorage.removeItem("tempGame");
        self.localStorage.removeItem("isImportGame");

        self.importGameScreen.style.display = "none";
        self.mainMenuDiv.style.display = 'block';

        _windowOpened = 'mainMenuWindow';

        //play sound
        self.sound.openPopupInGame();
    };

    self.createAccount = function(e) {

        var pseudo = document.getElementById('registerPseudo') ? document.getElementById('registerPseudo').value.trim() : '';
        var email = document.getElementById('registerEmail') ? document.getElementById('registerEmail').value.trim() : '';
        var password = document.getElementById('registerPassword') ? document.getElementById('registerPassword').value.trim() : '';
        var confirmPassword = document.getElementById('registerConfirmPassword') ? document.getElementById('registerConfirmPassword').value.trim() : '';

        if (email == "" || password == "") {
            var errorMessage = "Email and/or password is required";
            self.showErrorMessage(errorMessage);
            return;
        }

        if (password !== confirmPassword) {
            var errorMessage = "Password mismatch";
            self.showErrorMessage(errorMessage);
            return;
        }

        self.showLoader();

        var publicKeyString = self.generatePublicKey(email, password);
        var publicKeyId = self.getPublicKeyID(publicKeyString);

        var data = {
            "userId": publicKeyId,
            "publicKey": publicKeyString,
            "pseudo": pseudo,
            "email": email,
            "photo": null,
            "activeLanguages": {
                "en": true,
                "fr": true,
                "es": false,
                "ph": false
            },
            "settingsPreferences": {
                "receiveInvites": true,
                "receiveChallengeNotification": true,
                "receiveTurnNotifications": true,
                "appLanguage": "en",
                "soundEffects": true
            }
        };

        self.loggedPlayerProfile = data;

        if (saveUtils.getIndexedDB()) {
            //indexed db is supported
            saveUtils.saveProfileData(data);
        } else {
            //indexed db is not supported
            savePlayerProfile(data);
        }

        self.savePlayerPublicKey(publicKeyString);
        self.localStorage.setItem('isLoggedIn', true);

        self.updateProfilePreferences(data);

        self.hideLoader();

        if (self.activeTab == "settings") {
            self.showSettings();
            self.backToSettings();
        } else if (self.activeTab == "newGame") {
            self.hideRegisterScreen();
        }


    };

    self.login = function(e) {

        self.showLoader();

        var isSettings = false;
        if (e && e.target) {
            isSettings = e.target.id == 'settingsLoginSubmit' ? true : false;
        }
        var emailIdToUse = isSettings ? "settingsLoginEmail" : "loginEmail";
        var passwordIdToUse = isSettings ? "settingsLoginPassword" : "loginPassword";

        var email = document.getElementById(emailIdToUse) ? document.getElementById(emailIdToUse).value.trim() : '';
        var password = document.getElementById(passwordIdToUse) ? document.getElementById(passwordIdToUse).value.trim() : '';

        if (email == "" || password == "") {
            self.hideLoader();
            var errorMessage = "Please input email and password";
            self.showErrorMessage(errorMessage);
            return;
        }


        var playerPublicKeyString = self.generatePublicKey(email, password);
        var playerPublicKeyId = self.getPublicKeyID(playerPublicKeyString);

        if (saveUtils.getIndexedDB()) {
            //indexed db is supported
            saveUtils.getPlayerProfileByUserId(playerPublicKeyId, self.verifyLogin);

        } else {
            //indexed db is not supported, use local storage instead
            var playerProfile = getPlayerProfile(playerPublicKeyId);

            if (!playerProfile) {
                self.hideLoader();
                var errorMessage = "Incorrect email and/or password";
                self.showErrorMessage(errorMessage);
            } else {
                if (playerProfile.publicKey !== playerPublicKeyString) {
                    self.hideLoader();
                    var errorMessage = "Incorrect email and/or password";
                    self.showErrorMessage(errorMessage);
                } else {
                    self.localStorage.setItem('isLoggedIn', true);
                    self.savePlayerPublicKey(playerPublicKeyString);
                    self.loggedPlayerProfile = playerProfile;
                    self.updateProfilePreferences(self.loggedPlayerProfile);

                    var preferencesMask = document.getElementsByClassName("preferences-mask");
                    var isLoggedIn = self.isLoggedIn();
                    if (preferencesMask) {
                        for (var i = 0; i < preferencesMask.length; i++) {
                            preferencesMask[i].style.display = isLoggedIn ? 'none' : 'block';
                        }
                    }

                    self.hideLoader();

                    if (isLoggedIn) {
                        console.log("User is logged in...");

                        var profilePhoto = document.getElementById("settingsLoggedInProfilePhotoImg");

                        if (profilePhoto) {
                            profilePhoto.src = (self.loggedPlayerProfile && self.loggedPlayerProfile.photo) ? self.loggedPlayerProfile.photo : "./img/opponent_info/user_icon.png";
                        }

                        self.settingsLoggedOut.style.display = "none";
                        self.settingsLoggedIn.style.display = "block";

                        if (self.activeTab == "newGame") {
                            self.hideLoginScreen();
                            self.findOpponent();
                        }

                    } else {
                        self.settingsLoggedIn.style.display = "none";
                        self.settingsLoggedOut.style.display = "block";

                    }
                }
            }
        }
    };

    self.getPlayerProfile = function(result) {

        self.loggedPlayerProfile = result;
        self.updateProfilePreferences(self.loggedPlayerProfile);
        //TODO DISABLE ACTIVATION OF LANGUAGES FOR NOW
        //self.updateHomeLanguages();

    };

    self.verifyLogin = function(result) {

        if (!result) {
            self.hideLoader();
            var errorMessage = "Incorrect email and/or password";
            self.showErrorMessage(errorMessage);
        } else {

            self.localStorage.setItem('isLoggedIn', true);
            self.savePlayerPublicKey(result.publicKey);
            self.loggedPlayerProfile = result;
            self.updateProfilePreferences(self.loggedPlayerProfile);

            var preferencesMask = document.getElementsByClassName("preferences-mask");
            var isLoggedIn = self.isLoggedIn();
            if (preferencesMask) {
                for (var i = 0; i < preferencesMask.length; i++) {
                    preferencesMask[i].style.display = isLoggedIn ? 'none' : 'block';
                }
            }

            self.hideLoader();

            if (isLoggedIn) {

                var profilePhoto = document.getElementById("settingsLoggedInProfilePhotoImg");

                if (profilePhoto) {
                    profilePhoto.src = (self.loggedPlayerProfile && self.loggedPlayerProfile.photo) ? self.loggedPlayerProfile.photo : "./img/opponent_info/user_icon.png";
                }

                self.settingsLoggedOut.style.display = "none";
                self.settingsLoggedIn.style.display = "block";

                if (self.activeTab == "newGame") {
                    self.hideLoginScreen();
                    self.findOpponent();
                }

            } else {
                self.settingsLoggedIn.style.display = "none";
                self.settingsLoggedOut.style.display = "block";

            }
        }
    };

    self.updateTempProfileSettings = function(profile) {

        if (profile) {

            var pseudo = document.getElementById("settingsLoggedOutPseudo");

            var profilePhoto = document.getElementById("settingsLoggedOutProfilePhotoImg");

            if (pseudo) {
                pseudo.value = (self.tempProfile && self.tempProfile.pseudo != '') ? self.tempProfile.pseudo : '';
            }

            if (profilePhoto) {
                profilePhoto.src = (self.tempProfile && self.tempProfile.photo) ? self.tempProfile.photo : './img/opponent_info/user_icon.png';
            }

            var receiveInvitesToggle = document.getElementById('receiveInvitesToggle');
            var receiveChallengeToggle = document.getElementById('receiveChallengeToggle');
            var receiveNotificationsToggle = document.getElementById('receiveNotificationToggle');
            var soundEffectsToggle = document.getElementById('soundEffectsToggle');
            var selectedAppLanguage = document.getElementById('selectedAppLanguage');

            if (profile) {

                if (receiveInvitesToggle) {
                    receiveInvitesToggle.checked = profile.settingsPreferences["receiveInvites"];
                }

                if (receiveChallengeToggle) {
                    receiveChallengeToggle.checked = profile.settingsPreferences["receiveChallengeNotification"];
                }

                if (receiveNotificationsToggle) {
                    receiveNotificationsToggle.checked = profile.settingsPreferences["receiveTurnNotifications"];
                }

                if (soundEffectsToggle) {
                    soundEffectsToggle.checked = profile.settingsPreferences["soundEffects"];
                }

                var selectedAppLanguage = profile.settingsPreferences["appLanguage"];

                document.getElementById("appLang-" + selectedAppLanguage).selected = true;

            }
        }

    };

    self.updateProfilePreferences = function(profile) {

        var receiveInvitesToggle = document.getElementById('receiveInvitesToggle');
        var receiveChallengeToggle = document.getElementById('receiveChallengeToggle');
        var receiveNotificationsToggle = document.getElementById('receiveNotificationToggle');
        var soundEffectsToggle = document.getElementById('soundEffectsToggle');
        var selectedAppLanguage = document.getElementById('selectedAppLanguage');

        if (profile) {

            var profileEmail = document.getElementById("profileEmail");

            if (profileEmail) {
                profileEmail.value = profile.email;
            }
            var pseudo = document.getElementById("settingsLoggedInPseudo");

            if (pseudo && profile.pseudo) {
                pseudo.value = profile.pseudo;
            }


            if (self.preferredLangEn) {
                profile.activeLanguages["en"] == true ? self.preferredLangEn.classList.add('selected') : self.preferredLangEn.classList.remove('selected');
            }

            if (self.preferredLangFr) {
                profile.activeLanguages["fr"] == true ? self.preferredLangFr.classList.add('selected') : self.preferredLangFr.classList.remove('selected');
            }

            if (self.preferredLangEs) {
                profile.activeLanguages["es"] == true ? self.preferredLangEs.classList.add('selected') : self.preferredLangEs.classList.remove('selected');
            }

            if (self.preferredLangPh) {
                profile.activeLanguages["ph"] == true ? self.preferredLangPh.classList.add('selected') : self.preferredLangPh.classList.remove('selected');
            }

            if (receiveInvitesToggle) {
                receiveInvitesToggle.checked = profile.settingsPreferences["receiveInvites"];
            }

            if (receiveChallengeToggle) {
                receiveChallengeToggle.checked = profile.settingsPreferences["receiveChallengeNotification"];
            }

            if (receiveNotificationsToggle) {
                receiveNotificationsToggle.checked = profile.settingsPreferences["receiveTurnNotifications"];
            }

            if (soundEffectsToggle) {
                soundEffectsToggle.checked = profile.settingsPreferences["soundEffects"];
            }

            var selectedAppLanguage = profile.settingsPreferences["appLanguage"];

            document.getElementById("appLang-" + selectedAppLanguage).selected = true;

        }
    };

    self.logout = function(e) {
        self.localStorage.setItem('isLoggedIn', false);
        self.savePlayerPublicKey('');
        self.loggedPlayerProfile = null;

        var profilePhoto = document.getElementById("settingsLoggedInProfilePhotoImg");
        if (profilePhoto) {
            profilePhoto.src = "./img/opponent_info/user_icon.png";
        }

        ////
        var preferencesMask = document.getElementsByClassName("preferences-mask");
        var isLoggedIn = self.isLoggedIn();
        if (preferencesMask) {
            for (var i = 0; i < preferencesMask.length; i++) {
                preferencesMask[i].style.display = isLoggedIn ? 'none' : 'block';
            }
        }

        if (isLoggedIn) {
            self.settingsLoggedOut.style.display = "none";
            self.settingsLoggedIn.style.display = "block";
        } else {
            self.updateTempProfileSettings(self.tempProfile);
            self.settingsLoggedIn.style.display = "none";
            self.settingsLoggedOut.style.display = "block";

        }

    };

    self.generatePublicKey = function(email, password) {

        var passPhrase = email + password;
        var bits = 512;

        var playerRSAkey = cryptico.generateRSAKey(passPhrase, bits);
        var playerPublicKeyString = cryptico.publicKeyString(playerRSAkey);

        return playerPublicKeyString;
    };

    self.getPublicKeyID = function(publicKeyString) {
        return cryptico.publicKeyID(publicKeyString);
    };

    self.getPlayerPublicKey = function() {
        return self.localStorage.getItem('playerPublicKey');
    };

    self.savePlayerPublicKey = function(publicKeyString) {
        self.localStorage.setItem('playerPublicKey', publicKeyString);
    };

    self.isLoggedIn = function() {

        var isLoggedIn = self.localStorage.getItem('isLoggedIn') ? JSON.parse(self.localStorage.getItem('isLoggedIn')) : false;
        return isLoggedIn;
    };

    self.setPreferredLanguage = function(e) {

        var div = e.target.id.indexOf("preferredLang") == -1 ? e.target.parentNode : e.target;
        if (div) {
            div.classList.toggle("selected");
        }
    };

    self.updateLanguagePreference = function(e) {
        var enActive = self.preferredLangEn.classList.contains("selected") ? true : false;
        var frActive = self.preferredLangFr.classList.contains("selected") ? true : false;
        var esActive = self.preferredLangEs.classList.contains("selected") ? true : false;
        var phActive = self.preferredLangPh.classList.contains("selected") ? true : false;

        var activeLanguages = {
            en: enActive,
            fr: frActive,
            es: esActive,
            ph: phActive
        }

        var message = "Your preferences have been saved.";
        self.showErrorMessage(message);

        self.loggedPlayerProfile['activeLanguages'] = activeLanguages;

        if(saveUtils.getIndexedDB()) {
            //indexed db is supported
            saveUtils.saveProfileData(self.loggedPlayerProfile);
        }
        else {
            //indexed db is not supported
            savePlayerProfile(self.loggedPlayerProfile);
        }


    };

    self.saveSettings = function(e) {

        var receiveInvitesToggle = document.getElementById('receiveInvitesToggle');
        var receiveChallengeToggle = document.getElementById('receiveChallengeToggle');
        var receiveNotificationsToggle = document.getElementById('receiveNotificationToggle');
        var soundEffectsToggle = document.getElementById('soundEffectsToggle');
        var selectedAppLanguage = document.getElementById('selectedAppLanguage');

        var settingsPreferences = {
            appLanguage: selectedAppLanguage ? selectedAppLanguage.value : 'en',
            receiveChallengeNotification: receiveChallengeToggle ? receiveChallengeToggle.checked : false,
            receiveInvites: receiveInvitesToggle ? receiveInvitesToggle.checked : false,
            receiveTurnNotifications: receiveNotificationsToggle ? receiveNotificationsToggle.checked : false,
            soundEffects: soundEffectsToggle ? soundEffectsToggle.checked : false
        }


        if (self.isLoggedIn()) {
            self.loggedPlayerProfile['settingsPreferences'] = settingsPreferences;
            if(saveUtils.getIndexedDB()) {
                //indexed db is supported
                saveUtils.saveProfileData(self.loggedPlayerProfile);
            }
            else {
                //indexed db is supported
                savePlayerProfile(self.loggedPlayerProfile);
            }

        } else {
            self.tempProfile['settingsPreferences'] = settingsPreferences;
            saveTempProfile(self.tempProfile);
        }

        var message = "Your configuration has been saved.";
        self.showErrorMessage(message);
    };

    self.showLoader = function() {
        var loaderDiv = document.getElementById('loader');
        var loaderContent = document.getElementById('loaderContent');

        if (loaderDiv) {
            loaderDiv.style.width = self.docW + "px";
            loaderDiv.style.height = self.docH + "px";
            loaderDiv.style.display = "block";
        }

        if (loaderContent) {
            loaderContent.style.display = "block";
        }

    };

    self.hideLoader = function(e) {
        var loaderDiv = document.getElementById('loader');
        var loaderContent = document.getElementById('loaderContent');

        if (loaderDiv) {
            loaderDiv.style.display = "none";
        }
    };

    self.startPhotoUpload = function(event) {

        var inputIdToUse = (event && event.target.id) ? event.target.id : "";

        var imgIdToUse = "settingsLoggedOutProfilePhotoImg";

        if (inputIdToUse.indexOf("settingsLoggedIn") != -1) {
            inputIdToUse = "settingsLoggedInPhotoUpload";
            imgIdToUse = "settingsLoggedInProfilePhotoImg";
        } else if (inputIdToUse.indexOf("register") != -1) {
            inputIdToUse = "registerPhotoUpload";
            imgIdToUse = "registerProfilePhotoImg";
        }

        var profilePhotoImg = document.getElementById(imgIdToUse);
        var photoUpload = document.getElementById(inputIdToUse);

        var filePath = photoUpload.value;
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

        if (!allowedExtensions.exec(filePath)) {
            var errorMessage = 'Please upload an image file.';
            photoUpload.value = '';
            self.showErrorMessage(errorMessage);
            return false;
        } else {
            if (event.target.files && event.target.files[0]) {
                var file = event.target.files[0];

                try {

                    var reader = new FileReader();

                    reader.onloadend = function() {
                        profilePhotoImg.src = reader.result;
                        if (self.isLoggedIn()) {

                            self.loggedPlayerProfile['photo'] = reader.result;
                            if(saveUtils.getIndexedDB()) {
                                //indexed db is supported
                                saveUtils.saveProfileData(self.loggedPlayerProfile);
                            }
                            else {
                                //indexed db not supported
                                savePlayerProfile(self.loggedPlayerProfile);
                            }

                        } else {
                            self.tempProfile['photo'] = reader.result;
                            saveTempProfile(self.tempProfile);
                        }
                        var message = "Updated profile photo";
                        self.showErrorMessage(message);
                    }

                    if (file) {
                        reader.readAsDataURL(file); //reads the data as a URL
                    } else {
                        profilePhotoImg.src = "";
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };

    self.uploadProfilePhoto = function(e) {
        e.stopPropagation();


        var idToUse = "settingsLoggedOutPhotoUpload";

        if (e.target.id.indexOf("settingsLoggedIn") != -1) {
            idToUse = "settingsLoggedInPhotoUpload";
        } else if (e.target.id.indexOf("register") != -1) {
            idToUse = "registerPhotoUpload";
        }

        var photoUpload = document.getElementById(idToUse);

        if (photoUpload) {
            photoUpload.click();
        }

    };


    self.updateProfile = function(e) {

        var div = e && e.target ? e.target : null;
        var idToUse = self.isLoggedIn() ? "settingsLoggedInPseudo" : "settingsLoggedOutPseudo";

        var pseudo = document.getElementById(idToUse).value.trim();

        if (pseudo == "") {
            var errorMessage = "Pseudo is blank";
            self.showErrorMessage(errorMessage);
            return;
        }

        if (self.isLoggedIn()) {

            self.loggedPlayerProfile['pseudo'] = pseudo != '' ? pseudo : self.loggedPlayerProfile.pseudo;
            if(saveUtils.getIndexedDB()) {
                //indexed db is supported
                saveUtils.saveProfileData(self.loggedPlayerProfile);
            }
            else {
                //indexed db is not supported
                savePlayerProfile(self.loggedPlayerProfile);
            }


        } else {
            self.tempProfile['pseudo'] = pseudo != '' ? pseudo : self.tempProfile.pseudo;
            self.setTempProfile(self.tempProfile);

        }

        var message = "Pseudo successfully updated";
        self.showErrorMessage(message);

    };

    self.setTempProfile = function(profile) {
        if (profile == null) {
            profile = {
                "photo": null,
                "pseudo": null,
                "settingsPreferences": {
                    "receiveInvites": true,
                    "receiveChallengeNotification": true,
                    "receiveTurnNotifications": true,
                    "appLanguage": "en",
                    "soundEffects": true
                }
            }
        }
        saveTempProfile(profile);
        return profile;
    };

    self.getActiveLanguagesCount = function() {
        var activeLanguages = 0;
        if (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages) {
            for (var key in self.loggedPlayerProfile.activeLanguages) {
                if (self.loggedPlayerProfile.activeLanguages[key] == true) {
                    activeLanguages++;
                }
            }
        }
        return activeLanguages;
    };


    self.showActivateLanguages = function() {

        var onlineMarbbleClassicDiv = document.getElementById('onlineMarbbleClassic');

        if (onlineMarbbleClassicDiv) {
            onlineMarbbleClassicDiv.style.display = "none";
        }

        var activateLanguagesDiv = document.getElementById('activateLanguagesDiv');

        if (activateLanguagesDiv) {
            activateLanguagesDiv.style.display = "block";
        }

        var soundContainer = document.getElementById('soundContainer');

        if (soundContainer) {
            soundContainer.style.display = "none";
        }

        var gameStartBtnContainer = document.getElementById('gameStartBtnContainer');

        if (gameStartBtnContainer) {
            gameStartBtnContainer.style.display = "none";
        }

        var activateLanguageBtnContainer = document.getElementById('activateLanguageBtnContainer');

        if (activateLanguageBtnContainer) {
            activateLanguageBtnContainer.style.display = "block";
        }


    };

    self.hideActivateLanguages = function() {

        var activateLanguagesDiv = document.getElementById('activateLanguagesDiv');

        if (activateLanguagesDiv) {
            activateLanguagesDiv.style.display = "none";
        }

        var onlineMarbbleClassicDiv = document.getElementById('onlineMarbbleClassic');

        if (onlineMarbbleClassicDiv) {
            onlineMarbbleClassicDiv.style.display = "block";
        }

        var soundContainer = document.getElementById('soundContainer');

        if (soundContainer) {
            soundContainer.style.display = "block";
        }

        var gameStartBtnContainer = document.getElementById('gameStartBtnContainer');

        if (gameStartBtnContainer) {
            gameStartBtnContainer.style.display = "block";
        }

        var activateLanguageBtnContainer = document.getElementById('activateLanguageBtnContainer');

        if (activateLanguageBtnContainer) {
            activateLanguageBtnContainer.style.display = "none";
        }
    };

    self.updateHomeLanguages = function() {

        var homeLanguagesFlagContainer = document.getElementById('homeLanguagesFlagContainer');
        var homeLanguageLoginText = document.getElementById('homeLanguageLoginText');
        var editLanguagesBtn = document.getElementById('editLanguagesBtn');
        var homeLoginBtn = document.getElementById('homeLoginBtn');

        var homeFlagEn = document.getElementById('homeFlagEn');
        var homeFlagFr = document.getElementById('homeFlagFr');
        var homeFlagEs = document.getElementById('homeFlagEs');
        var homeFlagPh = document.getElementById('homeFlagPh');

        if (!self.isLoggedIn()) {
            if (homeLanguagesFlagContainer) {
                homeLanguagesFlagContainer.style.display = 'none';
            }

            if (homeLanguageLoginText) {
                homeLanguageLoginText.style.display = 'block';
            }

            if (editLanguagesBtn) {
                editLanguagesBtn.style.display = 'none';
            }

            if (homeLoginBtn) {
                homeLoginBtn.style.display = 'block';
            }
        } else {
            if (homeLanguagesFlagContainer) {
                homeLanguagesFlagContainer.style.display = 'block';
            }

            if (homeLanguageLoginText) {
                homeLanguageLoginText.style.display = 'none';
            }

            if (editLanguagesBtn) {
                editLanguagesBtn.style.display = 'block';
            }

            if (homeLoginBtn) {
                homeLoginBtn.style.display = 'none';
            }

            homeFlagEn.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.en == true) ? "block" : "none";
            homeFlagFr.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.fr == true) ? "block" : "none";
            homeFlagEs.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.es == true) ? "block" : "none";
            homeFlagPh.style.display = (self.loggedPlayerProfile && self.loggedPlayerProfile.activeLanguages.ph == true) ? "block" : "none";


        }
    };

    self.displayGameModeContent = function() {
        var gameModeContent = document.getElementById('gameModeContent');

        if(gameModeContent) {
            gameModeContent.style.display = "block";
        }

    };

    self.hideGameModeContent = function() {
        var gameModeContent = document.getElementById('gameModeContent');

        if(gameModeContent) {
            gameModeContent.style.display = "none";
        }
    }



    self.init();

    return self;
};
