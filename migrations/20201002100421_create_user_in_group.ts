import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_in_group', function (table) {
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('user_id').inTable('user');

    table.uuid('group_id').notNullable();
    table.foreign('group_id').references('group_id').inTable('group');

    table.boolean('approved').notNullable().defaultTo(false);

    table.timestamp('joined_tms').notNullable().defaultTo(knex.fn.now());

    table.text('apply_message').nullable();

    table.primary(['user_id', 'group_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_in_group');
}
