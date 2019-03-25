(function () {
'use strict';



var doc = document;
window.sliders = new Object();
window.speed = Number(document.body.getAttribute('data-speed'));
window.edgepadding = 50;
window.gutter = 10;
window.options = {
  'non-loop': {
    container: '',
    // items: 3,
    loop: false,
    responsive: {
      320: {
        items: 3,
        gutter: 5,
        fixedWidth: 60,
        controlsText: ['<', '>']
      },
      360: {
        items: 3,
        gutter: 5,
        fixedWidth: 70,
        controlsText: ['<', '>']
      },
      375: {
        items: 3,
        gutter: 5,
        fixedWidth: 80,
        controlsText: ['<', '>']
      },
      384: {
        items: 3,
        gutter: 5,
        fixedWidth: 90,
        controlsText: ['<', '>']
      },
      900: {
        items: 4,
        gutter: 5,
        fixedWidth: 150,
        controlsText: ['<', '>']

      }
    }
  }
};

for (var i in options) {
  var item = options[i];
  item.container = '#' + i;
  if (!item.speed) { item.speed = speed; }
  if (doc.querySelector(item.container)) {
    sliders[i] = tns(options[i]);
    // sliders[i].destroy();

  }
}

}());
