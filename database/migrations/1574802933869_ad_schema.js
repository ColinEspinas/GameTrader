'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdSchema extends Schema {
  up () {
    this.create('ads', (table) => {
      table.increments()
      table.string('title', 100)
	  table.text('content')
	  table.integer('price')
	  table.string('thumbmail', 500)
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('category_id').unsigned().references('id').inTable('categories')
      table.timestamps()
    })
  }

  down () {
    this.drop('ads')
  }
}

module.exports = AdSchema
