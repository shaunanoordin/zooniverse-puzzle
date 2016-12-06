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
    
    this.width = 1;
    this.height = 1;
    this.boundingBox = null;  //To be defined by this.updateSize().
    this.sizeRatioX = 1;
    this.sizeRatioY = 1;
    this.pointer = {
      now: {
        x: 0,
        y: 0,
      }
    };
    
    if ("onresize" in window) { window.onresize = this.updateSize.bind(this); }
    
    this.initPuzzleBoard();
    this.runCycle = setInterval(this.run.bind(this), 1000 / APP.FRAMES_PER_SECOND);
  }
  
  initPuzzleBoard() {
    this.puzzleBoard = document.getElementById("puzzle");
    this.width = (APP.GRID_WIDTH + APP.GUTTER_SIZE) * APP.PIECE_SIZE;
    this.height = (APP.GRID_HEIGHT + APP.GUTTER_SIZE) * APP.PIECE_SIZE;
    this.puzzleBoard.style.width = this.width + "px";
    this.puzzleBoard.style.height = this.height + "px";
    
    this.puzzlePieces = [];
    for (let y = 0; y < APP.GRID_HEIGHT; y++) {
      for (let x = 0; x < APP.GRID_WIDTH; x++) {
        const newPiece = document.createElement("div");
        newPiece.className = "piece";
        newPiece.dataset.correctX = x * APP.PIECE_SIZE;
        newPiece.dataset.correctY = y * APP.PIECE_SIZE;
        newPiece.dataset.x = Math.floor(Math.random() * APP.GRID_WIDTH * APP.PIECE_SIZE);
        newPiece.dataset.y = Math.floor(Math.random() * APP.GRID_HEIGHT * APP.PIECE_SIZE);
        newPiece.style.width = APP.PIECE_SIZE + "px";
        newPiece.style.height = APP.PIECE_SIZE + "px";
        newPiece.style.left = newPiece.dataset.x + "px";
        newPiece.style.top = newPiece.dataset.y + "px";
        
        newPiece.innerHTML = x + "," + y;
        
        newPiece.onmousedown = this.onPieceMouseDown.bind(this);
        newPiece.onmouseup = this.onPieceMouseUp.bind(this);
        
        this.puzzlePieces.push(newPiece);
        this.puzzleBoard.appendChild(newPiece);
      }
    }
    
    this.puzzleBoard.onmousemove = this.onPointerMove.bind(this);
    this.updateSize();
  }
  
  updateSize() {
    let boundingBox = (this.puzzleBoard.getBoundingClientRect)
      ? this.puzzleBoard.getBoundingClientRect()
      : { left: 0, top: 0 };
    this.boundingBox = boundingBox;
    this.sizeRatioX = this.width / this.boundingBox.width;
    this.sizeRatioY = this.height / this.boundingBox.height;
  }
  
  onPointerMove(e) {
    this.pointer.now = this.getPointerXY(e);
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
  
  onPieceMouseDown(e) {
    this.activePiece = e.target;    
    stopEvent(e);
  }
  
  onPieceMouseUp(e) {
    this.activePiece = null;
    stopEvent(e);
  }
  
  run() {
    console.log(this.pointer.now.x, this.pointer.now.y);
    if (this.activePiece) {
      this.activePiece.dataset.x = this.pointer.now.x;
      this.activePiece.dataset.y = this.pointer.now.y;
      this.activePiece.style.left = this.activePiece.dataset.x + "px";
      this.activePiece.style.top = this.activePiece.dataset.y + "px";
    }
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
