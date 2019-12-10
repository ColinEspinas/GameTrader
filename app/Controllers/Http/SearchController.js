'use strict'

class SearchController {

	async index({ view }) {
		return view.render('pages.search.search');
	}

}

module.exports = SearchController
