'use strict'

const User = use('App/Models/User');
const { validate } = use('Validator');
const { formatDistance } = require('date-fns');
const Cloudinary = use('App/Services/Cloudinary');

class UserController {
    async create({ request, response, auth }) {
        const user = await User.create(request.only(['username','email','password']));

        await auth.login(user);
        return response.redirect('/');
    }

    async login({ request, auth, response, session }) {
        const { email, password } = request.all();

        try {
            await auth.attempt(email, password);
            return response.redirect('/');
        } catch (error) {
            session.flash({ loginError: 'These credentials do not work.' })
            return response.redirect('/login');
        }
    }

	async show({ view, params }) {
        const user = await User.find(params.id);
        const ads = await user.ads()
            .with('product')
            .with('category')
			.with('platform')
			.orderBy('updated_at', 'desc')
            .fetch();

        const userAds = ads.toJSON().map(ad => {
            switch(ad.category_id) {
				case 1:
					ad.product.genres = JSON.parse(ad.product.genres);
					break;
			}
            ad.date = formatDistance(new Date(ad.created_at), new Date(), { addSuffix: true })
            return ad;
        });

		return view.render('pages.user.profile', { user : user, ads : userAds });
	}

	async edit({ view, auth, params }) {
		const user = await User.find(params.id);
		if (user.id === auth.user.id) {
			return view.render('pages.user.settings', { user : user.toJSON() });
		}
	}

    async update({ request, auth, response, session, params }) {
		const avatar = request.file('avatar', { types: ['image'] } );
        const { username, email, password, passwordNew, bio } = request.all();

        const rules = {
            username: 'required',
            email: 'email|required',
			password: 'required'
        }
        
		const user = await User.find(params.id);
		
		if (user.id === auth.user.id) {
			if (email != user.email) rules.email = 'email|required|unique:users';

			const validation = await validate(request.all(), rules);
			if (validation.fails()) {
				session
					.withErrors(validation.messages())
					.flashAll()
				
				//return response.redirect('/signup'); //
				return response.redirect(`/users/${user.id}/edit`);
			}

			user.username = username;
			user.email = email;
			if (passwordNew != null) user.password = passwordNew;
			user.bio = bio;
			
			if (avatar)
			{
				const cloudinary_response = await Cloudinary.upload(avatar);
				user.avatar = cloudinary_response.url;
			}

			await user.save();

			return response.redirect('/');
		}
    }
}

module.exports = UserController
