'use strict'

const Ad = use('App/Models/Ad');
const User = use('App/Models/User');
const Category = use('App/Models/Category');
const Game = use('App/Models/Game');
const Account = use('App/Models/Account');
const Platform = use('App/Models/Platform');
const { formatDistance } = require('date-fns');

class SearchController {

	async index({ view, request }) {

		const categories = await Category.all();

		const ads = await Ad.query().with('game').with('account').fetch();
		let results = [];

		"test".toLowerCase

		if (request.input('searchTags')) {
			for (const searchValue of request.input('searchTags')) {
				for (const ad of ads.toJSON()) {
					if (ad.title.toLowerCase().includes(searchValue)) {
						results.push(ad);
					} 
					else {
						switch(ad.category_id) {
							case 1:
								if(ad.game.name.toLowerCase().includes(searchValue)) {
									results.push(ad);
								}
								break;
							case 2:
								let games = await Game.query().where("account_id", ad.account.id).fetch();
								for (const game of games.toJSON()) {
									if(game.name.toLowerCase().includes(searchValue)) {
										results.push(ad);
									}
								}
								break;
						}
					}
				}
			}
		}
		else {
			results = ads.toJSON();
		}
		
		results = results.slice().sort((a, b) => b.updated_at - a.updated_at);

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

		return view.render('pages.search.search', { ads : latestAds, categories : categories });
	}

}

module.exports = SearchController
