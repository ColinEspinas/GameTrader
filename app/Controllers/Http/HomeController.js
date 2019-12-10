'use strict'

const Ad = use('App/Models/Ad');
const Account = use('App/Models/Account');
const { formatDistance, subDays } = require('date-fns');

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
        return view.render('pages.home', { ads : latestAds });
	}

}

module.exports = HomeController
