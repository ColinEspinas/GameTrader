'use strict'

const Ad = use('App/Models/Ad');
const User = use('App/Models/User');
const Category = use('App/Models/Category');
const Game = use('App/Models/Game');
const Account = use('App/Models/Account');
const Platform = use('App/Models/Platform');
const { formatDistance } = require('date-fns');
const fetch = require('node-fetch');
var stringSimilarity = require('string-similarity');

class SearchController {

	async index({ view, request, response }) {

		function isInAds(ads, id) {
			for(const ad of ads) {
				if (ad.id === id) {
					return true;
				}
			}
			return false;
		}

		function cookPrivacy(ad) {
			switch(ad.category_id) {
				case 1:
					delete ad.game.key;
					if (ad.account) {
						delete ad.account;
					}
					break;
				case 2:
					delete ad.account.username;
					delete ad.account.password;
					delete ad.game;
					if (ad.account.games) {
						for (const game of ad.account.games) {
							delete game.key;
						}
					}
					break;
			}
			return ad;
		}

		const categories = await Category.all();

		let searchCategories = [];

		for (const category of categories.toJSON()) {
			searchCategories.push({name: "categories[]", display: category.name, value: category.id});
		}

		let searchGenres = [];
		let genres = [];

		await fetch(`https://api.rawg.io/api/genres`)
			.then(res => res.json())
			.then(json => { 
				genres = json.results.map(genre => {
					return genre.name;
				});
			});

		for (const genre of genres) {
			searchGenres.push({name: "genres[]", display: genre, value: genre});
		}

		let allAds = await Ad.query().with('game').with('platform').with('category').with('account').fetch();
		let results = [];

		if (request.input('categories') || request.input('searchTags') || request.input('gameAmount')) {

			let tmpResults = [];

			if (request.input('categories')) {
				for (const categoryID of request.input('categories')) {
					for (const ad of allAds.toJSON()) {
						if (ad.category_id == categoryID) {
							results.push(ad);
						}
					}
				}
			} else {
				results = allAds.toJSON();
			}
	
			if (request.input('searchTags')) {
				tmpResults = results;
				results = [];
				for (const searchValue of request.input('searchTags')) {
					for (const ad of tmpResults) {
						if (!isInAds(results, ad.id)) {
							if (stringSimilarity.compareTwoStrings(ad.title, searchValue) > 0.2) {
								if (ad.category_id == 2) {
									let games = await Game.query().where("account_id", ad.account.id).fetch();
									ad.account.games = games.toJSON();
								}
								results.push(ad);
							} 
							else {
								switch(ad.category_id) {
									case 1:
										if(stringSimilarity.compareTwoStrings(ad.game.name, searchValue) > 0.2) {
											results.push(ad);
										}
										break;
									case 2:
										let games = await Game.query().where("account_id", ad.account.id).fetch();
										ad.account.games = games.toJSON();
										for (const game of games.toJSON()) {
											if(stringSimilarity.compareTwoStrings(game.name, searchValue) > 0.2) {
												results.push(ad);
												break;
											}
										}
										break;
								}
							}
						}
					}
				}
			}

			if (request.input('gameAmount')) {
				tmpResults = results;
				results = [];
				for (const ad of tmpResults) {
					if (ad.category_id === 2) {
						if (ad.account.gameAmount == request.input('gameAmount')) {
							results.push(ad);
						}
					} else {
						results.push(ad)
					}
				}
			}

			if (request.input('genres')) {
				tmpResults = results;
				results = [];
				for (const searchGenre of request.input('genres')) {
					for (const ad of tmpResults) {
						if (!isInAds(results, ad.id)) {
							switch(ad.category_id) {
								case 1:
									for (const genre of JSON.parse(ad.game.genres)) {
										if(stringSimilarity.compareTwoStrings(genre, searchGenre) > 0.9) {
											results.push(ad);
											break;
										}
									}
									break;
								case 2:
									let games = await Game.query().where("account_id", ad.account.id).fetch();
									ad.account.games = games.toJSON();
									for (const game of games.toJSON()) {
										for (const genre of JSON.parse(game.genres)) {
											if(stringSimilarity.compareTwoStrings(genre, searchGenre) > 0.9) {
												results.push(ad);
												break;
											}
										}
										break;
									}
									break;
							}
						}
					}
				}
			}

			tmpResults = results;
			results = [];
			for (const ad of tmpResults) {
				results.push(cookPrivacy(ad));
			}

		} else {
			for (const ad of allAds.toJSON()) {
				results.push(cookPrivacy(ad));
			}
		}

		results = results.slice().sort((a, b) => b.updated_at - a.updated_at).reverse();

		const latestAds = results.map(ad => {
			switch(ad.category_id) {
				case 1:
					ad.product = ad.game;
					ad.product.genres = JSON.parse(ad.product.genres);
					break;
				case 2:
					ad.product = ad.account;
					break;
			}
			ad.date = formatDistance(new Date(ad.created_at), new Date(), { addSuffix: true })
			return ad;
		});

		switch(request.url()) {
			case "/api/ads":
				response.json(latestAds);
				break;
			default:
				return view.render('pages.search.search', { ads : latestAds, categories : searchCategories, genres : searchGenres });
		}
	}

}

module.exports = SearchController
