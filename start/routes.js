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

Route.get('/', 'HomeController.index');

Route.on('/signup').render('pages.auth.signup');
Route.post('/signup', 'UserController.create').validator('CreateUser');

Route.on('/login').render('pages.auth.login');
Route.post('/login', 'UserController.login').validator('LoginUser');

Route.get('/logout', async ({ auth, response }) => {
    await auth.logout();
    return response.redirect('/');
});

Route.group(() => { 

	Route.get("/:id/ads", 'AdController.userIndex');
	Route.get("/ads", 'AdController.authUserIndex');

	Route.get("/:id", 'UserController.show');

	Route.get("/:id/edit", 'UserController.edit');
	Route.put("/:id/edit", 'UserController.update');

}).prefix('/users');

Route.group(() => {

	Route.get('/', 'SearchController.index');

	Route.get('/create', "AdController.create");
	Route.post('/create', 'AdController.store').validator('PostAd');

	Route.get("/:id", 'AdController.show');

	Route.get('/:id/delete', 'AdController.delete');
	
	Route.get('/:id/edit', 'AdController.edit');
	Route.put('/:id/edit', 'AdController.update');
	
}).prefix('/ads');

Route.group(() => {

	Route.get('/ads', 'SearchController.index');

}).prefix('/api');

// TO REMOVE
Route.get('/upload', 'UploadController.index');
Route.post('/upload', 'UploadController.upload');