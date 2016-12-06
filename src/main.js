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
    this.initPuzzleBoard();
    this.runCycle = setInterval(this.run.bind(this), 1000 / APP.FRAMES_PER_SECOND);
  }
  
  initPuzzleBoard() {
    this.puzzleBoard = document.getElementById("puzzle");
    this.puzzleBoard.style.width = (APP.GRID_WIDTH + APP.GUTTER_SIZE) * APP.PIECE_SIZE + "px";
    this.puzzleBoard.style.height = (APP.GRID_HEIGHT + APP.GUTTER_SIZE) * APP.PIECE_SIZE + "px";
    
    this.puzzlePieces = [];
    for (let y = 0; y < APP.GRID_HEIGHT; y++) {
      for (let x = 0; x < APP.GRID_WIDTH; x++) {
        const newPiece = document.createElement("div");
        newPiece.className = "piece";
        newPiece.onmousedown = this.onPieceMouseDown.bind(this);
        newPiece.dataset.correctX = x * APP.PIECE_SIZE;
        newPiece.dataset.correctY = y * APP.PIECE_SIZE;
        newPiece.dataset.x = Math.floor(Math.random() * APP.GRID_WIDTH * APP.PIECE_SIZE);
        newPiece.dataset.y = Math.floor(Math.random() * APP.GRID_HEIGHT * APP.PIECE_SIZE);
        newPiece.style.width = APP.PIECE_SIZE + "px";
        newPiece.style.height = APP.PIECE_SIZE + "px";
        newPiece.style.left = newPiece.dataset.x + "px";
        newPiece.style.top = newPiece.dataset.y + "px";
        newPiece.innerHTML = x + "," + y;
        this.puzzlePieces.push(newPiece);
        this.puzzleBoard.appendChild(newPiece);
      }
    }
  }
  
  onPieceMouseDown(e) {
    this.activePiece = e.target;
    
    stopEvent(e);
  }
  
  run() {
    if (this.activePiece) {
      this.activePiece.dataset.x = 0;
      this.activePiece.dataset.y = 0;
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
