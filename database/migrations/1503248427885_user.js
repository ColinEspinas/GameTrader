'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
	  table.increments()
      table.string('username', 80).notNullable()
      table.string('email', 254).notNullable().unique()
	  table.string('password', 60).notNullable()
	  table.string('avatar', 255)
	  table.text('bio')
	  table.boolean('isSeller')
	  table.boolean('isVerified')
	  table.float('rating')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
