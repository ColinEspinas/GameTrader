'use strict'

const Ad = use('App/Models/Ad');
const { formatDistance, subDays } = require('date-fns');

class HomeController {

	async index({ view }) {
		const ads = await Ad
			.query()
			.with('product')
			.with('category')
			.with('platform')
            .groupBy('updated_at')
			.limit(10)
			.fetch()
		
		const latestAds = ads.toJSON().map(ad => {
			ad.product.genres = JSON.parse(ad.product.genres);
			ad.date = formatDistance(new Date(ad.created_at), new Date(), { addSuffix: true })
			return ad;
		});
        return view.render('pages.home', { ads : latestAds });
	}

}

module.exports = HomeController
