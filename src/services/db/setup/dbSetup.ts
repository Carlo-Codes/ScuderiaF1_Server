import { env } from 'process';
import {Knex, TableBuilder, knex} from 'knex'
import User, { Tables } from 'knex/types/tables';
import { db } from '../knexfile'

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
    table.string('user_id').notNullable()
    table.integer('competition_id').notNullable()
    table.unique(['user_id', 'competition_id'])
    table.boolean('points_calculated').defaultTo(false)
    table.boolean('editable').defaultTo(false)
    
    table.integer('tier1_driver_id').defaultTo(null)
    table.integer('tier2_driver_id').defaultTo(null)
    table.integer('tier3_driver_id').defaultTo(null)
    table.integer('dnf_driver_id').defaultTo(null)
    table.integer('fastest_lap_driver_id').defaultTo(null)

    table.integer('tier1_points').defaultTo(null)
    table.integer('tier2_points').defaultTo(null)
    table.integer('tier3_points').defaultTo(null)
    table.integer('dnf_points').defaultTo(null)
    table.integer('fastest_lap_points').defaultTo(null)

  })
}

async function createTeamsResultsTable() {
  await db.schema.withSchema('public').createTable('teamResults', function (table: Knex.CreateTableBuilder){
    table.bigIncrements('id').primary()

    table.integer('team_id').notNullable()
    table.foreign('team_id').references('teams.id')
    
    table.integer('tier1_driver_id').defaultTo(null)
    table.integer('tier2_driver_id').defaultTo(null)
    table.integer('tier3_driver_id').defaultTo(null)
    table.integer('dnf_driver_id').defaultTo(null)
  })
}


async function createDraftTeamsTable() {
  await db.schema.withSchema('public').createTable('draftTeams', function (table: Knex.CreateTableBuilder){
    table.bigIncrements('id').primary()
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id')
    table.integer('competition_id').defaultTo(null)
    table.integer('tier1_driver_id').defaultTo(null)
    table.integer('tier2_driver_id').defaultTo(null) 
    table.integer('tier3_driver_id').defaultTo(null)
    table.integer('dnf_driver_id').defaultTo(null)
  })
}

async function createLeagesTable(){
  await db.schema.withSchema('public').createTable('leagues', function(table: Knex.CreateTableBuilder){
    table.bigIncrements('id').primary()
    table.string('owner_user_id')
    table.string('league_name')
    table.string('inviteCode').unique().notNullable()
  })
}

async function createUserLeagueRelationTable(){
  await db.schema.withSchema('public').createTable('UserLeagueRelation', function (table: Knex.CreateTableBuilder){
    table.bigIncrements('id').primary() 
    table.string('user_id')
    table.integer('league_id').references('leagues.id')
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

async function createDriverTierStore(){
  await db.schema.withSchema('public').createTable('DriverTierStore', function (table: Knex.CreateTableBuilder){
    table.bigIncrements('id').primary()
    table.json('tiers') 
  })
}

async function createRaceResults(){
  await db.schema.withSchema('public').createTable('RaceResultsStore', function (table: Knex.CreateTableBuilder){
    table.bigInteger('id').primary()
    table.json('results')
  })
}

async function createFastestLapsResults(){
  await db.schema.withSchema('public').createTable('FastestLapsResultsStore', function (table: Knex.CreateTableBuilder){
    table.bigInteger('id').primary()
    table.json('results')
  })
}

async function createUsernamesTable(){
  await db.schema.withSchema('public').createTable('Usernames', function (table: Knex.CreateTableBuilder){
    table.string('user_id').unique()
    table.string('username')
  }) 
}

 
  export{createUsernamesTable, createFastestLapsResults, createRaceResults, createDriverTierStore, createTeamsResultsTable, createUserLeagueRelationTable,createDraftTeamsTable, createUserTable, createDriverTable, createTeamsTable, createLeagesTable, createRacesApiStore, createDriverApiStore}
   
 
  
 