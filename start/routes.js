'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('pages.home');

Route.on('/signup').render('auth.signup');
Route.post('/signup', 'UserController.create').validator('CreateUser');

Route.on('/login').render('auth.login');
Route.post('/login', 'UserController.login').validator('LoginUser');

Route.get('/logout', async ({ auth, response }) => {
    await auth.logout();
    return response.redirect('/');
});

Route.on('/profile').render('pages.profile');
Route.put('/profile', 'UserController.update');

Route.on('/ad-post').render('pages.posting')
Route.post('/ad-post', 'AdController.create').validator('PostAd');

Route.get('/ad-show', 'AdController.userIndex');
Route.group(() => {
    Route.get('/delete/:id', 'AdController.delete');
    Route.get('/edit/:id', 'AdController.edit');
    Route.post('/update/:id', 'AdController.update').validator('PostAd');
}).prefix('/ad-show');