/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*  
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Zooniverse Puzzle
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ==========
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     A Zooniverse puzzle for Christmas.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     (Shaun A. Noordin || shaunanoordin.com || 20161102)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ********************************************************************************
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _constants = __webpack_require__(1);

	var APP = _interopRequireWildcard(_constants);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//Naming note: all caps.

	/*  Primary App Class
	 */
	//==============================================================================
	var App = function () {
	  function App() {
	    _classCallCheck(this, App);

	    this.state = APP.STATE_IDLE;
	    this.activePiece = null;
	    this.puzzleBoard = null;

	    this.width = 1;
	    this.height = 1;
	    this.boundingBox = null; //To be defined by this.updateSize().
	    this.sizeRatioX = 1;
	    this.sizeRatioY = 1;
	    this.pointer = {
	      offset: {
	        x: 0,
	        y: 0
	      },
	      start: {
	        x: 0,
	        y: 0
	      },
	      now: {
	        x: 0,
	        y: 0
	      }
	    };

	    this.easyMode = false;
	    this.simpleMode = false;
	    if (window.location && window.location.search && window.location.search.indexOf) {
	      this.easyMode = window.location.search.indexOf(APP.EASYMODE_STRING) >= 0;
	      this.simpleMode = window.location.search.indexOf(APP.SIMPLEMODE_STRING) >= 0;
	    }

	    this.cheatCode = [APP.KEY_CODES.P, APP.KEY_CODES.E, APP.KEY_CODES.N, APP.KEY_CODES.G, APP.KEY_CODES.U, APP.KEY_CODES.I, APP.KEY_CODES.N, APP.KEY_CODES.S];
	    this.cheatCodeLevel = 0;
	    this.goSolveEverything = false;

	    if ("onresize" in window) {
	      window.onresize = this.updateSize.bind(this);
	    }
	    if ("onkeypress" in window) {
	      window.onkeypress = this.onKeyPress.bind(this);
	    }

	    this.initPuzzleBoard();
	    this.runCycle = setInterval(this.run.bind(this), 1000 / APP.FRAMES_PER_SECOND);

	    document.getElementById("help-button").onclick = this.onHelpClick.bind(this);
	    document.getElementById("hint-button").onclick = this.onHintClick.bind(this);
	  }

	  _createClass(App, [{
	    key: "initPuzzleBoard",
	    value: function initPuzzleBoard() {
	      var imageFile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "penguins.jpg";
	      var gridWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : APP.GRID_WIDTH;
	      var gridHeight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : APP.GRID_HEIGHT;

	      this.puzzleBoard = document.getElementById("puzzle");
	      this.width = (gridWidth + APP.GUTTER_SIZE) * APP.PIECE_SIZE;
	      this.height = (gridHeight + APP.GUTTER_SIZE) * APP.PIECE_SIZE;
	      this.puzzleBoard.style.width = this.width + "px";
	      this.puzzleBoard.style.height = this.height + "px";

	      var grid = document.getElementById("grid");
	      grid.style.width = gridWidth * APP.PIECE_SIZE + "px";
	      grid.style.height = gridHeight * APP.PIECE_SIZE + "px";
	      grid.style.left = APP.GUTTER_SIZE / 2 * APP.PIECE_SIZE + "px";
	      grid.style.top = APP.GUTTER_SIZE / 2 * APP.PIECE_SIZE + "px";

	      var hint = document.getElementById("hint");
	      console.log(hint);
	      hint.style.width = gridWidth * APP.PIECE_SIZE + "px";
	      hint.style.height = gridHeight * APP.PIECE_SIZE + "px";
	      hint.style.left = APP.GUTTER_SIZE / 2 * APP.PIECE_SIZE + "px";
	      hint.style.top = APP.GUTTER_SIZE / 2 * APP.PIECE_SIZE + "px";
	      hint.style.backgroundImage = "url('assets/" + imageFile + "')";

	      if (this.simpleMode) {
	        gridWidth = gridWidth / APP.SIMPLEMODE_MULTIPLIER;
	        gridHeight = gridHeight / APP.SIMPLEMODE_MULTIPLIER;
	      }

	      this.puzzlePieces = [];
	      for (var y = 0; y < gridHeight; y++) {
	        for (var x = 0; x < gridWidth; x++) {
	          var newPiece = document.createElement("div");
	          newPiece.className = "piece";
	          newPiece.dataset.correctX = (x + APP.GUTTER_SIZE / 2) * APP.PIECE_SIZE;
	          newPiece.dataset.correctY = (y + APP.GUTTER_SIZE / 2) * APP.PIECE_SIZE;
	          newPiece.dataset.x = Math.floor(Math.random() * (gridWidth + APP.GUTTER_SIZE / 2) * APP.PIECE_SIZE);
	          newPiece.dataset.y = Math.floor(Math.random() * (gridHeight + APP.GUTTER_SIZE / 2) * APP.PIECE_SIZE);
	          newPiece.style.width = APP.PIECE_SIZE + "px";
	          newPiece.style.height = APP.PIECE_SIZE + "px";
	          newPiece.style.left = newPiece.dataset.x + "px";
	          newPiece.style.top = newPiece.dataset.y + "px";

	          newPiece.style.backgroundImage = "url('assets/" + imageFile + "')";
	          newPiece.style.backgroundPosition = "-" + x * APP.PIECE_SIZE + "px -" + y * APP.PIECE_SIZE + "px";

	          if (this.simpleMode) {
	            newPiece.dataset.correctX = x * APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER + APP.GUTTER_SIZE / 2 * APP.PIECE_SIZE;
	            newPiece.dataset.correctY = y * APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER + APP.GUTTER_SIZE / 2 * APP.PIECE_SIZE;
	            newPiece.style.width = APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER + "px";
	            newPiece.style.height = APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER + "px";
	            newPiece.style.backgroundImage = "url('assets/" + imageFile + "')";
	            newPiece.style.backgroundPosition = "-" + x * APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER + "px -" + y * APP.PIECE_SIZE * APP.SIMPLEMODE_MULTIPLIER + "px";
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

	      if ("onmousemove" in this.puzzleBoard) {
	        this.puzzleBoard.onmousemove = this.onPointerMove.bind(this);
	      }
	      if ("ontouchmove" in this.puzzleBoard) {
	        this.puzzleBoard.ontouchmove = this.onPointerMove.bind(this);
	      }
	      this.updateSize();
	      this.checkWinStatus();
	    }
	  }, {
	    key: "updateSize",
	    value: function updateSize() {
	      var boundingBox = this.puzzleBoard.getBoundingClientRect ? this.puzzleBoard.getBoundingClientRect() : { left: 0, top: 0 };
	      this.boundingBox = boundingBox;
	      this.sizeRatioX = this.width / this.boundingBox.width;
	      this.sizeRatioY = this.height / this.boundingBox.height;
	    }
	  }, {
	    key: "onKeyPress",
	    value: function onKeyPress(e) {
	      var key = getKeyCode(e);
	      if (this.cheatCodeLevel < this.cheatCode.length && key === this.cheatCode[this.cheatCodeLevel]) {
	        this.cheatCodeLevel++;
	      } else {
	        this.cheatCodeLevel = 0;
	      }

	      if (this.cheatCodeLevel >= this.cheatCode.length) {
	        this.goSolveEverything = true;
	      }
	    }
	  }, {
	    key: "checkWinStatus",
	    value: function checkWinStatus() {
	      var winStatus = true;
	      if (this.activePiece) {
	        winStatus = false;
	      }

	      this.puzzlePieces.map(function (piece) {
	        winStatus = winStatus && piece.dataset.x === piece.dataset.correctX && piece.dataset.y === piece.dataset.correctY;
	      });

	      var title = document.getElementById("title");
	      if (winStatus) {
	        title.className = "winner";
	        title.innerHTML = APP.WINNER_MESSAGE;
	        this.goSolveEverything = false;
	      } else {
	        title.className = "";
	        title.innerHTML = APP.START_MESSAGE;
	      }
	    }
	  }, {
	    key: "onHelpClick",
	    value: function onHelpClick() {
	      var _this = this;

	      if (!this.puzzleBoard) return;

	      this.puzzlePieces.map(function (piece) {
	        if (piece.dataset.x !== piece.dataset.correctX || piece.dataset.y !== piece.dataset.correctY) {
	          _this.puzzleBoard.appendChild(piece);
	        }
	      });
	    }
	  }, {
	    key: "onHintClick",
	    value: function onHintClick() {
	      var hint = document.getElementById("hint");
	      if (hint.className === "") {
	        hint.className = "show-hint";
	      } else {
	        hint.className = "";
	      }
	    }
	  }, {
	    key: "onPointerMove",
	    value: function onPointerMove(e) {
	      this.pointer.now = this.getPointerXY(e);
	      return stopEvent(e);
	    }
	  }, {
	    key: "onPiecePointerOver",
	    value: function onPiecePointerOver(e) {
	      if (!this.activePiece && !(e.target.dataset.x === e.target.dataset.correctX && e.target.dataset.y === e.target.dataset.correctY)) {
	        this.puzzleBoard.appendChild(e.target);
	      }
	      return stopEvent(e);
	    }
	  }, {
	    key: "getPointerXY",
	    value: function getPointerXY(e) {
	      var clientX = 0;
	      var clientY = 0;
	      if (e.clientX && e.clientY) {
	        clientX = e.clientX;
	        clientY = e.clientY;
	      } else if (e.touches && e.touches.length > 0 && e.touches[0].clientX && e.touches[0].clientY) {
	        clientX = e.touches[0].clientX;
	        clientY = e.touches[0].clientY;
	      }
	      var inputX = (clientX - this.boundingBox.left) * this.sizeRatioX;
	      var inputY = (clientY - this.boundingBox.top) * this.sizeRatioY;
	      return { x: inputX, y: inputY };
	    }
	  }, {
	    key: "onPiecePointerStart",
	    value: function onPiecePointerStart(e) {
	      this.pointer.start = this.getPointerXY(e);
	      this.activePiece = e.target;
	      this.activePiece.className = "piece active";
	      this.pointer.offset.x = e.target.dataset.x - this.pointer.now.x;
	      this.pointer.offset.y = e.target.dataset.y - this.pointer.now.y;
	      this.puzzleBoard.appendChild(this.activePiece);
	      return stopEvent(e);
	    }
	  }, {
	    key: "onPiecePointerEnd",
	    value: function onPiecePointerEnd(e) {
	      this.activePiece = null;

	      var distX = Math.abs(this.pointer.start.x - this.pointer.now.x);
	      var distY = Math.abs(this.pointer.start.y - this.pointer.now.y);
	      var dist = Math.sqrt(distX * distX + distY * distY);
	      console.log(dist);
	      if (dist < APP.AUTO_ANSWER_CLICK_DISTANCE) {
	        e.target.dataset.x = e.target.dataset.correctX;
	        e.target.dataset.y = e.target.dataset.correctY;
	      }

	      distX = Math.abs(e.target.dataset.x - e.target.dataset.correctX);
	      distY = Math.abs(e.target.dataset.y - e.target.dataset.correctY);
	      dist = Math.sqrt(distX * distX + distY * distY);
	      if (dist < APP.SNAP_DISTANCE || this.simpleMode && dist < APP.SNAP_DISTANCE * APP.SIMPLEMODE_MULTIPLIER || this.easyMode && dist < APP.EASYMODE_SUPER_SNAP) {
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
	  }, {
	    key: "run",
	    value: function run() {
	      var _this2 = this;

	      if (this.activePiece) {
	        this.activePiece.dataset.x = this.pointer.now.x + this.pointer.offset.x;
	        this.activePiece.dataset.y = this.pointer.now.y + this.pointer.offset.y;
	        this.activePiece.style.left = this.activePiece.dataset.x + "px";
	        this.activePiece.style.top = this.activePiece.dataset.y + "px";
	      } else if (this.goSolveEverything) {
	        for (var i = 0; i < this.puzzlePieces.length; i++) {
	          var piece = this.puzzlePieces[i];
	          if (piece.dataset.x !== piece.dataset.correctX || piece.dataset.y !== piece.dataset.correctY) {
	            piece.dataset.x = piece.dataset.correctX;
	            piece.dataset.y = piece.dataset.correctY;
	            piece.className = "piece correct";
	            break;
	          }
	        }
	        this.checkWinStatus();
	      }

	      this.puzzlePieces.map(function (piece) {
	        if (piece !== _this2.activePiece) {
	          if (piece.dataset.x < 0) {
	            piece.dataset.x = 0;
	          }
	          if (piece.dataset.y < 0) {
	            piece.dataset.y = 0;
	          }
	          if (piece.dataset.x > _this2.width - APP.PIECE_SIZE) {
	            piece.dataset.x = _this2.width - APP.PIECE_SIZE;
	          }
	          if (piece.dataset.y > _this2.height - APP.PIECE_SIZE) {
	            piece.dataset.y = _this2.height - APP.PIECE_SIZE;
	          }
	          piece.style.left = piece.dataset.x + "px";
	          piece.style.top = piece.dataset.y + "px";
	        }
	      });
	    }
	  }]);

	  return App;
	}();
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

	function getKeyCode(e) {
	  //KeyboardEvent.keyCode is the most reliable identifier for a keyboard event
	  //at the moment, but unfortunately it's being deprecated.
	  if (e.keyCode) {
	    return e.keyCode;
	  }

	  //KeyboardEvent.code and KeyboardEvent.key are the 'new' standards, but it's
	  //far from being standardised between browsers.
	  if (e.code && APP.KEY_VALUES[e.code]) {
	    return APP.KEY_VALUES[e.code];
	  } else if (e.key && APP.KEY_VALUES[e.key]) {
	    return APP.KEY_VALUES[e.key];
	  }

	  return 0;
	}
	//==============================================================================

	/*  Initialisations
	 */
	//==============================================================================
	var app;
	window.onload = function () {
	  window.app = new App();
	};
	//==============================================================================

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var FRAMES_PER_SECOND = exports.FRAMES_PER_SECOND = 50;

	var PIECE_SIZE = exports.PIECE_SIZE = 50; //80;
	var GRID_WIDTH = exports.GRID_WIDTH = 20; //8;
	var GRID_HEIGHT = exports.GRID_HEIGHT = 15; //6;
	var GUTTER_SIZE = exports.GUTTER_SIZE = 2;

	var STATE_IDLE = exports.STATE_IDLE = 0;
	var STATE_MOVING = exports.STATE_MOVING = 1;

	var SNAP_DISTANCE = exports.SNAP_DISTANCE = PIECE_SIZE / 1.2;
	var WINNER_MESSAGE = exports.WINNER_MESSAGE = "A WINNER IS YOU! MERRY CHRISTMAS FROM THE ZOONIVERSE!";
	var START_MESSAGE = exports.START_MESSAGE = "It's a Zooniverse Christmas puzzle!";

	var EASYMODE_STRING = exports.EASYMODE_STRING = "easymode";
	var EASYMODE_SUPER_SNAP = exports.EASYMODE_SUPER_SNAP = PIECE_SIZE * 100;

	var SIMPLEMODE_STRING = exports.SIMPLEMODE_STRING = "simplemode";
	var SIMPLEMODE_MULTIPLIER = exports.SIMPLEMODE_MULTIPLIER = 5;

	var AUTO_ANSWER_CLICK_DISTANCE = exports.AUTO_ANSWER_CLICK_DISTANCE = PIECE_SIZE / 2;

	var KEY_CODES = exports.KEY_CODES = {
	  LEFT: 37,
	  UP: 38,
	  RIGHT: 39,
	  DOWN: 40,
	  ENTER: 13,
	  SPACE: 32,
	  ESCAPE: 27,
	  TAB: 9,
	  SHIFT: 16,

	  A: 65,
	  B: 66,
	  C: 67,
	  D: 68,
	  E: 69,
	  F: 70,
	  G: 71,
	  H: 72,
	  I: 73,
	  J: 74,
	  K: 75,
	  L: 76,
	  M: 77,
	  N: 78,
	  O: 79,
	  P: 80,
	  Q: 81,
	  R: 82,
	  S: 83,
	  T: 84,
	  U: 85,
	  V: 86,
	  W: 87,
	  X: 88,
	  Y: 89,
	  Z: 90,

	  NUM0: 48,
	  NUM1: 49,
	  NUM2: 50,
	  NUM3: 51,
	  NUM4: 52,
	  NUM5: 53,
	  NUM6: 54,
	  NUM7: 55,
	  NUM8: 56,
	  NUM9: 57
	};

	var KEY_VALUES = exports.KEY_VALUES = {
	  "ArrowLeft": KEY_CODES.LEFT,
	  "Left": KEY_CODES.LEFT,
	  "ArrowUp": KEY_CODES.UP,
	  "Up": KEY_CODES.UP,
	  "ArrowDown": KEY_CODES.DOWN,
	  "Down": KEY_CODES.DOWN,
	  "ArrowRight": KEY_CODES.RIGHT,
	  "Right": KEY_CODES.RIGHT,
	  "Enter": KEY_CODES.ENTER,
	  "Space": KEY_CODES.SPACE,
	  " ": KEY_CODES.SPACE,
	  "Esc": KEY_CODES.ESCAPE,
	  "Escape": KEY_CODES.ESCAPE,
	  "Tab": KEY_CODES.TAB,
	  "Shift": KEY_CODES.SHIFT,
	  "ShiftLeft": KEY_CODES.SHIFT,
	  "ShiftRight": KEY_CODES.SHIFT,

	  "A": KEY_CODES.A,
	  "KeyA": KEY_CODES.A,
	  "B": KEY_CODES.B,
	  "KeyB": KEY_CODES.B,
	  "C": KEY_CODES.C,
	  "KeyC": KEY_CODES.C,
	  "D": KEY_CODES.D,
	  "KeyD": KEY_CODES.D,
	  "E": KEY_CODES.E,
	  "KeyE": KEY_CODES.E,
	  "F": KEY_CODES.F,
	  "KeyF": KEY_CODES.F,
	  "G": KEY_CODES.G,
	  "KeyG": KEY_CODES.G,
	  "H": KEY_CODES.H,
	  "KeyH": KEY_CODES.H,
	  "I": KEY_CODES.I,
	  "KeyI": KEY_CODES.I,
	  "J": KEY_CODES.J,
	  "KeyJ": KEY_CODES.J,
	  "K": KEY_CODES.K,
	  "KeyK": KEY_CODES.K,
	  "L": KEY_CODES.L,
	  "KeyL": KEY_CODES.L,
	  "M": KEY_CODES.M,
	  "KeyM": KEY_CODES.M,
	  "N": KEY_CODES.N,
	  "KeyN": KEY_CODES.N,
	  "O": KEY_CODES.O,
	  "KeyO": KEY_CODES.O,
	  "P": KEY_CODES.P,
	  "KeyP": KEY_CODES.P,
	  "Q": KEY_CODES.Q,
	  "KeyQ": KEY_CODES.Q,
	  "R": KEY_CODES.R,
	  "KeyR": KEY_CODES.R,
	  "S": KEY_CODES.S,
	  "KeyS": KEY_CODES.S,
	  "T": KEY_CODES.T,
	  "KeyT": KEY_CODES.T,
	  "U": KEY_CODES.U,
	  "KeyU": KEY_CODES.U,
	  "V": KEY_CODES.V,
	  "KeyV": KEY_CODES.V,
	  "W": KEY_CODES.W,
	  "KeyW": KEY_CODES.W,
	  "X": KEY_CODES.X,
	  "KeyX": KEY_CODES.X,
	  "Y": KEY_CODES.Y,
	  "KeyY": KEY_CODES.Y,
	  "Z": KEY_CODES.Z,
	  "KeyZ": KEY_CODES.Z,

	  "0": KEY_CODES.NUM0,
	  "Digit0": KEY_CODES.NUM0,
	  "1": KEY_CODES.NUM1,
	  "Digit1": KEY_CODES.NUM1,
	  "2": KEY_CODES.NUM2,
	  "Digit2": KEY_CODES.NUM2,
	  "3": KEY_CODES.NUM3,
	  "Digit3": KEY_CODES.NUM3,
	  "4": KEY_CODES.NUM4,
	  "Digit4": KEY_CODES.NUM4,
	  "5": KEY_CODES.NUM5,
	  "Digit5": KEY_CODES.NUM5,
	  "6": KEY_CODES.NUM6,
	  "Digit6": KEY_CODES.NUM6,
	  "7": KEY_CODES.NUM7,
	  "Digit7": KEY_CODES.NUM7,
	  "8": KEY_CODES.NUM8,
	  "Digit8": KEY_CODES.NUM8,
	  "9": KEY_CODES.NUM9,
	  "Digit9": KEY_CODES.NUM9
	};

/***/ }
/******/ ]);