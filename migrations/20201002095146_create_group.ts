import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('group', function (table) {
    table
      .uuid('group_id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('created_user_id').notNullable();
    table.foreign('created_user_id').references('user_id').inTable('user');
    table.text('group_nme').notNullable();
    table.text('group_intro').nullable();
    table.timestamp('created_tms').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_tms').notNullable().defaultTo(knex.fn.now());
    table.boolean('deleted').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('group');
}
