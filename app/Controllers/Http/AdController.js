'use strict'

const Ad = use('App/Models/Ad');
const User = use('App/Models/User');
const Category = use('App/Models/Category');
const Game = use('App/Models/Game');
const Account = use('App/Models/Account');
const Platform = use('App/Models/Platform');
const { validate } = use('Validator');
const fetch = require('node-fetch');
const { formatDistance } = require('date-fns');

class AdController {

    async show({ view, params }) {
		let ad = await Ad.query().with('category').where('id', params.id).first();
		let product = await ad.product().fetch();
		switch (ad.category_id)
		{
			case 1:
				const game = await Game.query().where("ad_id", ad.id).first();
				await fetch(`https://api.rawg.io/api/games/${product.gamedata_id}/screenshots`)
					.then(res => res.json())
					.then(json => { 
						ad.images = json.results.map(screenshot => {
							return screenshot.image;
						});
					});
				product.genres = JSON.parse(product.genres);
				ad.gameName = game.name;
				break;

			case 2:
				let games = await Game.query().where("account_id", product.id).fetch();
				ad.games = games.toJSON();
				ad.images = [];
				for (let game of ad.games) {
					await fetch(`https://api.rawg.io/api/games/${game.gamedata_id}/screenshots`)
					.then(res => res.json())
					.then(json => {
						json.results.map(screenshot => {
							ad.images.push(screenshot.image);
						});
					});
					game.genres = JSON.parse(game.genres);
				}
				break;

			default: break;
		}
        const seller = await User.find(ad.user_id);
        return view.render('pages.ad.show', { ad : ad.toJSON(), product : product , seller : seller });
    }

	async create({ view }) {
		const platforms = await Platform.all();
		return view.render('pages.ad.create', { platforms : platforms.toJSON() });
	}

    async store({ request, response, auth, session }) {
        try {
			await auth.check();
		} catch (error) {
            session.flash({ message: 'You must be logged to post !' })
            return response.redirect('/ads/create');
		}

		// try {
            const category = await Category.find(request.input('categoryID'));
            let rules = {};

            // Rules
            switch (category.name)
            {
                case 'Game':
                    rules = {
                        'gameName': 'required',
						'gameKey': 'required',
                    }
                    break;

                case 'Account':
                    rules = {
                        'accountUsername': 'required',
                        'accountPassword': 'required',
                        'accountGAmount': 'required|above:0'
                    }
                    break;

                default:
                    session.flash({ message: 'Category could not be found...' })
                    return response.redirect('/ads/create');
            }

            // Validations
            const validation = await validate(request.all(), rules);
            if (validation.fails()) {
                session
                    .withErrors(validation.messages())
                    .flashAll()
                
                return response.redirect('/ads/create');
            }

            // Create
            const ad = await Ad.create(request.only(['title','content', 'price']));
            ad.user_id = auth.user.id;
			ad.category_id = request.input('categoryID');
			ad.platform_id = request.input('platform');
            switch (category.name)
            {
                case 'Game':
                    const game = await Game.create();
                    game.key = request.input('gameKey');
					game.ad_id = ad.id;
                    await fetch('https://api.rawg.io/api/games?page=1&page_size=1&search=' + request.input('gameName'))
                        .then(res => res.json())
                        .then(json => { 
							game.gamedata_id = json.results[0].id;
							game.name = json.results[0].name;
							ad.thumbnail = json.results[0].background_image;
							game.genres = JSON.stringify(json.results[0].genres.map(genre => {
								return genre.name;
							}));
                         });
                    await game.save();
                    ad.product_id = game.id;
                    break;

                case 'Account':
                    const account = await Account.create();
                    account.username = request.input('accountUsername');
                    account.password = request.input('accountPassword');
                    // account.country = request.input('accountCountry');
					account.gameAmount = request.input('accountGAmount');
					
					for (const gameTag of request.input('accountGamesTags')) {
						const game = await Game.create();
						game.ad_id = ad.id;
						await fetch('https://api.rawg.io/api/games?page=1&page_size=1&search=' + gameTag)
							.then(res => res.json())
							.then(json => {
								game.name = json.results[0].name;
								game.gamedata_id = json.results[0].id;
								ad.thumbnail = json.results[0].background_image;
								game.genres = JSON.stringify(json.results[0].genres.map(genre => {
									return genre.name;
								}));
							});
						game.account_id = account.id;
						await game.save();
					}

                    account.ad_id = ad.id;
                    await account.save();
                    ad.product_id = account.id;
                    break;

                default: break;
            }
            await ad.save();

			return response.redirect('/users/ads');
		// } catch (error) {
        //     session.flash({ message: 'Something is wrong with your ad.' })
        //     return response.redirect('/ad/create');
		// }
    }

    async authUserIndex({ view, auth }) {
        const ads = await auth.user.ads()
			.with('game')
			.with('account')
			.with('category')
			.with('platform')
			.orderBy('updated_at', 'desc')
			.fetch()
		
		const userAds = ads.toJSON().map(ad => {
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

        return view.render('pages.user.ads', { ads : userAds });
	}
	
	async userIndex({ view, params }) {
		const user = User.find(params.id);
		const ads = await user.ads()
			.with('game')
			.with('account')
			.with('category')
			.with('platform')
			.orderBy('updated_at', 'desc')
			.fetch()
		
		const userAds = ads.toJSON().map(ad => {
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

        return view.render('pages.user.ads', { ads : userAds });
	}

    async delete({ response, auth, session, params }) {
		
		const ad = await Ad.find(params.id);
		if (ad.user_id === auth.user.id) {

			switch (ad.category_id)
			{
				case 1:
					const game = await Game.find(ad.product_id);
					await game.delete();
					break;

				case 2:
					const account = await Account.find(ad.product_id);
					await account.delete();
					break;

				default: break;
			}

			await ad.delete();
			session.flash({ message: 'Ad deleted successfully !' });
			return response.redirect('back');
		}
        session.flash({ message: "You can't delete this ad !" });
		return response.redirect('back');
    }

    async edit({ params, auth, view }) {
		let ad = await Ad.query().with('game').with('account').where('id', params.id).first();
		ad = ad.toJSON();
		switch(ad.category_id) {
			case 1:
				ad.product = ad.game;
				ad.product.genres = JSON.parse(ad.product.genres);
				break;
			case 2:
				ad.product = ad.account;
				break;
		}
		if (ad.user_id === auth.user.id) {
			return view.render('pages.ad.edit', { ad : ad });
		}
    }

    async update({ response, auth, request, session, params }) {
        try {
            await auth.check();
            let rules = {};
            const ad = await Ad.find(params.id);

            // Rules
            switch (ad.category_id)
            {
                case 1:
                    rules = {
                        'gameName': 'required',
						'gameKey': 'required',
                    }
                    break;

                case 2:
                    rules = {
                        'accountUsername': 'required',
                        'accountPassword': 'required',
                        'accountGAmount': 'required|above:0'
                    }
                    break;

                default:
                    session.flash({ message: 'Category could not be found...' })
                    return response.redirect(`/ads/${params.id}/edit`);
            }

            // Validations
            const validation = await validate(request.all(), rules);
            if (validation.fails()) {
                session
                    .withErrors(validation.messages())
                    .flashAll()
                
                return response.redirect(`/ads/${params.id}/edit`);
            }

            // Update
            ad.title = request.input('title');
            ad.content = request.input('content');
            ad.price = request.input('price');
            switch (ad.category_id)
            {
                case 1:
                    const game = await Game.find(ad.product_id)
                    game.key = request.input('gameKey');
                    await fetch('https://api.rawg.io/api/games?page=1&page_size=1&search=' + request.input('gameName'))
                        .then(res => res.json())
                        .then(json => { 
                            game.gamedata_id = json.results[0].id;
							ad.thumbnail = json.results[0].background_image;
							game.genres = JSON.stringify(json.results[0].genres.map(genre => {
								return genre.name;
							}));
                         });
                    await game.save();
                    break;

                case 2:
                    const account = await Account.find(ad.product_id);
                    account.username = request.input('accountUsername');
                    account.password = request.input('accountPassword');
                    account.gameAmount = request.input('accountGAmount');
                    await account.save();
                    break;

                default: break;
            }
            await ad.save();

            return response.redirect('/users/ads');
        } catch (error) {
            session.flash({ message: 'You must be logged to post !' })
            return response.redirect(`/ads/${params.id}/edit`);
        }
    }
}

module.exports = AdController
