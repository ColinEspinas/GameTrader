'use strict'

const Ad = use('App/Models/Ad');
const User = use('App/Models/User');
const Category = use('App/Models/Category');
const Game = use('App/Models/Game');
const Account = use('App/Models/Account');
const { validate } = use('Validator');
const fetch = require('node-fetch');

class AdController {

	async create({ view }) {
		return view.render('pages.ad.create');
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
                        'gameKey': 'required'
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
            const ad = await Ad.create(request.only(['title','content']));
            ad.user_id = auth.user.id;
            ad.category_id = request.input('categoryID');
            switch (category.name)
            {
                case 'Game':
                    const game = await Game.create();
                    game.key = request.input('gameKey');
                    game.ad_id = ad.id;
                    let gameDataId;
                    await fetch('https://api.rawg.io/api/games?page=1&page_size=1&search=' + request.input('gameName'))
                        .then(res => res.json())
                        .then(json => { 
                            gameDataId = json.results[0].id;
                            ad.thumbnail = json.results[0].background_image;
                         });
                    game.gamedata_id = gameDataId;
                    game.thum
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
        const ads = await auth.user.ads().fetch();
        return view.render('pages.user.ads', { ads : ads.toJSON() });
	}
	
	async userIndex({ view, params }) {
		const user = User.find(params.id);
		const ads = await user.ads().fetch();
        return view.render('pages.user.ads', { ads : ads.toJSON() });
	}

    async delete({ response, session, params }) {
        const ad = await Ad.find(params.id);

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

    async edit({ params, view }) {
        const ad = await Ad.find(params.id);
        return view.render('pages.editing', { ad : ad });
    }

    async update({ response, request, session, params }) {
        const ad = await Ad.find(params.id);

        ad.title = request.all().title;
        ad.content = request.all().content;

        await ad.save();

        session.flash({ message: 'Your Ad has been updated.' });
        return response.redirect('/ad-show');
    }
}

module.exports = AdController
