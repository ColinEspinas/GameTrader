'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AccountSchema extends Schema {
  up () {
    this.create('accounts', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('avatar', 255)
      table.string('country', 60)
      table.integer('gameAmount')
      table.string('phoneNumber', 20)
      table.integer('ad_id').unsigned().references('id').inTable('ads')
      table.integer('platform_id').unsigned().references('id').inTable('platforms')
      table.timestamps()
    })
  }

  down () {
    this.drop('accounts')
  }
}

module.exports = AccountSchema
