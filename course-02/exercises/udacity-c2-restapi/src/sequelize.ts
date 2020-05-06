import {Sequelize} from 'sequelize-typescript';
import { config } from './config/config';


const c = config.dev;

// Instantiate new Sequelize instance!
export const sequelize = new Sequelize({
  "username": c.db.username,
  "password": c.db.password,
  "database": c.db.database,
  "host":     c.db.host,

  dialect: 'postgres',
  storage: ':memory:',
});

