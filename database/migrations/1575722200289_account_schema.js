'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AccountSchema extends Schema {
  up () {
    this.create('accounts', (table) => {
      table.increments()
      table.string('username', 80).notNullable()
      table.string('password', 60).notNullable()
    //   table.string('country', 60)
      table.integer('gameAmount')
      table.integer('ad_id').unsigned().references('id').inTable('ads')
      table.timestamps()
    })
  }

  down () {
    this.drop('accounts')
  }
}

module.exports = AccountSchema
