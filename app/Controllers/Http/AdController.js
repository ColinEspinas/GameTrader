'use strict'

const Ad = use('App/Models/Ad');
const User = use('App/Models/User');

class AdController {

	async create({ view }) {
		return view.render('pages.ad.create');
	}

    async store({ request, response, auth, session }) {
        try {
            await auth.check();

            const ad = await Ad.create(request.only(['title','content']));
            ad.user_id = auth.user.id;
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
