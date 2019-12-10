'use strict'

const Ad = use('App/Models/Ad');
const Game = use('App/Models/Game');
const { formatDistance } = require('date-fns');
const fetch = require('node-fetch');

class HomeController {

	async index({ view }) {
		const ads = await Ad
			.query()
			.with('game')
			.with('account')
			.with('category')
			.with('platform')
			.orderBy('updated_at', 'desc')
			.limit(10)
			.fetch()
		
		const latestAds = ads.toJSON().map(ad => {
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

		const games = await Game
			.query()
			.orderBy('updated_at', 'desc')
			.limit(5)
			.fetch()

		let sliderGames = games.toJSON();
		
		for (const game of sliderGames) {
			await fetch('https://api.rawg.io/api/games?page=1&page_size=1&search=' + game.name)
				.then(res => res.json())
				.then(json => {
					game.image = json.results[0].background_image;
				});
		}

		return view.render('pages.home', { ads : latestAds, sliderGames: sliderGames });
	}

}

module.exports = HomeController
