'use strict'

const Ad = use('App/Models/Ad');

class HomeController {

	async index({ view }) {
		const ads = await Ad
            .query()
            .groupBy('updated_at')
			.limit(10)
			.fetch()
        return view.render('pages.home', { ads : ads.toJSON() });
	}

}

module.exports = HomeController
