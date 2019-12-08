'use strict'

const User = use('App/Models/User');
const { validate } = use('Validator');

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
		return view.render('pages.user.profile', { user : user.toJSON() });
	}

	async edit({ view, params }) {
		const user = await User.find(params.id);
		return view.render('pages.user.profile', { user : user.toJSON() });
	}

    async update({ request, response, session, params }) {
        const { username, email, password, passwordNew, avatar, bio } = request.all();

        const rules = {
            username: 'required',
            email: 'email|required',
            password: 'required',
        }
        
        const user = await User.find(params.id);

        if (email != user.email) rules.email = 'email|required|unique:users';

        const validation = await validate(request.all(), rules);
        if (validation.fails()) {
            session
                .withErrors(validation.messages())
                .flashAll()
            
            //return response.redirect('/signup'); //
            return response.redirect(`/user/${user.id}/edit`);
        }

        user.username = username;
        user.email = email;
        if (passwordNew != null) user.password = passwordNew;
        user.avatar = avatar;
        user.bio = bio;

        await user.save();

        return response.redirect('/');
    }
}

module.exports = UserController
