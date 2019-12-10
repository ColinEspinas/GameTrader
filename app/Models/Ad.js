'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { formatDistance, subDays } = require('date-fns');

class Ad extends Model {

	product() {
		switch (this.category_id)
        {
            case 1:
				return this.hasOne('App/Models/Game', 'product_id', 'id');
            case 2:
				return this.hasOne('App/Models/Account', 'product_id', 'id');
            default: break;
        }
	}

	account() {
		return this.hasOne('App/Models/Account', 'product_id', 'id');
	}

	game() {
		return this.hasOne('App/Models/Game', 'product_id', 'id');
	}

	category() {
		return this.belongsTo('App/Models/Category');
	}

	platform() {
		return this.belongsTo('App/Models/Platform');
	}

	date() {
		return formatDistance(new Date(this.created_at), new Date());
	}
}

module.exports = Ad
