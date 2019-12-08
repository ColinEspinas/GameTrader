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

	let searchBarTaggle = new Taggle('example1',{
		placeholder: 'Search for games...',
		allowDuplicates: false,
		preserveCase: true,
		clearOnBlur: false
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
			let searchResults = games.map(game => `<li class="result"><button>${game.name}</button></li>`).join("");
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
	});

	// Close menu
	document.querySelector(".close-btn").addEventListener("click", (e) => {
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



