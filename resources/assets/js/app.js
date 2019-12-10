document.addEventListener("DOMContentLoaded", function() {
    //The first argument are the elements to which the plugin shall be initialized
    //The second argument has to be at least a empty object or a object with your desired options
    OverlayScrollbars(document.querySelectorAll('.main-section'), {
        sizeAutoCapable : true,
        paddingAbsolute : true,
        scrollbars : {
            clickScrolling : true
        }
	});
	
	OverlayScrollbars(document.querySelectorAll('.side-nav-body'), {
        sizeAutoCapable : true,
        paddingAbsolute : true,
        scrollbars : {
            clickScrolling : true
        }
    });

	let selectButtons = document.querySelectorAll(".select-btn");

    selectButtons.forEach(button => {
        let selectBox = document.querySelector("#" + button.id.slice(0, -4));
        console.log("#" + button.id.slice(0, -4));
        button.addEventListener("click", function() {
            selectBox.classList.toggle("open");
        })
    });

	let searchBarTaggle = new Taggle('searchTaggle',{
		placeholder: 'Search for games...',
		allowDuplicates: false,
		preserveCase: true,
		clearOnBlur: false,
		hiddenInputName: "SearchTags[]"
	});

	let searchBar = searchBarTaggle.getInput();

	// let searchBar = document.querySelector(".search-bar");
	let resultsDiv = document.querySelector(".results");
	let resultsBtns;

	// Research 5 games from RAWG API to put in the autocomplete
	var search = async searchVal => {
		if (searchVal.length !== 0) {
			let res = await fetch(`https://api.rawg.io/api/games?page_size=5&search=${searchVal}`);
			let result = await res.json();
			let games = result.results.slice(0, 5);
			let searchResults = games.map(game => `<li class="result"><button type="button">${game.name}</button></li>`).join("");
			resultsDiv.innerHTML = searchResults;
			resultsBtns = document.querySelectorAll(".result button");
			resultsBtns.forEach(function(result, index) {
				result.addEventListener("click", function() {
					searchBar.value = this.innerText;
					resultsDiv.classList.remove('open');
					searchBar.focus();
				});
				result.addEventListener("keydown", (e) => {
					if (e.key === "ArrowDown") {
						resultsBtns[(index + 1) % resultsBtns.length].focus();
					}
					if (e.key === "ArrowUp") {
						if (index - 1 < 0) {
							resultsBtns[resultsBtns.length - 1].focus();
						} 
						else {
							resultsBtns[(index - 1) % resultsBtns.length].focus();
						}
					}
				});
			});
		}
	}

	searchBar.addEventListener("input", function() {
		resultsDiv.innerHTML = "";
		search(searchBar.value);
		resultsDiv.classList.add('open');
	});

	searchBar.addEventListener("keydown", (e) => {
		console.log(e.key);
		if (e.key === "Escape") {
			searchBar.blur();
			resultsDiv.classList.remove('open');
		}
		if (e.key === "ArrowDown") {
			if (resultsBtns.length > 0) {
				resultsBtns[0].focus();
			}
		}
	});

	// Ad Game search :
	let gameBar = document.querySelector("#game-bar");
	let gameResultsDiv = document.querySelector(".results-ad-games");
	let gameResultsBtns;

	// Research 5 games from RAWG API to put in the autocomplete
	if (gameBar) {
		var adGameSearch = async searchVal => {
			if (searchVal.length !== 0) {
				let res = await fetch(`https://api.rawg.io/api/games?page_size=5&search=${searchVal}`);
				let result = await res.json();
				let games = result.results.slice(0, 5);
				let searchResults = games.map(game => `<li class="ad-game-result"><button type="button">${game.name}</button></li>`).join("");
				gameResultsDiv.innerHTML = searchResults;
				gameResultsBtns = document.querySelectorAll(".ad-game-result button");
				gameResultsBtns.forEach(function(result, index) {
					result.addEventListener("click", function() {
						gameBar.value = this.innerText;
						gameResultsDiv.classList.remove('open');
						gameBar.focus();
					});
					result.addEventListener("keydown", (e) => {
						if (e.key === "ArrowDown") {
							gameResultsBtns[(index + 1) % gameResultsBtns.length].focus();
						}
						if (e.key === "ArrowUp") {
							if (index - 1 < 0) {
								gameResultsBtns[gameResultsBtns.length - 1].focus();
							} 
							else {
								gameResultsBtns[(index - 1) % gameResultsBtns.length].focus();
							}
						}
					});
				});
			}
		}
	
		gameBar.addEventListener("input", function() {
			gameResultsDiv.innerHTML = "";
			adGameSearch(gameBar.value);
			gameResultsDiv.classList.add('open');
		});
	
		gameBar.addEventListener("keydown", (e) => {
			console.log(e.key);
			if (e.key === "Escape") {
				gameBar.blur();
				gameResultsDiv.classList.remove('open');
			}
			if (e.key === "ArrowDown") {
				if (gameResultsBtns.length > 0) {
					gameResultsBtns[0].focus();
				}
			}
		});
	}
	

	// Account games :
	if (document.querySelector('#accountGamesTaggle')) {
		let accountBarTaggle = new Taggle('accountGamesTaggle',{
			placeholder: 'Add at least 1 games...',
			allowDuplicates: false,
			preserveCase: true,
			clearOnBlur: false,
			hiddenInputName: "accountGamesTags[]"
		});
	
		let accountBar = accountBarTaggle.getInput();
	
		let accountResultsDiv = document.querySelector(".results-account-games");
		let accountResultsBtns;
	
		if (accountBar) {
			var accountGameSearch = async searchVal => {
				if (searchVal.length !== 0) {
					let res = await fetch(`https://api.rawg.io/api/games?page_size=5&search=${searchVal}`);
					let result = await res.json();
					let games = result.results.slice(0, 5);
					let searchResults = games.map(game => `<li class="account-game-result"><button type="button">${game.name}</button></li>`).join("");
					accountResultsDiv.innerHTML = searchResults;
					accountResultsBtns = document.querySelectorAll(".account-game-result button");
					accountResultsBtns.forEach(function(result, index) {
						result.addEventListener("click", function() {
							accountBar.value = this.innerText;
							accountResultsDiv.classList.remove('open');
							accountBar.focus();
						});
						result.addEventListener("keydown", (e) => {
							if (e.key === "ArrowDown") {
								accountResultsBtns[(index + 1) % accountResultsBtns.length].focus();
							}
							if (e.key === "ArrowUp") {
								if (index - 1 < 0) {
									accountResultsBtns[accountResultsBtns.length - 1].focus();
								} 
								else {
									accountResultsBtns[(index - 1) % accountResultsBtns.length].focus();
								}
							}
						});
					});
				}
			}
		
			accountBar.addEventListener("input", function() {
				accountResultsDiv.innerHTML = "";
				accountGameSearch(accountBar.value);
				accountResultsDiv.classList.add('open');
			});
		
			accountBar.addEventListener("keydown", (e) => {
				console.log(e.key);
				if (e.key === "Escape") {
					accountBar.blur();
					accountResultsDiv.classList.remove('open');
				}
				if (e.key === "ArrowDown") {
					if (accountResultsBtns.length > 0) {
						accountResultsBtns[0].focus();
					}
				}
			});	
		}
	}

	// Close popups
    document.addEventListener("click", (e) => {
        selectButtons.forEach(button => {
            let selectBox = document.querySelector("#" + button.id.slice(0, -4));
            if (e.target != button && !button.contains(e.target) && !selectBox.contains(e.target)) {
                selectBox.classList.remove("open");
            }
		});
		if (e.target != resultsDiv && !resultsDiv.contains(e.target)) {
			resultsDiv.classList.remove("open");
		}
		if (e.target != accountResultsDiv && !accountResultsDiv.contains(e.target)) {
			accountResultsDiv.classList.remove("open");
		}
		if (e.target != gameResultsDiv && !gameResultsDiv.contains(e.target)) {
			gameResultsDiv.classList.remove("open");
		}
	});

	// Close menu
	document.querySelector(".close-btn").addEventListener("click", (e) => {
		console.log("test");
		document.querySelector(".side-nav").style.transform = "translateX(-100%)";
		document.querySelector(".side-nav").style.width = 0;
		document.querySelector("main").style.width = "100%";
		document.querySelector("main").style.marginLeft = 0;
		document.querySelector(".menu-btn").style.marginRight = "25px";
		document.querySelector(".menu-btn").style.opacity = "1";
		document.querySelector(".menu-btn").style.width = "auto";
	});

	document.querySelector(".menu-btn").addEventListener("click", (e) => {
		document.querySelector(".side-nav").style.transform = "translateX(0)";
		document.querySelector(".side-nav").style.width = "320px";
		document.querySelector("main").style.width = "calc(100% - 320px)";
		document.querySelector("main").style.marginLeft = "320px";
		document.querySelector(".menu-btn").style.marginRight = 0;
		document.querySelector(".menu-btn").style.opacity = 0;
		document.querySelector(".menu-btn").style.width = 0;
	});
});



