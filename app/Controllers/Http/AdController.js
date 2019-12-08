'use strict'

const Ad = use('App/Models/Ad');

class AdController {

    async create({ request, response, auth, session }) {
        try {
            await auth.check();

            const ad = await Ad.create(request.only(['title','content']));
            ad.user_id = auth.user.id;
            await ad.save();

            return response.redirect('/ad-post');
        } catch (error) {
            session.flash({ message: 'You must be logged to post !' })
            return response.redirect('/ad-post');
        }
    }

    async userIndex({ view, auth }) {
        const ads = await auth.user.ads().fetch();
        return view.render('pages.advert', { ads : ads.toJSON() });
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

    async latest({ view }) {
        const ads = await Database
            .table('ads')
            .groupBy('updated_at')
            .limit(10)
        return view.render('/', { ads : ads });
    }
}

module.exports = AdController
