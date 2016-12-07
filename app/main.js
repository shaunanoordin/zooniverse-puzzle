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
	    this.easyMode = false;
	    this.simpleMode = false;
	    if (window.location && window.location.search && window.location.search.indexOf) {
	      this.easyMode = window.location.search.indexOf(APP.EASYMODE_STRING) >= 0;
	      this.simpleMode = window.location.search.indexOf(APP.SIMPLEMODE_STRING) >= 0;
	    }

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
	      now: {
	        x: 0,
	        y: 0
	      }
	    };

	    if ("onresize" in window) {
	      window.onresize = this.updateSize.bind(this);
	    }

	    this.initPuzzleBoard();
	    this.runCycle = setInterval(this.run.bind(this), 1000 / APP.FRAMES_PER_SECOND);

	    document.getElementById("help").onclick = this.onHelpClick.bind(this);
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
	      var distX = Math.abs(e.target.dataset.x - e.target.dataset.correctX);
	      var distY = Math.abs(e.target.dataset.y - e.target.dataset.correctY);
	      var dist = Math.sqrt(distX * distX + distY * distY);
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

/***/ }
/******/ ]);