'use strict'

const Ad = use('App/Models/Ad');

class AdController {
    async create({ request, response, auth, session }) {
        try {
            await auth.check();

            const ad = await Ad.create(request.only(['title','content']));
            ad.user_id = auth.user.id;
            await ad.save();

            return response.redirect('/');
        } catch (error) {
            session.flash({ postingError: 'You must be logged to post !' })
            return response.redirect('/posting');
        }
    }
}

module.exports = AdController
