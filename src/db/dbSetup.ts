import { env } from 'process';
import {Knex, TableBuilder, knex} from 'knex'
import User, { Tables } from 'knex/types/tables';
import { db } from '../main';

async function createUserTable(){
    await db.schema.withSchema('public').createTable('users', function (table: Knex.CreateTableBuilder){
      table.bigIncrements('id').primary()
      table.string('email').unique();
      }
    )
}

async function createDriverTable(){
  await db.schema.withSchema('public').createTable('drivers', function (table: Knex.CreateTableBuilder){
      table.bigIncrements('id').primary();
      table.string('first_name')
      table.string('second_name')
      table.integer('car_number')
      table.integer('tier')
  })
}


async function createTeamsTable() {
  await db.schema.withSchema('public').createTable('teams', function (table: Knex.CreateTableBuilder){
    table.bigIncrements('id').primary()
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id')
    table.integer('league_id').defaultTo(null)
    table.foreign('league_id').references('leagues.id')
    table.integer('tier1_driver_id').defaultTo(null)
    table.foreign('tier1_driver_id').references('drivers.id')
    table.integer('tier2_driver_id').defaultTo(null)
    table.foreign('tier2_driver_id').references('drivers.id')
    table.integer('tier3_driver_id').defaultTo(null)
    table.foreign('tier3_driver_id').references('drivers.id')
    table.integer('dnf_driver_id').defaultTo(null)
    table.foreign('dnf_driver_id').references('drivers.id')
    table.string('team_name').notNullable()
  })
}

async function createLeagesTable(){
  await db.schema.withSchema('public').createTable('leagues', function(table: Knex.CreateTableBuilder){
    table.bigIncrements('id').primary()
    table.integer('user_id')
    table.foreign('user_id').references('users.id')
    table.string('league_name')
  })
}

async function createRacesApiStore(){
  await db.schema.withSchema('public').createTable('RacesApiStore', function (table: Knex.CreateTableBuilder){
    table.bigIncrements('id').primary()
    table.json('response')
  })
}

async function createDriverApiStore(){
  await db.schema.withSchema('public').createTable('DriverApiStore', function (table: Knex.CreateTableBuilder){
    table.bigIncrements('id').primary()
    table.json('response')
  })
}


 
 
  export{createUserTable, createDriverTable, createTeamsTable, createLeagesTable, createRacesApiStore, createDriverApiStore}
  
 
  
 