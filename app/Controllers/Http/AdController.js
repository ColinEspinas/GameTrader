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
		let ad = await Ad.find(params.id);
		let product = await ad.product().fetch();
		switch (ad.category_id)
		{
			case 1:
				await fetch(`https://api.rawg.io/api/games/${product.gamedata_id}/screenshots`)
					.then(res => res.json())
					.then(json => { 
						ad.images = json.results.map(screenshot => {
							return screenshot.image;
						});
					});
				break;

			case 2:
				break;

			default: break;
		}
        const seller = await User.find(ad.user_id);
        return view.render('pages.ad.show', { ad : ad, seller : seller });
    }

	async create({ view }) {
		const platforms = await Platform.all();
		return view.render('pages.ad.create', { platforms : platforms.toJSON() });
	}

    async store({ request, response, auth, session }) {
        try {
            await auth.check();
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
                    return response.redirect('/ad/create');
            }

            // Validations
            const validation = await validate(request.all(), rules);
            if (validation.fails()) {
                session
                    .withErrors(validation.messages())
                    .flashAll()
                
                return response.redirect('/ad/create');
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
                    account.avatar = request.input('accountAvatar');
                    account.country = request.input('accountCountry');
                    account.phoneNumber = request.input('accountPhone');
                    account.gameAmount = request.input('accountGAmount');
                    account.ad_id = ad.id;
                    await account.save();
                    ad.product_id = account.id;
                    break;

                default: break;
            }
            await ad.save();

            return response.redirect('/ad/create');
        } catch (error) {
            session.flash({ message: 'You must be logged to post !' })
            return response.redirect('/ad/create');
        }
    }

    async authUserIndex({ view, auth }) {
        const ads = await auth.user.ads()
			.with('product')
			.with('category')
			.with('platform')
			.fetch()
		
		const userAds = ads.toJSON().map(ad => {
			ad.product.genres = JSON.parse(ad.product.genres);
			ad.date = formatDistance(new Date(ad.created_at), new Date(), { addSuffix: true })
			return ad;
		});

        return view.render('pages.user.ads', { ads : userAds });
	}
	
	async userIndex({ view, params }) {
		const user = User.find(params.id);
		const ads = await user.ads()
			.with('product')
			.with('category')
			.with('platform')
			.fetch()
		
		const userAds = ads.toJSON().map(ad => {
			ad.product.genres = JSON.parse(ad.product.genres);
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
        const ad = await Ad.query().with('product').where('id', params.id).first();
		if (ad.user_id === auth.user.id) {
			return view.render('pages.ad.edit', { ad : ad.toJSON() });
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
                    return response.redirect(`/ad/${params.id}/edit`);
            }

            // Validations
            const validation = await validate(request.all(), rules);
            if (validation.fails()) {
                session
                    .withErrors(validation.messages())
                    .flashAll()
                
                return response.redirect(`/ad/${params.id}/edit`);
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
                    account.avatar = request.input('accountAvatar');
                    account.country = request.input('accountCountry');
                    account.phoneNumber = request.input('accountPhone');
                    account.gameAmount = request.input('accountGAmount');
                    await account.save();
                    break;

                default: break;
            }
            await ad.save();

            return response.redirect('/user/ads');
        } catch (error) {
            session.flash({ message: 'You must be logged to post !' })
            return response.redirect(`/ad/${params.id}/edit`);
        }
    }
}

module.exports = AdController
