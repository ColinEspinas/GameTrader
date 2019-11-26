'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdSchema extends Schema {
  up () {
    this.create('ads', (table) => {
	  table.increments()
	  table.string('title', 100)
	  table.text('content')
	  table.integer('seller_id')
	  table.boolean('isAccount')
      table.timestamps()
    })
  }

  down () {
    this.drop('ads')
  }
}

module.exports = AdSchema
