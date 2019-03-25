"use strict";

var homeInterface;

var HomeInterface = function () {

    var self = this;

    self.docW = document.documentElement.clientWidth;
    self.docH = document.documentElement.clientHeight;

    self.init = function() {
        window.onload = self.initHomeScreen();
    };

    self.initHomeScreen = function() {

        self.gameBoardFrame = document.getElementById("gameBoard");

        var parentUrl = '' + window.location;
        window.setTimeout(function() {
            self.gameBoardFrame.contentWindow.postMessage(parentUrl, '*');
        }, 300);

        // Get the modal
        self.modal = document.getElementById('lightBoxModal');

        self.appStorePopup = document.getElementById('appStorePopup');

        self.appStoreButton = document.getElementById('appStoreButton');

        //self.appStoreButton.addEventListener('click', self.openAppStorePopup);

        self.appStoreButtonMobile = document.getElementById('appStoreButtonMobile');

        //self.appStoreButtonMobile.addEventListener('click', self.openAppStorePopup);

        self.appStoreCloseButton = document.getElementById('close');

        self.appStoreCloseButton.addEventListener('click', self.closeAppStorePopup);

        var isMobile = self.isMobile();


        if(isMobile == false) {
            self.docW = 360;
            self.docH = 640;
        }

        self.gameBoardFrame.width = self.docW + "px";
        self.gameBoardFrame.height = self.docH + "px";

        self.updateScreenshots();

        self.getModal();

    };

    self.isMobile = function() {

        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && self.docW > 500) {
            return false;
        }
        return true;

    };

    self.getModal = function() {

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        var screenshot1 = document.getElementById('screenshot1');
        var screenshot2 = document.getElementById('screenshot2');
        var screenshot3 = document.getElementById('screenshot3');
        var screenshot4 = document.getElementById('screenshot4');
        var screenshot5 = document.getElementById('screenshot5');
        var screenshot6 = document.getElementById('screenshot6');
        var screenshot7 = document.getElementById('screenshot7');
        var screenshot8 = document.getElementById('screenshot8');
        var screenshot9 = document.getElementById('screenshot9');
        var screenshot10 = document.getElementById('screenshot10');
        var screenshot11 = document.getElementById('screenshot11');
        var screenshot12 = document.getElementById('screenshot12');

        screenshot1.addEventListener('click', self.openModal);
        screenshot2.addEventListener('click', self.openModal);
        screenshot3.addEventListener('click', self.openModal);
        screenshot4.addEventListener('click', self.openModal);
        screenshot5.addEventListener('click', self.openModal);
        screenshot6.addEventListener('click', self.openModal);
        screenshot7.addEventListener('click', self.openModal);
        screenshot8.addEventListener('click', self.openModal);
        screenshot9.addEventListener('click', self.openModal);
        screenshot10.addEventListener('click', self.openModal);
        screenshot11.addEventListener('click', self.openModal);
        screenshot12.addEventListener('click', self.openModal);

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close2")[0];

        var prev = document.getElementsByClassName("prev")[0];
        var next = document.getElementsByClassName("next")[0];

        prev.onclick = function() {
            console.log('clicked prev');
            self.plusSlides(-1);
        };
        next.onclick = function() {
            self.plusSlides(1);
        };

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            self.modal.style.display = "none";
        }

    };

    self.updateScreenshots = function() {
        var url = window.location.href;
        var pathArray = url.split('/');

        var language = "en";

        if(pathArray) {

            if(pathArray[pathArray.length - 1].indexOf("fr") != -1) {
                language = "fr";
            }
            else {
                language = "en";
            }
        }

        var screenshot1 = document.getElementById('screenshot1');
        var screenshot2 = document.getElementById('screenshot2');
        var screenshot3 = document.getElementById('screenshot3');
        var screenshot4 = document.getElementById('screenshot4');
        var screenshot5 = document.getElementById('screenshot5');
        var screenshot6 = document.getElementById('screenshot6');
        var screenshot7 = document.getElementById('screenshot7');
        var screenshot8 = document.getElementById('screenshot8');
        var screenshot9 = document.getElementById('screenshot9');
        var screenshot10 = document.getElementById('screenshot10');
        var screenshot11 = document.getElementById('screenshot11');
        var screenshot12 = document.getElementById('screenshot12');

        var modalImageList = document.getElementById('lightBoxModal').querySelectorAll('img');

        if(language == "fr") {
            screenshot1.src = "img/website/scrMenu-fr.png";
            modalImageList[0].src = "img/website/scrMenu-fr.png";
            screenshot2.src = "img/website/scrGameSelection-fr.png";
            modalImageList[1].src = "img/website/scrGameSelection-fr.png";
            screenshot3.src = "img/website/scrPassAndPlay-fr.png";
            modalImageList[2].src = "img/website/scrPassAndPlay-fr.png";
            screenshot4.src = "img/website/scrGame-fr.png";
            modalImageList[3].src = "img/website/scrGame-fr.png";
            screenshot5.src = "img/website/scrGameZoom-fr.png";
            modalImageList[4].src = "img/website/scrGameZoom-fr.png";
            screenshot6.src = "img/website/scrComputerPlaying-fr.png";
            modalImageList[5].src = "img/website/scrComputerPlaying-fr.png";
            screenshot7.src = "img/website/scrTranslations-fr.png";
            modalImageList[6].src = "img/website/scrTranslations-fr.png";
            screenshot8.src = "img/website/scrDefinitions2-fr.png";
            modalImageList[7].src = "img/website/scrDefinitions2-fr.png";
            screenshot9.src = "img/website/scrDefinitions3-fr.png";
            modalImageList[8].src = "img/website/scrDefinitions3-fr.png";
            screenshot10.src = "img/website/scrExchangeTiles-fr.png";
            modalImageList[9].src = "img/website/scrExchangeTiles-fr.png";
            screenshot11.src = "img/website/scrBlankTile-fr.png";
            modalImageList[10].src = "img/website/scrBlankTile-fr.png";
            screenshot12.src = "img/website/scrVictory-fr.png";
            modalImageList[11].src = "img/website/scrVictory-fr.png";
        }
        else {
            screenshot1.src = "img/website/scrMenu.png";
            modalImageList[0].src = "img/website/scrMenu.png";
            screenshot2.src = "img/website/scrGameSelection.png";
            modalImageList[1].src = "img/website/scrGameSelection.png";
            screenshot3.src = "img/website/scrPassAndPlay.png";
            modalImageList[2].src = "img/website/scrPassAndPlay.png";
            screenshot4.src = "img/website/scrGame.png";
            modalImageList[3].src = "img/website/scrGame.png";
            screenshot5.src = "img/website/scrGameZoom.png";
            modalImageList[4].src = "img/website/scrGameZoom.png";
            screenshot6.src = "img/website/scrComputerPlaying.png";
            modalImageList[5].src = "img/website/scrComputerPlaying.png";
            screenshot7.src = "img/website/scrTranslations.png";
            modalImageList[6].src = "img/website/scrTranslations.png";
            screenshot8.src = "img/website/scrDefinitions2.png";
            modalImageList[7].src = "img/website/scrDefinitions2.png";
            screenshot9.src = "img/website/scrDefinitions3.png";
            modalImageList[8].src = "img/website/scrDefinitions3.png";
            screenshot10.src = "img/website/scrExchangeTiles.png";
            modalImageList[9].src = "img/website/scrExchangeTiles.png";
            screenshot11.src = "img/website/scrBlankTile.png";
            modalImageList[10].src = "img/website/scrBlankTile.png";
            screenshot12.src = "img/website/scrVictory.png";
            modalImageList[11].src = "img/website/scrVictory.png";

        }
    };

    self.screenshotImageClick = function(e) {

        var index = this.id.replace(/[a-z]/g,'');

        var modalImg = document.getElementById("fullsize");
        var captionText = document.getElementById("caption");

        self.modal.style.display = "block";
        modalImg.src = this.src;
        modalImg.style.display = "block";
        // modalImg.style.width = "25%";
        // modalImg.style.height = "auto";
        captionText.innerHTML = this.alt;

    };

    self.updateScreenshots = function() {
        var url = window.location.href;
        var pathArray = url.split('/');

        var language = "en";

        if(pathArray) {

            if(pathArray[pathArray.length - 1].indexOf("fr") != -1) {
                language = "fr";
            }
            else {
                language = "en";
            }
        }

        var screenshot1 = document.getElementById('screenshot1');
        var screenshot2 = document.getElementById('screenshot2');
        var screenshot3 = document.getElementById('screenshot3');
        var screenshot4 = document.getElementById('screenshot4');
        var screenshot5 = document.getElementById('screenshot5');
        var screenshot6 = document.getElementById('screenshot6');
        var screenshot7 = document.getElementById('screenshot7');
        var screenshot8 = document.getElementById('screenshot8');
        var screenshot9 = document.getElementById('screenshot9');
        var screenshot10 = document.getElementById('screenshot10');
        var screenshot11 = document.getElementById('screenshot11');
        var screenshot12 = document.getElementById('screenshot12');

        var modalImageList = document.getElementById('lightBoxModal').querySelectorAll('img');

        if(language == "fr") {
            screenshot1.src = "img/website/scrMenu-fr.png";
            modalImageList[0].src = "img/website/scrMenu-fr.png";
            screenshot2.src = "img/website/scrGameSelection-fr.png";
            modalImageList[1].src = "img/website/scrGameSelection-fr.png";
            screenshot3.src = "img/website/scrPassAndPlay-fr.png";
            modalImageList[2].src = "img/website/scrPassAndPlay-fr.png";
            screenshot4.src = "img/website/scrGame-fr.png";
            modalImageList[3].src = "img/website/scrGame-fr.png";
            screenshot5.src = "img/website/scrGameZoom-fr.png";
            modalImageList[4].src = "img/website/scrGameZoom-fr.png";
            screenshot6.src = "img/website/scrComputerPlaying-fr.png";
            modalImageList[5].src = "img/website/scrComputerPlaying-fr.png";
            screenshot7.src = "img/website/scrTranslations-fr.png";
            modalImageList[6].src = "img/website/scrTranslations-fr.png";
            screenshot8.src = "img/website/scrDefinitions2-fr.png";
            modalImageList[7].src = "img/website/scrDefinitions2-fr.png";
            screenshot9.src = "img/website/scrDefinitions3-fr.png";
            modalImageList[8].src = "img/website/scrDefinitions3-fr.png";
            screenshot10.src = "img/website/scrExchangeTiles-fr.png";
            modalImageList[9].src = "img/website/scrExchangeTiles-fr.png";
            screenshot11.src = "img/website/scrBlankTile-fr.png";
            modalImageList[10].src = "img/website/scrBlankTile-fr.png";
            screenshot12.src = "img/website/scrVictory-fr.png";
            modalImageList[11].src = "img/website/scrVictory-fr.png";
        }
        else {
            screenshot1.src = "img/website/scrMenu.png";
            modalImageList[0].src = "img/website/scrMenu.png";
            screenshot2.src = "img/website/scrGameSelection.png";
            modalImageList[1].src = "img/website/scrGameSelection.png";
            screenshot3.src = "img/website/scrPassAndPlay.png";
            modalImageList[2].src = "img/website/scrPassAndPlay.png";
            screenshot4.src = "img/website/scrGame.png";
            modalImageList[3].src = "img/website/scrGame.png";
            screenshot5.src = "img/website/scrGameZoom.png";
            modalImageList[4].src = "img/website/scrGameZoom.png";
            screenshot6.src = "img/website/scrComputerPlaying.png";
            modalImageList[5].src = "img/website/scrComputerPlaying.png";
            screenshot7.src = "img/website/scrTranslations.png";
            modalImageList[6].src = "img/website/scrTranslations.png";
            screenshot8.src = "img/website/scrDefinitions2.png";
            modalImageList[7].src = "img/website/scrDefinitions2.png";
            screenshot9.src = "img/website/scrDefinitions3.png";
            modalImageList[8].src = "img/website/scrDefinitions3.png";
            screenshot10.src = "img/website/scrExchangeTiles.png";
            modalImageList[9].src = "img/website/scrExchangeTiles.png";
            screenshot11.src = "img/website/scrBlankTile.png";
            modalImageList[10].src = "img/website/scrBlankTile.png";
            screenshot12.src = "img/website/scrVictory.png";
            modalImageList[11].src = "img/website/scrVictory.png";

        }
    };

    self.openAppStorePopup = function() {
        console.log('open app store popup');
        self.appStorePopup.style.display = "block";
    };

    self.closeAppStorePopup = function() {
        console.log('close app store popup');
        self.appStorePopup.style.display = "none";
    };

    self.plusSlides = function(n) {
        self.showSlides(self.slideIndex += n);
    };

    self.currentSlide = function(n) {
        self.showSlides(self.slideIndex = n);
    };

    self.showSlides = function(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        var captionText = document.getElementById("caption");

        if (n > slides.length) {
            self.slideIndex = 1
        }

        if (n < 1) {
            self.slideIndex = slides.length
        }
        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }

        slides[self.slideIndex-1].style.display = "block";

        captionText.innerHTML = slides[self.slideIndex-1].getElementsByTagName('img')[0].alt;

    };

    self.openModal = function(e) {
        var index = parseInt(this.id.replace(/[a-z]/g,''));
        self.currentSlide(index);
        document.getElementById('lightBoxModal').style.display = "block";
    };

    self.init();

    return self;
};
