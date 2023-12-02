import type { Knex } from "knex";
import { env } from 'process';
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: env.DB_HOST,
      port: env.DB_PORT as unknown as number,
      user: env.DB_USER,
      database: env.DB_NAME,
      password:env.DB_PASSWORD
    },
    debug:true
  },

  staging: {
    client: "postgesql",
    connection: {
      database: "my_db",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgesql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

module.exports = config;
