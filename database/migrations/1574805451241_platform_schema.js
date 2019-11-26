'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlatformSchema extends Schema {
  up () {
    this.create('platforms', (table) => {
	  table.increments()
	  table.string('name', 80).unique()
	  table.string('image', 255)
	  table.text('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('platforms')
  }
}

module.exports = PlatformSchema
