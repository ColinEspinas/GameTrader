/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/assets/js/app.js":
/*!************************************!*\
  !*** ./resources/assets/js/app.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("document.addEventListener(\"DOMContentLoaded\", function() {\r\n    //The first argument are the elements to which the plugin shall be initialized\r\n    //The second argument has to be at least a empty object or a object with your desired options\r\n    OverlayScrollbars(document.querySelectorAll('.main-section'), {\r\n        resize          : \"both\",\r\n        sizeAutoCapable : true,\r\n        paddingAbsolute : true,\r\n        scrollbars : {\r\n            clickScrolling : true\r\n        }\r\n    });\r\n\r\n\tlet selectButtons = document.querySelectorAll(\".select-btn\");\r\n\r\n    selectButtons.forEach(button => {\r\n        let selectBox = document.querySelector(\"#\" + button.id.slice(0, -4));\r\n        console.log(\"#\" + button.id.slice(0, -4));\r\n        button.addEventListener(\"click\", function() {\r\n            selectBox.classList.toggle(\"open\");\r\n        })\r\n    });\r\n\r\n\tlet searchBar = document.querySelector(\".search-bar\");\r\n\tlet resultsDiv = document.querySelector(\".results\");\r\n\tlet resultsBtns;\r\n\r\n\t// Research 5 games from RAWG API to put in the autocomplete\r\n\tvar search = async searchVal => {\r\n\t\tif (searchVal.length !== 0) {\r\n\t\t\tlet res = await fetch(`https://api.rawg.io/api/games?page_size=5&search=${searchVal}`);\r\n\t\t\tlet result = await res.json();\r\n\t\t\tlet games = result.results.slice(0, 5);\r\n\t\t\tlet searchResults = games.map(game => `<li class=\"result\"><button>${game.name}</button></li>`).join(\"\");\r\n\t\t\tresultsDiv.innerHTML = searchResults;\r\n\t\t\tresultsBtns = document.querySelectorAll(\".result button\");\r\n\t\t\tresultsBtns.forEach(function(result, index) {\r\n\t\t\t\tresult.addEventListener(\"click\", function() {\r\n\t\t\t\t\tsearchBar.value = this.innerText;\r\n\t\t\t\t\tresultsDiv.classList.remove('open');\r\n\t\t\t\t\tsearchBar.focus();\r\n\t\t\t\t});\r\n\t\t\t\tresult.addEventListener(\"keydown\", (e) => {\r\n\t\t\t\t\tif (e.key === \"ArrowDown\") {\r\n\t\t\t\t\t\tresultsBtns[(index + 1) % resultsBtns.length].focus();\r\n\t\t\t\t\t}\r\n\t\t\t\t\tif (e.key === \"ArrowUp\") {\r\n\t\t\t\t\t\tresultsBtns[(index - 1) % resultsBtns.length].focus();\r\n\t\t\t\t\t}\r\n\t\t\t\t});\r\n\t\t\t});\r\n\t\t}\r\n\t}\r\n\r\n\tsearchBar.addEventListener(\"input\", function() {\r\n\t\tresultsDiv.innerHTML = \"\";\r\n\t\tsearch(searchBar.value);\r\n\t\tresultsDiv.classList.add('open');\r\n\t});\r\n\r\n\tsearchBar.addEventListener(\"keydown\", (e) => {\r\n\t\tconsole.log(e.key);\r\n\t\tif (e.key === \"Escape\") {\r\n\t\t\tsearchBar.blur();\r\n\t\t\tresultsDiv.classList.remove('open');\r\n\t\t}\r\n\t\tif (e.key === \"ArrowDown\") {\r\n\t\t\tif (resultsBtns.length > 0) {\r\n\t\t\t\tresultsBtns[0].focus();\r\n\t\t\t}\r\n\t\t}\r\n\t});\r\n\r\n\t// Close popups\r\n    document.addEventListener(\"click\", (e) => {\r\n        selectButtons.forEach(button => {\r\n            let selectBox = document.querySelector(\"#\" + button.id.slice(0, -4));\r\n            if (e.target != button && !button.contains(e.target) && !selectBox.contains(e.target)) {\r\n                selectBox.classList.remove(\"open\");\r\n            }\r\n\t\t});\r\n\t\tif (e.target != resultsDiv && !resultsDiv.contains(e.target)) {\r\n\t\t\tresultsDiv.classList.remove(\"open\");\r\n\t\t}\r\n\t});\r\n});\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./resources/assets/js/app.js?");

/***/ }),

/***/ "./resources/assets/sass/app.scss":
/*!****************************************!*\
  !*** ./resources/assets/sass/app.scss ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./resources/assets/sass/app.scss?");

/***/ }),

/***/ 0:
/*!***************************************************************************!*\
  !*** multi ./resources/assets/sass/app.scss ./resources/assets/js/app.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./resources/assets/sass/app.scss */\"./resources/assets/sass/app.scss\");\nmodule.exports = __webpack_require__(/*! ./resources/assets/js/app.js */\"./resources/assets/js/app.js\");\n\n\n//# sourceURL=webpack:///multi_./resources/assets/sass/app.scss_./resources/assets/js/app.js?");

/***/ })

/******/ });