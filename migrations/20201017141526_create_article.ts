import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('article', function (table) {
    table
      .uuid('article_id')
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('article_nme').nullable();
    table.uuid('created_user_id').notNullable();
    table.foreign('created_user_id').references('user_id').inTable('user');
    table.timestamp('created_tms').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_tms').notNullable().defaultTo(knex.fn.now());
    table.uuid('group_id').nullable();
    table.foreign('group_id').references('group_id').inTable('group');

    table.boolean('only_me').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('article');
}
