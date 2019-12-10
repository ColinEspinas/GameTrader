'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GameSchema extends Schema {
  up () {
    this.create('games', (table) => {
      table.increments()
		table.string('key', 80)
		table.string('name', 255);
      table.text('genres', 'longtext')
      table.integer('ad_id').unsigned().references('id').inTable('ads')
      table.integer('account_id').unsigned().references('id').inTable('accounts')
      table.integer('gamedata_id').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('games')
  }
}

module.exports = GameSchema
