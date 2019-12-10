'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Game extends Model {

	account() {
		return this.belongsTo('App/Models/Account');
	}

}

module.exports = Game
