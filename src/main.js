/*  
Zooniverse Puzzle
==========

A Zooniverse puzzle for Christmas.

(Shaun A. Noordin || shaunanoordin.com || 20161102)
********************************************************************************
 */

import * as APP from "./constants.js";  //Naming note: all caps.

/*  Primary App Class
 */
//==============================================================================
class App {
  constructor() {
    this.state = APP.STATE_IDLE;
    this.activePiece = null;
    this.puzzleBoard = null;
    this.easyMode = false;
    this.simpleMode = false;
    if (window.location && window.location.search && window.location.search.indexOf) {
      this.easyMode = window.location.search.indexOf(APP.EASYMODE_STRING) >= 0;
      this.simpleMode = window.location.search.indexOf(APP.SIMPLEMODE_STRING) >= 0;
    }
    
    
    this.width = 1;
    this.height = 1;
    this.boundingBox = null;  //To be defined by this.updateSize().
    this.sizeRatioX = 1;
    this.sizeRatioY = 1;
    this.pointer = {
      offset: {
        x: 0,
        y: 0,
      },
      now: {
        x: 0,
        y: 0,
      },
    };
    
    if ("onresize" in window) { window.onresize = this.updateSize.bind(this); }
    
    this.initPuzzleBoard();
    this.runCycle = setInterval(this.run.bind(this), 1000 / APP.FRAMES_PER_SECOND);
    
    document.getElementById("help").onclick = this.onHelpClick.bind(this);
  }
  
  initPuzzleBoard(imageFile = "penguins.jpg", gridWidth = APP.GRID_WIDTH, gridHeight = APP.GRID_HEIGHT) {
    this.puzzleBoard = document.getElementById("puzzle");
    this.width = (gridWidth + APP.GUTTER_SIZE) * APP.PIECE_SIZE;
    this.height = (gridHeight + APP.GUTTER_SIZE) * APP.PIECE_SIZE;
    this.puzzleBoard.style.width = this.width + "px";
    this.puzzleBoard.style.height = this.height + "px";
    
    const grid = document.getElementById("grid");
    grid.style.width = gridWidth * APP.PIECE_SIZE + "px";
    grid.style.height = gridHeight * APP.PIECE_SIZE + "px";
    grid.style.left = APP.GUTTER_SIZE / 2 * APP.PIECE_SIZE + "px";
    grid.style.top = APP.GUTTER_SIZE / 2 * APP.PIECE_SIZE + "px";
    
    if (this.simpleMode) {
      gridWidth = gridWidth / APP.SIMPLEMODE_MULTIPLIER;
      gridHeight = gridHeight / APP.SIMPLEMODE_MULTIPLIER;
    }
    
    this.puzzlePieces = [];
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const newPiece = document.createElement("div");
        newPiece.className = "piece";
        newPiece.dataset.correctX = (x + APP.GUTTER_SIZE / 2) * APP.PIECE_SIZE;
        newPiece.dataset.correctY = (y + APP.GUTTER_SIZE / 2) * APP.PIECE_SIZE;
        newPiece.dataset.x = Math.floor(Math.random() * (gridWidth + APP.GUTTER_SIZE / 2) * APP.PIECE_SIZE);
        newPiece.dataset.y = Math.floor(Math.random() * (gridHeight + APP.GUTTER_SIZE / 2) * APP.PIECE_SIZE);
        newPiece.style.width = APP.PIECE_SIZE + "px";
        newPiece.style.height = APP.PIECE_SIZE + "px";
        newPiece.style.left = newPiece.dataset.x + "px";
        newPiece.style.top = newPiece.dataset.y + "px";
        
        newPiece.style.backgroundImage = "url('assets/"+imageFile+"')";
        newPiece.style.backgroundPosition = "-" + (x * APP.PIECE_SIZE) + "px -" + (y * APP.PIECE_SIZE) + "px";
        
        if (this.simpleMode) {
          newPiece.dataset.correctX = (x * APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER) + APP.GUTTER_SIZE / 2 * APP.PIECE_SIZE;
          newPiece.dataset.correctY = (y * APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER) + APP.GUTTER_SIZE / 2 * APP.PIECE_SIZE;
          newPiece.style.width = APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER + "px";
          newPiece.style.height = APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER + "px";
          newPiece.style.backgroundImage = "url('assets/"+imageFile+"')";
          newPiece.style.backgroundPosition = "-" + (x * APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER) + "px -" + (y * APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER) + "px";
        }
        
        //newPiece.innerHTML = x + "," + y;  //DEBUG
        
        if ("onmousedown" in newPiece && "onmousemove" in newPiece && "onmouseover" in newPiece) {
          newPiece.onmousedown = this.onPiecePointerStart.bind(this);
          newPiece.onmouseup = this.onPiecePointerEnd.bind(this);
          newPiece.onmouseover = this.onPiecePointerOver.bind(this);
        }
        
        if ("ontouchstart" in newPiece && "ontouchend" in newPiece && "ontouchcancel" in newPiece) {
          newPiece.ontouchstart = this.onPiecePointerStart.bind(this);
          newPiece.ontouchend = this.onPiecePointerEnd.bind(this);
          newPiece.ontouchcancel = this.onPiecePointerEnd.bind(this);
        }
        
        this.puzzlePieces.push(newPiece);
        this.puzzleBoard.appendChild(newPiece);
      }
    }
    
    if ("onmousemove" in this.puzzleBoard) { this.puzzleBoard.onmousemove = this.onPointerMove.bind(this); }
    if ("ontouchmove" in this.puzzleBoard) { this.puzzleBoard.ontouchmove = this.onPointerMove.bind(this); }
    this.updateSize();
    this.checkWinStatus();
  }
  
  updateSize() {
    let boundingBox = (this.puzzleBoard.getBoundingClientRect)
      ? this.puzzleBoard.getBoundingClientRect()
      : { left: 0, top: 0 };
    this.boundingBox = boundingBox;
    this.sizeRatioX = this.width / this.boundingBox.width;
    this.sizeRatioY = this.height / this.boundingBox.height;
  }
  
  checkWinStatus() {
    let winStatus = true;
    if (this.activePiece) { winStatus = false; }
    
    this.puzzlePieces.map(piece => {
      winStatus = winStatus &&
        piece.dataset.x === piece.dataset.correctX &&
        piece.dataset.y === piece.dataset.correctY;
    });
    
    const title = document.getElementById("title");
    if (winStatus) {
      title.className = "winner";
      title.innerHTML = APP.WINNER_MESSAGE;
    } else {
      title.className = "";
      title.innerHTML = APP.START_MESSAGE;
    }
  }
  
  onHelpClick() {
    if (!this.puzzleBoard) return;
    
    this.puzzlePieces.map(piece => {
      if (piece.dataset.x !== piece.dataset.correctX ||
        piece.dataset.y !== piece.dataset.correctY) {
        this.puzzleBoard.appendChild(piece);
      }
    });
  }
  
  onPointerMove(e) {
    this.pointer.now = this.getPointerXY(e);
    return stopEvent(e);
  }
  
  onPiecePointerOver(e) {
    if (!this.activePiece &&
       !(e.target.dataset.x === e.target.dataset.correctX &&
        e.target.dataset.y === e.target.dataset.correctY)) {
      this.puzzleBoard.appendChild(e.target);
    }
    return stopEvent(e);
  }
  
  getPointerXY(e) {
    let clientX = 0;
    let clientY = 0;
    if (e.clientX && e.clientY) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.touches && e.touches.length > 0 && e.touches[0].clientX &&
        e.touches[0].clientY) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    let inputX = (clientX - this.boundingBox.left) * this.sizeRatioX;
    let inputY = (clientY - this.boundingBox.top) * this.sizeRatioY;
    return { x: inputX, y: inputY };
  }
  
  onPiecePointerStart(e) {
    this.activePiece = e.target;
    this.activePiece.className = "piece active";
    this.pointer.offset.x = e.target.dataset.x - this.pointer.now.x;
    this.pointer.offset.y = e.target.dataset.y - this.pointer.now.y;
    this.puzzleBoard.appendChild(this.activePiece);
    return stopEvent(e);
  }
  
  onPiecePointerEnd(e) {
    this.activePiece = null;
    const distX = Math.abs(e.target.dataset.x - e.target.dataset.correctX);
    const distY = Math.abs(e.target.dataset.y - e.target.dataset.correctY);
    const dist = Math.sqrt(distX * distX + distY * distY);
    if (dist < APP.SNAP_DISTANCE ||
        (this.easyMode && dist < APP.EASYMODE_SUPER_SNAP)) {
      e.target.dataset.x = e.target.dataset.correctX;
      e.target.dataset.y = e.target.dataset.correctY;
      e.target.style.left = e.target.dataset.x + "px";
      e.target.style.top = e.target.dataset.y + "px";
      e.target.className = "piece correct";
    } else {
      e.target.className = "piece";
    }
    this.checkWinStatus();
    return stopEvent(e);
  }
  
  run() {
    if (this.activePiece) {
      this.activePiece.dataset.x = this.pointer.now.x + this.pointer.offset.x;
      this.activePiece.dataset.y = this.pointer.now.y + this.pointer.offset.y;
      this.activePiece.style.left = this.activePiece.dataset.x + "px";
      this.activePiece.style.top = this.activePiece.dataset.y + "px";
    }
    
    this.puzzlePieces.map(piece => {
      if (piece !== this.activePiece) {
        if (piece.dataset.x < 0) { piece.dataset.x = 0; }
        if (piece.dataset.y < 0) { piece.dataset.y = 0; }
        if (piece.dataset.x > this.width - APP.PIECE_SIZE) { piece.dataset.x = this.width - APP.PIECE_SIZE; }
        if (piece.dataset.y > this.height - APP.PIECE_SIZE) { piece.dataset.y = this.height - APP.PIECE_SIZE; }
        piece.style.left = piece.dataset.x + "px";
        piece.style.top = piece.dataset.y + "px";
      }
    });
  }
}
//==============================================================================

/*  Utility
 */
//==============================================================================
function stopEvent(e) {
  //var eve = e || window.event;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.returnValue = false;
  e.cancelBubble = true;
  return false;
}
//==============================================================================

/*  Initialisations
 */
//==============================================================================
var app;
window.onload = function() {
  window.app = new App();
};
//==============================================================================
