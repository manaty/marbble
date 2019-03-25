var tileDragula;

function initMarbble(screenDivId){
  //we gives the responsibility of drag and drop rules to components themself
  tileDragula = dragula([], {
    moves: function (el, source, handle, sibling) {
      return el.draggable;
    },
    accepts: function (el, target, source, sibling) {
      let result = true;
      if(target.acceptsDropping){
        result &= target.acceptsDropping(el, target, source, sibling);
      }
      return result;
    }
  });
  tileDragula.on("drag",onNodeDrag);
  tileDragula.on("drop",onNodeDrop);
  tileDragula.on("cancel",onNodeCancel);
  let gameControler = new GameControler(screenDivId);
  gameControler.addPlayer("carina","en");
  gameControler.addPlayer("seb","fr");
  gameControler.draw();
}

function onNodeDrag(el,source){
  if(el.component && el.component.onDragged){
    el.component.onDragged(el,source);
  }
  if(source.onDraggedFrom){
    source.onDraggedFrom(el,source);
  }
}

function onNodeDrop(el, target, source, sibling){
  if(el.component && el.component.onDropped){
    el.component.onDropped(el, target, source, sibling);
  }
  if(target.onDropped){
    target.onDropped(el, target, source, sibling);
  }
}

function onNodeCancel(el, target, source){
  if(el.component && el.component.onCanceled){
    el.component.onCanceled(el, target, source);
  }
}
