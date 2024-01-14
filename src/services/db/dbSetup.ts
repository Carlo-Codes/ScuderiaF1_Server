import { env } from 'process';
import {Knex, TableBuilder, knex} from 'knex'
import User, { Tables } from 'knex/types/tables';
import { db } from '../db/knexfile'

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
    table.integer('competition_id')
    table.integer('tier1_driver_id').defaultTo(null)
    table.integer('tier2_driver_id').defaultTo(null)
    table.integer('tier3_driver_id').defaultTo(null)
    table.integer('dnf_driver_id').defaultTo(null)
    table.string('team_name').notNullable()
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
    table.string('team_name').notNullable()
  })
}

async function createLeagesTable(){
  await db.schema.withSchema('public').createTable('leagues', function(table: Knex.CreateTableBuilder){
    table.bigIncrements('id').primary()
    table.integer('owner_user_id')
    table.foreign('owner_user_id').references('users.id')
    table.string('league_name')
    table.string('inviteCode').unique().notNullable()
  })
}

async function createTeamLeagueRelationTable(){
  await db.schema.withSchema('public').createTable('leagueTeamRelation', function (table: Knex.CreateTableBuilder){
    table.bigIncrements('id').primary() 
    table.integer('team_id').references('teams.id')
    table.string('league_inviteCode').references('leagues.inviteCode')
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

 
  export{createTeamsResultsTable, createTeamLeagueRelationTable,createDraftTeamsTable, createUserTable, createDriverTable, createTeamsTable, createLeagesTable, createRacesApiStore, createDriverApiStore}
   
 
  
 