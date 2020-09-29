import * as Knex from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { GENDER_OPTIONS, UNKNOWN } from '../src/constants/user';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', function (table) {
    table
      .uuid('user_id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('nme').notNullable().defaultTo('');
    table.text('email_address').notNullable();
    table.text('phone_nbr').notNullable();
    table.text('icon_url').nullable();
    table.string('phone_nbr_verify_code', 6).nullable();
    table.timestamp('created_tms').notNullable().defaultTo(knex.fn.now());
    table.timestamp('last_login_tms').notNullable().defaultTo(knex.fn.now());
    table.boolean('onboard').defaultTo(false);
    table.boolean('deleted').defaultTo(false);
    table.enu('gender', GENDER_OPTIONS).defaultTo(UNKNOWN);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user');
}
